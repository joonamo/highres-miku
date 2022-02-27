/* eslint-disable no-unused-vars */
import ClassNames from "classnames"
import * as React from "react"

interface PaginatorProps {
  changePage: (newPage: number) => void
  currentPage: number
  pageCount: number
}

export const Paginator: React.FunctionComponent<PaginatorProps> = ({
  currentPage,
  changePage,
  pageCount,
}) => {
  return (
    <nav className="pagination" role="navigation" aria-label="pagination">
      <a
        className="pagination-previous"
        onClick={() => changePage(currentPage - 1)}
      >
        Previous
      </a>
      <a
        className="pagination-next"
        onClick={() => changePage(currentPage + 1)}
      >
        Next
      </a>
      <ul className="pagination-list">
        <FirstPage
          changePage={changePage}
          currentPage={currentPage}
          pageCount={pageCount}
        />
        <PrevPage
          changePage={changePage}
          currentPage={currentPage}
          pageCount={pageCount}
        />
        <ThisPage
          changePage={changePage}
          currentPage={currentPage}
          pageCount={pageCount}
        />
        <NextPage
          changePage={changePage}
          currentPage={currentPage}
          pageCount={pageCount}
        />
        <LastPage
          changePage={changePage}
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
  changePage: (newPage: number) => void
}

const FirstPage: React.FunctionComponent<PageLinkProps> = ({
  currentPage,
  changePage,
}) => {
  return currentPage < 3 ? <></> : <PageLink page={1} changePage={changePage} />
}

const PrevPage: React.FunctionComponent<PageLinkProps> = ({
  currentPage,
  changePage,
}) => {
  return (
    <>
      {currentPage > 3 ? <Ellipsis /> : null}
      {currentPage > 1 ? (
        <PageLink page={currentPage - 1} changePage={changePage} />
      ) : null}
    </>
  )
}

const ThisPage: React.FunctionComponent<PageLinkProps> = ({
  currentPage,
  changePage,
}) => (
  <PageLink page={currentPage} changePage={changePage} isActivePage={true} />
)

const NextPage: React.FunctionComponent<PageLinkProps> = ({
  currentPage,
  changePage,
  pageCount,
}) => {
  return (
    <>
      {currentPage < pageCount ? (
        <PageLink page={currentPage + 1} changePage={changePage} />
      ) : undefined}
      {currentPage < pageCount - 1 ? <Ellipsis /> : undefined}
    </>
  )
}

const LastPage: React.FunctionComponent<PageLinkProps> = ({
  currentPage,
  changePage,
  pageCount,
}) => {
  return currentPage > pageCount - 2 ? (
    <></>
  ) : (
    <PageLink page={pageCount} changePage={changePage} />
  )
}

interface ActualPageLinkProps {
  isActivePage?: boolean
  page: number
  changePage: (newPage: number) => void
}
const PageLink: React.FunctionComponent<ActualPageLinkProps> = ({
  isActivePage,
  changePage,
  page,
}) => (
  <li>
    <a
      className={ClassNames("pagination-link", { "is-current": isActivePage })}
      key={`paginator_${page}`}
      onClick={() => changePage(page)}
    >
      {page}
    </a>
  </li>
)

const Ellipsis: React.FunctionComponent = () => (
  <li>
    {" "}
    <span>&hellip;</span>{" "}
  </li>
)
