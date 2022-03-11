/* eslint-disable no-unused-vars */
import ClassNames from "classnames"
import * as React from "react"
import { Link } from "react-router-dom"

import { ViewMode } from "./AppViewModel"

interface PaginatorProps {
  currentPage: number
  pageCount: number
  year: string | null
  viewMode: ViewMode
}

export const Paginator: React.FunctionComponent<PaginatorProps> = ({
  currentPage,
  pageCount,
  year,
  viewMode,
}) => {
  const pagePrefix = React.useMemo(
    () => `/${year}/${viewMode}`,
    [year, viewMode]
  )
  return (
    <nav className="pagination" role="navigation" aria-label="pagination">
      <Link
        className="pagination-previous has-background-white"
        to={`${pagePrefix}/${Math.max(1, currentPage - 1)}`}
      >
        Previous
      </Link>
      <Link
        className="pagination-next has-background-white"
        to={`${pagePrefix}/${Math.min(pageCount, currentPage + 1)}`}
      >
        Next
      </Link>
      <ul className="pagination-list">
        <FirstPage
          pagePrefix={pagePrefix}
          currentPage={currentPage}
          pageCount={pageCount}
        />
        <PrevPage
          pagePrefix={pagePrefix}
          currentPage={currentPage}
          pageCount={pageCount}
        />
        <ThisPage
          pagePrefix={pagePrefix}
          currentPage={currentPage}
          pageCount={pageCount}
        />
        <NextPage
          pagePrefix={pagePrefix}
          currentPage={currentPage}
          pageCount={pageCount}
        />
        <LastPage
          pagePrefix={pagePrefix}
          currentPage={currentPage}
          pageCount={pageCount}
        />
      </ul>
    </nav>
  )
}

interface PageLinkProps {
  currentPage: number
  pageCount: number
  pagePrefix: string
}

const FirstPage: React.FunctionComponent<PageLinkProps> = ({
  currentPage,
  pagePrefix,
}) => {
  return currentPage < 3 ? <></> : <PageLink page={1} pagePrefix={pagePrefix} />
}

const PrevPage: React.FunctionComponent<PageLinkProps> = ({
  currentPage,
  pagePrefix,
}) => {
  return (
    <>
      {currentPage > 3 ? <Ellipsis /> : null}
      {currentPage > 1 ? (
        <PageLink page={currentPage - 1} pagePrefix={pagePrefix} />
      ) : null}
    </>
  )
}

const ThisPage: React.FunctionComponent<PageLinkProps> = ({
  currentPage,
  pagePrefix,
}) => (
  <PageLink page={currentPage} pagePrefix={pagePrefix} isActivePage={true} />
)

const NextPage: React.FunctionComponent<PageLinkProps> = ({
  currentPage,
  pagePrefix,
  pageCount,
}) => {
  return (
    <>
      {currentPage < pageCount ? (
        <PageLink page={currentPage + 1} pagePrefix={pagePrefix} />
      ) : undefined}
      {currentPage < pageCount - 1 ? <Ellipsis /> : undefined}
    </>
  )
}

const LastPage: React.FunctionComponent<PageLinkProps> = ({
  currentPage,
  pagePrefix,
  pageCount,
}) => {
  return currentPage > pageCount - 2 ? (
    <></>
  ) : (
    <PageLink page={pageCount} pagePrefix={pagePrefix} />
  )
}

interface ActualPageLinkProps {
  isActivePage?: boolean
  page: number
  pagePrefix: string
}
const PageLink: React.FunctionComponent<ActualPageLinkProps> = ({
  isActivePage,
  pagePrefix,
  page,
}) => (
  <li>
    <Link
      className={ClassNames("pagination-link", {
        "is-current": isActivePage,
        "has-background-white": !isActivePage,
      })}
      key={`paginator_${page}`}
      to={`${pagePrefix}/${page}`}
    >
      {page}
    </Link>
  </li>
)

const Ellipsis: React.FunctionComponent = () => (
  <li>
    {" "}
    <span>&hellip;</span>{" "}
  </li>
)
