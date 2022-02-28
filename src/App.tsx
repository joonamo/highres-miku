import * as React from "react"
import { Helmet } from "react-helmet"

import { ImageInfo, useAppViewModel } from "./AppViewModel"
import { Disclaimer } from "./Disclaimer"
import { Loading } from "./Loading"
import { Paginator } from "./Paginator"
import { Titlebar } from "./Titlebar"

export const App: React.FunctionComponent = () => {
  const appViewModel = useAppViewModel()
  return (
    <>
      <Helmet>
        <title>Snow Miku {appViewModel.year ?? ""}</title>
        <meta
          name="description"
          content={`Browse Snow Miku ${
            appViewModel.year ?? ""
          } design competition entries in high resolution gallery`}
        />
      </Helmet>
      <Titlebar
        viewMode={appViewModel.viewMode}
        year={appViewModel.year}
        configuration={appViewModel.configuration}
        changeViewMode={appViewModel.changeViewMode}
        changeYear={appViewModel.changeYear}
      />
      <section className="section">
        <div className="container">
          <h2 className="title is-hidden-desktop">
            {appViewModel.viewMode === "Popular"
              ? "Most Popular Entries"
              : "Latest Entries"}
          </h2>
          <div>
            <Paginator
              changePage={appViewModel.changePage}
              currentPage={appViewModel.currentPage}
              pageCount={appViewModel.pageCount}
              key="head-paginator"
            />
            {!appViewModel.configuration || appViewModel.isLoading ? (
              <Loading key="loader" />
            ) : (
              <>
                <Results results={appViewModel.imagesInfos} />
                <Paginator
                  changePage={appViewModel.changePage}
                  currentPage={appViewModel.currentPage}
                  pageCount={appViewModel.pageCount}
                  key="footer-paginator"
                />
              </>
            )}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Disclaimer />
        </div>
      </section>
    </>
  )
}

interface ResultsProps {
  results: ImageInfo[]
  depth?: number
}
const Results: React.FunctionComponent<ResultsProps> = (props) => {
  const [_1, _2, ...rest] = props.results
  const depth = props.depth ?? 0

  return _1 ? (
    <>
      <div
        className="tile is-ancestor is-horizontal"
        key={`parent-tile-${depth}`}
      >
        {[_1, _2].map((r, i) => (
          <Result result={r} depth={depth} key={r?.link ?? `unknown-${i}`} />
        ))}
      </div>
      <Results results={rest} depth={depth + 1} />
    </>
  ) : null
}

interface ResultProps {
  result?: ImageInfo
  depth?: number
}
const Result: React.FunctionComponent<ResultProps> = ({ result, depth }) => {
  return result ? (
    <div className="tile is-parent" key={result.link}>
      <div className="tile is-child card" key={result.link}>
        <a href={result.link} target="blank">
          <div className="card-image">
            <figure className="image is-16by9">
              <img
                className="fit-contain"
                src={result.image}
                loading={depth === 0 ? "eager" : "lazy"}
              />
            </figure>
          </div>
          <div className="card-content">
            <div className="media-content">
              <p className="title is-5">{result.name}</p>
              <p className="subtitle is-5">{result.author}</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  ) : null
}
