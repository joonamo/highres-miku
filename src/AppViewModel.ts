/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useRef, useState } from "react"
import { useParams } from "react-router-dom"

import { defaultViewMode } from "./staticConfig"

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
}

export type ViewMode = "Latest" | "Popular"

const parseYear = (v: string | undefined): string | null => {
  const yearRe = /(20\d\d)/.exec(v ?? "")
  return yearRe && yearRe[1]
}

export const useAppViewModel = (): AppViewModel => {
  const [configuration, setConfiguration] = useState<Configuration | null>(null)

  const {
    year: yearP,
    viewMode: viewModeP,
    currentPage: currentPageP,
  } = useParams()
  const [imagesInfos, setImageInfos] = useState<ImageInfo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const year = useMemo<string | null>(
    () =>
      parseYear(yearP) ?? (configuration && String(configuration?.latestYear)),
    [yearP, configuration?.latestYear]
  )
  const [abortController, setAbortController] = useState<AbortController>()
  const viewMode = useMemo<ViewMode>(() => {
    const v = viewModeP?.toLowerCase()
    return v === "popular"
      ? "Popular"
      : v === "latest"
      ? "Latest"
      : year === String(configuration?.latestYear)
      ? defaultViewMode
      : "Popular"
  }, [viewModeP, year, configuration?.latestYear])
  const currentPage = useMemo<number>(() => {
    return parseInt(currentPageP ?? "") || 1
  }, [currentPageP])
  const [pageCount, setPageCount] = useState<number>(1)

  // Setup basics
  useEffect(() => {
    const loadConfig = async () => {
      const newConfiguration = (await (
        await fetch("/api/configuration")
      )
        // await fetch("https://snowmiku.net/api/configuration")
        .json()) as any
      setConfiguration(newConfiguration)
    }

    loadConfig()
  }, [])

  // Reload images
  useEffect(() => {
    if (viewMode && currentPage && year) {
      abortController?.abort()
      const newAbortController = new AbortController()
      setAbortController(newAbortController)
      const url = new URL(window.location.href)
      // const url = new URL("https://snowmiku.net")
      setIsLoading(true)
      url.search = ""
      url.pathname = viewMode === "Latest" ? "/api/latest" : "/api/popular"
      url.searchParams.set("page", String(currentPage))
      url.searchParams.set("year", String(year))
      fetch(url.href, { signal: newAbortController.signal })
        .then(async (r) => {
          const data = await r.json()
          setImageInfos(data.results)
          setPageCount(Number(data.pageCount))
          setIsLoading(false)
        })
        .catch((e) => {
          if (e.name !== "AbortError") {
            console.log(e.message)
            setIsLoading(false)
          }
        })
    }
  }, [viewMode, currentPage, year])

  return {
    imagesInfos,
    isLoading,
    viewMode,
    year,
    currentPage,
    pageCount,
    configuration,
  }
}
