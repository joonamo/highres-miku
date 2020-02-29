from flask import Flask, Response, request, after_this_request
import json
from server.miku_scrape import getLatestMiku, getPopularMiku, getLatestYear
from server.executor import executor
import traceback
from requests import get

def noneOr(v, v1):
  if v is None:
    return v1
  else:
    return v

def getApp(developmentHost = None):
  app = Flask(__name__, static_folder=None)

  @app.route("/api/healthcheck")
  def healthCheck():
    return Response("ok", status=200)

  @app.route("/api/latest")
  def latest():    
    try:
      page = int(noneOr(request.args.get('page'), "1"))
      year = noneOr(request.args.get('year'), "2020")
      v = getLatestMiku(page, year)
    except:
      traceback.print_exc()
      return Response(status=500)

    # Prefetch next page to cache
    executor.submit(getLatestMiku, page + 1, year)
    return Response(
        json.dumps(v),
        status=200
    )

  @app.route("/api/popular")
  def popular():
    try:
      page = int(noneOr(request.args.get('page'), 1))
      year = noneOr(request.args.get('year'), "2020")
      v = getPopularMiku(page, year)
    except:
      traceback.print_exc()
      return Response(status=500)

    # Prefetch next page to cache
    executor.submit(getPopularMiku, page + 1, year)
    return Response(
      json.dumps(v),
      status=200
    )
  
  @app.route("/api/configuration")
  def configuration():
    res = {
      "firstYear": 2012,
      "latestYear": getLatestYear()
    }
    return Response(
      json.dumps(res),
      status=200
    )

  if developmentHost is not None:
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def devproxy(path):
      # print("dev proxy: " + f'{developmentHost}/{path}')
      return get(f'{developmentHost}/{path}').content

  return app
