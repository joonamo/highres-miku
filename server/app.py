from fastapi import FastAPI, Response
import json
from server.miku_scrape import getLatestMiku, getPopularMiku, getLatestYear
from server.executor import executor
import asyncio
import httpx
import traceback
from server.async_http_client import deleteClient, getClient

def getApp(developmentHost = None):
  app = FastAPI(debug=developmentHost is not None)

  @app.on_event("shutdown")
  async def shutdown():
    await deleteClient()

  @app.get("/api/healthcheck")
  async def healthCheck():
    return "ok"

  @app.get("/api/latest")
  async def latest(page: int = 1, year: str = "2020"):    
    v = await getLatestMiku(page, year)

    # Prefetch next page to cache
    asyncio.ensure_future(getLatestMiku(page + 1, year))
    return v


  @app.get("/api/popular")
  async def popular(page: int = 1, year: str = "2020"):
    v = await getPopularMiku(page, year)
    # Prefetch next page to cache
    asyncio.ensure_future(getPopularMiku(page + 1, year))
    return v
  
  @app.get("/api/configuration")
  async def configuration():
    res = {
      "firstYear": 2012,
      "latestYear": await getLatestYear()
    }
    return res

  if developmentHost is not None:
    @app.get('/{file_path:path}')
    async def devproxy(file_path: str):
      client = getClient()
      res = await client.get(f'{developmentHost}/{file_path}')
      return Response(
        content=res.text,
        media_type=res.headers.get('content-type'))

  return app
