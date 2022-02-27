/* eslint-disable no-restricted-globals */

import { observable } from 'mobx'

export interface ImageInfo {
  name: string,
  author: string,
  link: string,
  image: string
}

export interface Configuration {
  latestYear: number,
  firstYear: number
}

export type ViewMode = 'Latest' | 'Popular'
const defaultViewMode = process.env.REACT_APP_DEFAULT_VIEW_MODE as ViewMode || 'Popular'

class AppViewModel {
  @observable public imagesInfos: ImageInfo[] = []
  @observable public isLoading: boolean = false
  @observable public viewMode: ViewMode = defaultViewMode
  @observable public year: string | null = null
  @observable public currentPage: number = 1
  @observable public pageCount: number = 1
  @observable public configuration: Configuration | null = null

  public constructor() {
    const currentUrl = new URL(window.location.href)
    const path = currentUrl.pathname
    const year = /\/(20\d\d)(\/|$)/.exec(path)
    if (year && year[1]) {
      this.year = year[1]
    }
    const viewMode = /\/(popular|latest)(\/|$)/.exec(path.toLowerCase())
    if (!viewMode) {
      this.viewMode = defaultViewMode 
        this.viewMode = defaultViewMode
      this.viewMode = defaultViewMode 
        this.viewMode = defaultViewMode
      this.viewMode = defaultViewMode 
    } else {
      this.viewMode =
        viewMode[1] === 'popular' ? 'Popular' :
        viewMode[1] === 'latest' ? 'Latest' :
        defaultViewMode
    }
    const page = /\/(\d\d?)(\/|$)/.exec(path)
    if (!page) {
      this.currentPage = 1
    } else {
      this.currentPage = Number(page[1])
    }

    this.loadConfig()
    if (this.year) {
      this.reloadImages()
    }
  }

  public async loadConfig() {
    this.configuration = await (await fetch('/api/configuration')).json() as any

    if (!this.year && this.configuration?.latestYear) {
      this.year = String(this.configuration?.latestYear)
    }
    if (!this.isLoading && this.imagesInfos.length === 0) {
      this.reloadImages()
    } 
  }

  public reloadImages() {
    this.isLoading = true
    const url = new URL(window.location.href)
    url.search = ""
    url.pathname = (this.viewMode === 'Latest' ? '/api/latest' : '/api/popular')
    url.searchParams.set('page', String(this.currentPage))
    url.searchParams.set('year', String(this.year))
    fetch(url.href).then(async r => {
      const data = await r.json()
      this.imagesInfos = data.results
      this.pageCount = Number(data.pageCount)
    })
      .catch(e => console.log(e))
      .finally(() => {
        this.isLoading = false
      })
  }

  public setViewMode(mode: ViewMode) {
    if (mode !== this.viewMode) {
      this.currentPage = 1
      this.viewMode = mode
      this.reloadImages()
      this.setSearchParams()
    }
  }

  public setYear(year: string) {
    if (year !== this.year) {
      this.currentPage = 1
      this.year = year
      this.reloadImages()
      this.setSearchParams()
    }
  }

  public setPage(page: number) {
    if (this.currentPage !== page) {
      this.currentPage = Math.min(Math.max(page, 1), this.pageCount + 1)
      this.reloadImages()
      this.setSearchParams()
    }
  }

  private setSearchParams() {
    const url = new URL(window.location.href)
    url.pathname = `/${this.year}/${this.viewMode.toLowerCase()}/${this.currentPage}`
    history.pushState({}, '', url.href)
  }
}

export const appViewModel = new AppViewModel()