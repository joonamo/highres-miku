from flask import Flask, Response, request
import json
from server.miku_scrape import getLatestMiku, getPopularMiku
from flask_cors import CORS
from werkzeug.contrib.cache import SimpleCache
from whitenoise import WhiteNoise
import traceback

def noneOr(v, v1):
  if v is None:
    return v1
  else:
    return v

def getApp():
  app = Flask(__name__)
  CORS(app)
  cache = SimpleCache()

  @app.route("/api/latest")
  def latest():
    page = noneOr(request.args.get('page'), "1")
    cacheV = 'latest-%s' % page
    v = cache.get(cacheV)
    if v is None:
      try:
        v = getLatestMiku(page)
        cache.set(cacheV, v, 10 * 60)
      except:
        traceback.print_exc()
        return Response(status=500)
    return Response(
        json.dumps(v),
        status=200
    )

  @app.route("/api/popular")
  def popular():
    page = noneOr(request.args.get('page'), "1")
    cacheV = 'popular-%s' % page
    v = cache.get(cacheV)
    if v is None:
      try:
        v = getPopularMiku(page)
        cache.set(cacheV, v, 10 * 60)
      except:
        traceback.print_exc()
        return Response(status=500)
    return Response(
        json.dumps({'results': v}),
        status=200
    )

  app.wsgi_app = WhiteNoise(app.wsgi_app, root='build/', index_file=True, autorefresh=True)
  return app
