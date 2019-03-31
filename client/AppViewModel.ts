import {observable} from 'mobx'

export interface ImageInfo {
  name: string,
  author: string,
  link: string,
  image: string
}

class AppViewModel {
  @observable public imagesInfos: ImageInfo[] = []
  @observable public isLoading: boolean = false

  public reloadImages() {
    this.isLoading = true
    fetch('/api/popular').then(async r => {
      this.imagesInfos = (await r.json()).results
    })
    .catch(e => console.log(e))
    .finally(() => this.isLoading = false)
  }
}

export const appViewModel = new AppViewModel()