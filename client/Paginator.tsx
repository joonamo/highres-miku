import * as ClassNames from 'classnames'
import { observer } from 'mobx-react'
import * as React from 'react'
import { appViewModel } from './AppViewModel'

@observer
export class Paginator extends React.Component {
  public render() {
    const { currentPage, pageCount } = appViewModel
    return <nav className="pagination" role="navigation" aria-label="pagination">
      <a
        className="pagination-previous"
        onClick={appViewModel.setPage.bind(appViewModel, currentPage - 1)}>
          Previous
      </a>
      <a
        className="pagination-next"
        onClick={appViewModel.setPage.bind(appViewModel, currentPage + 1)}>
          Next
        </a>
      <ul className="pagination-list">
        {
          Array.from(Array(pageCount), (_, i) => {
            const page = i + 1
            return <li>
              <a 
                className={ClassNames("pagination-link", {'is-current': page === currentPage})}
                key={`paginator_${i}`}
                onClick={appViewModel.setPage.bind(appViewModel, page) }>
                  {page}
                </a>
            </li>
          })
        }
      </ul>
    </nav>
  }
}

{/* <nav class="pagination" role="navigation" aria-label="pagination">
  <a class="pagination-previous">Previous</a>
  <a class="pagination-next">Next page</a>
  <ul class="pagination-list">
    <li>
      <a class="pagination-link" aria-label="Goto page 1">1</a>
    </li>
    <li>
      <span class="pagination-ellipsis">&hellip;</span>
    </li>
    <li>
      <a class="pagination-link" aria-label="Goto page 45">45</a>
    </li>
    <li>
      <a class="pagination-link is-current" aria-label="Page 46" aria-current="page">46</a>
    </li>
    <li>
      <a class="pagination-link" aria-label="Goto page 47">47</a>
    </li>
    <li>
      <span class="pagination-ellipsis">&hellip;</span>
    </li>
    <li>
      <a class="pagination-link" aria-label="Goto page 86">86</a>
    </li>
  </ul>
</nav> */}