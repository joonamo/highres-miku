import requests
from bs4 import BeautifulSoup
import re

url = "https://piapro.jp/pages/official_collabo/2020snowmiku/list?page=%d"
imageRegex = re.compile('url\(//(.*)(0150_0150)(\..*)\)')

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

def getMikuPage(page = 1):
  r = requests.get((url % page))
  if r.status_code != 200:
    raise Exception("Bad status: %d" % r.status_code)
  soup = BeautifulSoup(r.text, 'html.parser')
  return list(map(processItem, soup.findAll('div', 'i_main')))
