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
    this.loadConfig()

    const currentUrl = new URL(window.location.href)
    const params = currentUrl.searchParams
    const path = currentUrl.pathname
    switch (params.get('viewMode')) {
      case 'Popular':
        this.viewMode = 'Popular'
        break
      case 'Latest':
        this.viewMode = 'Latest'
        break
      default:
        this.viewMode = defaultViewMode
    }
    this.currentPage = params.has('page') ? Number(params.get('page')) : 1
    const found = /\/(20\d\d)(\/|$)/.exec(path)
    if (found && found[1]) {
      this.setYear(found[1])
    }
  }

  public async loadConfig() {
    this.configuration = await (await fetch('/api/configuration')).json() as any

    if (!this.year && this.configuration?.latestYear) {
      this.setYear(String(this.configuration?.latestYear))
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
    url.pathname = `/${this.year}`
    url.search = ""
    url.searchParams.set('page', String(this.currentPage))
    url.searchParams.set('viewMode', this.viewMode)
    history.pushState({}, '', url.href)
  }
}

export const appViewModel = new AppViewModel()