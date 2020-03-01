from quart import Quart, Response, request, after_this_request
import json
from server.miku_scrape import getLatestMiku, getPopularMiku, getLatestYear
from server.executor import executor
import asyncio
import httpx
import traceback
from server.async_http_client import deleteClient, getClient

def noneOr(v, v1):
  if v is None:
    return v1
  else:
    return v

def getApp(developmentHost = None):
  app = Quart(__name__, static_folder=None)

  @app.after_serving
  async def shutdown():
    await deleteClient()

  @app.route("/api/healthcheck")
  async def healthCheck():
    return Response("ok", status=200)

  @app.route("/api/latest")
  async def latest():    
    try:
      page = int(noneOr(request.args.get('page'), "1"))
      year = noneOr(request.args.get('year'), "2020")
      v = await getLatestMiku(page, year)
    except:
      traceback.print_exc()
      return Response(status=500)

    # Prefetch next page to cache
    asyncio.ensure_future(getLatestMiku(page + 1, year))
    return Response(
        json.dumps(v),
        status=200
    )

  @app.route("/api/popular")
  async def popular():
    try:
      page = int(noneOr(request.args.get('page'), 1))
      year = noneOr(request.args.get('year'), "2020")
      v = await getPopularMiku(page, year)
    except:
      traceback.print_exc()
      return Response(status=500)

    # Prefetch next page to cache
    asyncio.ensure_future(getPopularMiku(page + 1, year))
    return Response(
      json.dumps(v),
      status=200
    )
  
  @app.route("/api/configuration")
  async def configuration():
    res = {
      "firstYear": 2012,
      "latestYear": await getLatestYear()
    }
    return Response(
      json.dumps(res),
      status=200
    )

  if developmentHost is not None:
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    async def devproxy(path):
      client = getClient()
      res = await client.get(f'{developmentHost}/{path}')
      return res.text

  return app
