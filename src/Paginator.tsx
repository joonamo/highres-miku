/* eslint-disable jsx-a11y/anchor-is-valid */

import ClassNames from 'classnames'
import { observer } from 'mobx-react'
import * as React from 'react'
import { appViewModel } from './AppViewModel'

const FirstPage = observer(() => {
  return appViewModel.currentPage < 3
  ? <></>
  : pageLink(1)
})

const PrevPage = observer(() => {
  return <>
    {appViewModel.currentPage > 3 ? ellipsis : undefined}
    {appViewModel.currentPage > 1 ? pageLink(appViewModel.currentPage - 1) : undefined}
  </>
})

const ThisPage = observer(() => pageLink(appViewModel.currentPage, true))

const NextPage = observer(() => {
  return <>
    {appViewModel.currentPage < appViewModel.pageCount ? pageLink(appViewModel.currentPage + 1) : undefined}
    {appViewModel.currentPage < appViewModel.pageCount - 1 ? ellipsis : undefined}
  </>
})

const LastPage = observer(() => {
  return appViewModel.currentPage > appViewModel.pageCount - 2
    ? <></>
    : pageLink(appViewModel.pageCount)
})

export const Paginator = observer(() => {
    const { currentPage } = appViewModel
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
        <FirstPage />
        <PrevPage />
        <ThisPage />
        <NextPage />
        <LastPage />
      </ul>
    </nav>
  }
)

const pageLink = (page: number, isCurrent: boolean = false) => <li>
  <a
    className={ClassNames("pagination-link", { 'is-current': isCurrent })}
    key={`paginator_${page}`}
    onClick={appViewModel.setPage.bind(appViewModel, page)}>
    {page}
  </a>
</li>

const ellipsis = <li> <span>&hellip;</span> </li>
