import {observable} from 'mobx'

export interface ImageInfo {
  name: string,
  author: string,
  link: string,
  image: string
}

export type ViewMode = 'Latest' | 'Popular'

class AppViewModel {
  @observable public imagesInfos: ImageInfo[] = []
  @observable public isLoading: boolean = false
  @observable public viewMode: ViewMode = 'Latest'
  @observable public currentPage: number = 1
  @observable public pageCount: number = 1
  @observable public year: string = '2020'

  public constructor() {
    const currentUrl = new URL(window.location.href)
    const params = currentUrl.searchParams
    const path = currentUrl.pathname
    console.log('path:', path)
    switch (params.get('viewMode')){
      case 'Popular':
        this.viewMode = 'Popular'
        break
      default:
      case 'Latest':
        this.viewMode = 'Latest'
        break
    }
    this.currentPage = params.has('page') ? Number(params.get('page')) : 1
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

  public setPage(page: number) {
    if (this.currentPage !== page) {
      this.currentPage = Math.min(Math.max(page, 1), this.pageCount +1)
      this.reloadImages()
      this.setSearchParams()
    }
  }

  private setSearchParams() {
    const url = new URL(window.location.href)
    url.search = ""
    url.searchParams.set('page', String(this.currentPage))
    url.searchParams.set('viewMode', this.viewMode)
    history.pushState({}, '', url.href)
  }
}

export const appViewModel = new AppViewModel()