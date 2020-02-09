import requests
from bs4 import BeautifulSoup
import re

popularYearTag = {
  "2020": "%EF%BC%92%EF%BC%90%EF%BC%92%EF%BC%90",
  "2019": "%EF%BC%92%EF%BC%90%EF%BC%91%EF%BC%99",
  "2018": "%EF%BC%92%EF%BC%90%EF%BC%91%EF%BC%98",
  "2017": "%EF%BC%92%EF%BC%90%EF%BC%91%EF%BC%97",
  "2016": "%EF%BC%92%EF%BC%90%EF%BC%91%EF%BC%96",
  "2015": "%EF%BC%92%EF%BC%90%EF%BC%91%EF%BC%95",
}

latestUrl = "https://piapro.jp/pages/official_collabo/%ssnowmiku/list?page=%s"
popularUrl = "https://piapro.jp/content_list/?view=image&tag=%s%%E5%%B9%%B4%%E9%%9B%%AA%%E3%%83%%9F%%E3%%82%%AF%%E8%%A1%%A3%%E8%%A3%%85&order=cv&page=%s"
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
  return processPage(latestUrl, year, page)

def getPopularMiku(page="1", year = "2020"):
  return processPage(popularUrl, popularYearTag[year], page)

def processPage(url, yearTag, page):
  url = (url % (yearTag, page))
  r = requests.get(url)
  if r.status_code != 200:
    raise Exception("Bad status: %d" % r.status_code)
  soup = BeautifulSoup(r.text, 'html.parser')
  return {
    'results': list(map(processItem, soup.findAll('div', 'i_main'))),
    'pageCount': getPageCount(r.text)
  }
