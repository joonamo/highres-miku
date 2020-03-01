import httpx
import asyncio

_client = None

def getClient():
  global _client
  if _client is None:
    _client = httpx.AsyncClient()
  return _client

async def deleteClient():
  global _client
  if _client is not None:
    await _client.aclose()
