from flask import Flask, Response
import json
from server.miku_scrape import getMikuPage
from flask_cors import CORS
from werkzeug.contrib.cache import SimpleCache
from whitenoise import WhiteNoise

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

  app.wsgi_app = WhiteNoise(app.wsgi_app, root='client/build/', index_file=True)
  return app
