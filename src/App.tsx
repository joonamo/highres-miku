import { observer } from 'mobx-react'
import * as React from 'react'
import { appViewModel, ImageInfo } from './AppViewModel'
import { Loading } from './Loading'
import { Paginator } from './Paginator'
import { Titlebar } from './Titlebar'
import { Disclaimer } from './Disclaimer'
import { Helmet } from 'react-helmet'

const renderResult = (result: ImageInfo | undefined) => {
  return !!result
    ? (
      <div className="tile is-parent">
        <div
          className="tile is-child card"
          key={result.link}>
          <a href={result.link} target="blank">
            <div className="card-image">
              <figure
                className="image is-4by3"
                style={{
                  backgroundImage: `url(${result.image})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center'
                }} />
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
    )
    : undefined
}

const renderResults = (results: ImageInfo[], depth: number = 0): JSX.Element[] | undefined => {
  const [_1, _2, ...rest] = results

  return !!_1 ?
    [
      <>
        <div className="tile is-ancestor is-horizontal" key={`parent-tile-${depth}`}>
          {[_1, _2].map(renderResult)}
        </div>
      </>,
      ...renderResults(rest, depth + 1) || []
    ]
    : undefined
}

@observer
class App extends React.Component {
  public render() {
    return (<>
      <Helmet>
        <title>Snow Miku {appViewModel.year ?? ""}</title>
        <meta name="description" content={`Browse Snow Miku ${appViewModel.year ?? ""} design competition entries in high resolution gallery`} />
      </Helmet>
      <Titlebar />
      <section className="section">
        <div className="container">
          <h2 className="title is-hidden-desktop">{appViewModel.viewMode === "Popular" ? "Most Popular Entries" : "Latest Entries"}</h2>
          <div>
            <Paginator />
            {
              !appViewModel.configuration || appViewModel.isLoading
                ? <Loading />
                : <>
                  {renderResults(appViewModel.imagesInfos)}
                  <Paginator />
                </>
            }
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
}

export default App
