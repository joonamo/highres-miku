import { observer } from 'mobx-react'
import * as React from 'react';
import { appViewModel, ImageInfo } from './AppViewModel'

const renderResult = (result: ImageInfo | undefined) => {
  return !!result
    ? (
      <div className="tile is-parent">
        <div
          className="tile is-child box"
          key={result.link}>
          <a href={result.link} target="blank">
            <article>
              <figure
                className="image is-square box"
                style={{
                  backgroundImage: `url(${result.image})`,
                  // tslint:disable-next-line:object-literal-sort-keys
                  'background-position': 'center',
                  'background-repeat': 'no-repeat',
                  'background-size': 'contain'
        }} />
              <p className="title is-5">{result.name}</p>
              <p className="subtitle is-5">{result.author}</p>
            </article>
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
  public componentDidMount() {
    appViewModel.reloadImages()
  }
  public render() {
    return (
      <div className="container">
        <section className="hero">
          <div className="hero-body">
            <h1 className="title">
              Snow Miku 2020 Latest Entries
            </h1>
            <p className="subtitle">
              <a href="https://piapro.jp/pages/official_collabo/2020snowmiku/index" target="blank">
                Official contest pages
                  <span className="icon">
                    <i className="fas fa-external-link-alt"/>
                  </span>
              </a>
            </p>
          </div>
        </section>
        <div>
          {
            appViewModel.isLoading
              ? <div className="tile is-ancestor is-horizontal">
                <p>Loading...</p>
              </div>
              : renderResults(appViewModel.imagesInfos)
          }
        </div>
      </div>
    )
  }
}

export default App
