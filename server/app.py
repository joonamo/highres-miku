from flask import Flask, Response
import json
from server.miku_scrape import getMikuPage
from flask_cors import CORS
from werkzeug.contrib.cache import SimpleCache

def getApp():
  app = Flask(__name__)
  CORS(app)
  cache = SimpleCache()

  @app.route("/latest")
  def latest():
    v = cache.get('latest')
    if v is None:
      try:
        v = getMikuPage()
        cache.set('latest', v, 30 * 60)
      except:
        return Response(status=500)
    return Response(
        json.dumps({'results': v}),
        status=200
    )

  return app
