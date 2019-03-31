import { observer } from 'mobx-react'
import * as React from 'react';
import { appViewModel, ImageInfo } from './AppViewModel'
import { Titlebar } from './Tilebar';

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
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center'
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
    return (<>
      <Titlebar />
      <section className="section">
        <div className="container">
          <h2 className="title is-hidden-desktop">{appViewModel.viewMode === "Popular" ? "Most Popular Entries" : "Latest Entries"}</h2>
          <div>
            {
              appViewModel.isLoading
                ?   <p>Loading...</p>
                : <>
                  {renderResults(appViewModel.imagesInfos)}
                  </>
            }
          </div>
        </div>
      </section>
    </>
    )
  }
}

export default App
