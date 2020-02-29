import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime
from server.cache import cache
from server.executor import executor

def getYearTag(year):
  tens = year[-2]
  ones = year[-1]
  return F"%EF%BC%92%EF%BC%90%EF%BC%9{tens}%EF%BC%9{ones}"

piaproUri = "https://piapro.jp/content_list/?view=image&tag=%s%%E5%%B9%%B4%%E9%%9B%%AA%%E3%%83%%9F%%E3%%82%%AF%%E8%%A1%%A3%%E8%%A3%%85&order=%s&page=%s"
latestTag = "sd"
popularTag = "cv"
imageRegex = re.compile('url\(//(.*)(0150_0150)(\..*)\)')
paginatorRegex = re.compile('new Paginator\(\'_paginator\', ([0-9]*)')

def getPageCount(text):
  try:
    return int(re.findall(paginatorRegex, text)[0])
  except:
    return 1

def getImageLink(s):
  groups = re.search(imageRegex, s).groups()
  return 'https://%s0740_0500%s' % (groups[0], groups[2])

def processItem(item):
  linkElem = item.find(class_='i_image')
  return {
    'name': item.find(class_='thumb_over').text,
    'author': item.find(class_='i_title').text,
    'link': "https://piapro.jp%s" % linkElem.attrs['href'],
    'image': getImageLink(linkElem.attrs['style'])
  }

def getLatestMiku(page = "1", year = "2020"):
  return processPage(piaproUri, getYearTag(year), latestTag, page)

def getPopularMiku(page="1", year = "2020"):
  return processPage(piaproUri, getYearTag(year), popularTag, page)

def processPage(url, yearTag, orderTag, page):
  url = (url % (yearTag, orderTag, page))
  print(url)
  cacheV = cache.get(url)
  if cacheV is None:
    try:
      r = requests.get(url)
    except requests.exceptions.SSLError:
      r = requests.get(url, verify="certs/piapro-jp-chain.pem")
    if r.status_code != 200:
      raise Exception("Bad status: %d" % r.status_code)
    soup = BeautifulSoup(r.text, 'html.parser')
    cacheV = {
      'results': list(map(processItem, soup.findAll('div', 'i_main'))),
      'pageCount': getPageCount(r.text)
    }
    cache.set(url, cacheV, 5 * 60)
  return cacheV

def getLatestYear():
  cacheV = cache.get("latest-year")
  if cacheV is None:
    currentYear = datetime.now().year
    for year in reversed(range(2012, currentYear + 2)):
      try:
        latest = getLatestMiku("1", str(year))
        # Also warmup cache for popular page
        executor.submit(getPopularMiku, "1", str(year))
        if len(latest["results"]) > 0:
          cacheV = year
          cache.set("latest-year", cacheV, 60 * 60)
          break
      except:
        pass
  return cacheV
