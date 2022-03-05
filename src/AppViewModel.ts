/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState } from "react"

export interface ImageInfo {
  name: string
  author: string
  link: string
  image: string
  authorIcon: string
}

export interface Configuration {
  latestYear: number
  firstYear: number
}

export interface AppViewModel {
  imagesInfos: ImageInfo[]
  isLoading: boolean
  viewMode: ViewMode
  year: string | null
  currentPage: number
  pageCount: number
  configuration: Configuration | null
  changeViewMode: (newMode: ViewMode) => void
  changeYear: (newYear: string) => void
  changePage: (newPage: number) => void
}

export type ViewMode = "Latest" | "Popular"
const defaultViewMode =
  // eslint-disable-next-line no-undef
  process.env.REACT_APP_DEFAULT_VIEW_MODE === "Latest" ? "Latest" : "Popular"

export const useAppViewModel = (): AppViewModel => {
  const [imagesInfos, setImageInfos] = useState<ImageInfo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode)
  const [year, setYear] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageCount, setPageCount] = useState<number>(1)
  const [configuration, setConfiguration] = useState<Configuration | null>(null)

  // Setup basics
  useEffect(() => {
    const currentUrl = new URL(window.location.href)
    const path = currentUrl.pathname
    const year = /\/(20\d\d)(\/|$)/.exec(path)
    if (year && year[1]) {
      setYear(year[1])
    }
    const viewMode = /\/(popular|latest)(\/|$)/.exec(path.toLowerCase())
    if (!viewMode) {
      setViewMode(defaultViewMode)
    } else {
      const newViewMode =
        viewMode[1] === "popular"
          ? "Popular"
          : viewMode[1] === "latest"
          ? "Latest"
          : defaultViewMode
      setViewMode(newViewMode)
    }
    const page = /\/(\d\d?)(\/|$)/.exec(path)
    if (page) {
      setCurrentPage(Number(page[1]))
    }

    const loadConfig = async () => {
      const newConfiguration = (await (
        await fetch("/api/configuration")
      )
        // await fetch("https://snowmiku.net/api/configuration")
        .json()) as any
      setConfiguration(newConfiguration)

      if (!year && newConfiguration?.latestYear) {
        setYear(String(newConfiguration?.latestYear))
      }
    }

    loadConfig()
  }, [])

  // Reload images
  useEffect(() => {
    if (viewMode && currentPage && year) {
      const url = new URL(window.location.href)
      // const url = new URL("https://snowmiku.net")
      setIsLoading(true)
      url.search = ""
      url.pathname = viewMode === "Latest" ? "/api/latest" : "/api/popular"
      url.searchParams.set("page", String(currentPage))
      url.searchParams.set("year", String(year))
      fetch(url.href)
        .then(async (r) => {
          const data = await r.json()
          setImageInfos(data.results)
          setPageCount(Number(data.pageCount))
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [viewMode, currentPage, year])

  const setSearchParams = useCallback(
    (overrides: {
      year?: string
      viewMode?: ViewMode
      currentPage?: number
    }) => {
      const url = new URL(window.location.href)
      url.pathname = `/${overrides.year ?? year}/${(
        overrides.viewMode ?? viewMode
      ).toLowerCase()}/${overrides.currentPage ?? currentPage}`
      history.pushState({}, "", url.href)
    },
    [year, viewMode, currentPage]
  )

  const changeViewMode = useCallback(
    (newMode: ViewMode) => {
      if (newMode !== viewMode) {
        setCurrentPage(1)
        setViewMode(newMode)
        setSearchParams({ currentPage: 1, viewMode: newMode })
      }
    },
    [viewMode, setSearchParams]
  )

  const changeYear = useCallback(
    (newYear: string) => {
      if (newYear !== year) {
        const viewMode =
          newYear === String(configuration?.latestYear)
            ? defaultViewMode
            : "Popular"
        setViewMode(viewMode)
        setCurrentPage(1)
        setYear(newYear)
        setSearchParams({ currentPage: 1, year: newYear, viewMode })
      }
    },
    [year, setSearchParams, configuration?.latestYear]
  )

  const changePage = useCallback(
    (newPage: number) => {
      if (newPage !== currentPage) {
        setCurrentPage(Math.min(Math.max(newPage, 1), pageCount + 1))
        setSearchParams({ currentPage: newPage })
      }
    },
    [currentPage, pageCount, setSearchParams]
  )

  return {
    imagesInfos,
    isLoading,
    viewMode,
    year,
    currentPage,
    pageCount,
    configuration,
    changeViewMode,
    changeYear,
    changePage,
  }
}
