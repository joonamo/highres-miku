from flask import Flask, Response, request, after_this_request
import json
from server.miku_scrape import getLatestMiku, getPopularMiku
from werkzeug.contrib.cache import SimpleCache
import traceback
from requests import get
from concurrent.futures import ThreadPoolExecutor

def noneOr(v, v1):
  if v is None:
    return v1
  else:
    return v

def getApp(developmentHost = None):
  executor = ThreadPoolExecutor(2)
  cache = SimpleCache()
  app = Flask(__name__, static_folder=None)

  @app.route("/api/healthcheck")
  def healthCheck():
    return Response("ok", status=200)

  @app.route("/api/latest")
  def latest():
    def getLatestPage(page, year):
      cacheV = 'latest-%d-%s' % (page, year)
      v = cache.get(cacheV)
      if v is None:
        v = getLatestMiku(page, year)
        cache.set(cacheV, v, 10 * 60)
      return v
    
    try:
      page = int(noneOr(request.args.get('page'), "1"))
      year = noneOr(request.args.get('year'), "2020")
      v = getLatestPage(page, year)
    except:
      traceback.print_exc()
      return Response(status=500)

    # Prefetch next page to cache
    executor.submit(getLatestPage, page + 1)
    return Response(
        json.dumps(v),
        status=200
    )

  @app.route("/api/popular")
  def popular():
    def getPopularPage(page, year):
      cacheV = 'popular-%d-%s' % (page, year)
      v = cache.get(cacheV)
      if v is None:
        v = getPopularMiku(page, year)
        cache.set(cacheV, v, 10 * 60)
      return v

    try:
      page = int(noneOr(request.args.get('page'), 1))
      year = noneOr(request.args.get('year'), "2020")
      v = getPopularPage(page, year)
    except:
      traceback.print_exc()
      return Response(status=500)

    # Prefetch next page to cache
    executor.submit(getPopularPage, page + 1)
    return Response(
      json.dumps(v),
      status=200
    )

  if developmentHost is not None:
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def devproxy(path):
      # print("dev proxy: " + f'{developmentHost}/{path}')
      return get(f'{developmentHost}/{path}').content

  return app
