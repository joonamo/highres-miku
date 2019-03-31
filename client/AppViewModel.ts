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

  public constructor() {
    const params = new URL(window.location.href).searchParams
    switch (params.get('viewMode')){
      case 'Popular':
        this.viewMode = 'Popular'
        break
      default:
      case 'Latest':
        this.viewMode = 'Latest'
        break
    }
  }

  public reloadImages() {
    this.isLoading = true
    const url = this.viewMode === 'Latest' ? '/api/latest' : '/api/popular'
    fetch(url).then(async r => {
      this.imagesInfos = (await r.json()).results
    })
    .catch(e => console.log(e))
    .finally(() => this.isLoading = false)
  }

  public setViewMode(mode: ViewMode) {
    if (mode !== this.viewMode) {
      this.viewMode = mode
      this.reloadImages()
      const url = new URL(window.location.href)
      url.searchParams.set('viewMode', mode)
      history.replaceState({}, '', url.href)
    }
  }
}

export const appViewModel = new AppViewModel()