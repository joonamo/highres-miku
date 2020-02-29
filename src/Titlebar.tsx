/* eslint-disable jsx-a11y/anchor-is-valid */

import ClassNames from 'classnames'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import * as React from 'react'
import { appViewModel } from './AppViewModel'
import { Logo } from './logo'

@observer
export class Titlebar extends React.Component {
  @observable private burgerOpen: boolean = false
  @observable private sortDropdownOpen: boolean = false
  @observable private yearDropdownOpen: boolean = false

  generateYearSelectors = () => {
    if (appViewModel.configuration) {
      const selectors = []
      for (let year = appViewModel.configuration.latestYear; year >= appViewModel.configuration.firstYear; year--) {
        selectors.push(<a className="navbar-item" onClick={this.makeYearSetter(String(year))}>{year}</a>)
      }
      return selectors
    } else {
      return null
    }
  }

  yearSelector = (isTitle: boolean) =>
    <div className={ClassNames(
      "navbar-item",
      "has-dropdown",
      { 'is-active': this.yearDropdownOpen },
      isTitle ? "is-hidden-touch" : "is-hidden-desktop")}>
      <a className="navbar-link navbar-item" onClick={this.toggleYearDropdown}>
        <p className={isTitle ? "title has-text-white" : ""}>{!isTitle ? "Year:" : ""} {appViewModel.year}</p>
      </a>

      <div className={ClassNames("navbar-dropdown", { 'is-hidden-touch': !this.yearDropdownOpen })}>
        {this.generateYearSelectors()}
      </div>
    </div>

  public render() {
    return (
      <nav className="navbar is-info is-fixed-top add-shadow" role="navigation" aria-label="main navigation">
        <div className="logo-container">
          <Logo />
        </div>
        <div className="navbar-brand">

          <div className="navbar-item is-paddingless is-hidden-touch">
            <p className="title has-text-white">Snow Miku</p>
          </div>
          <div className="is-paddingless navbar-item is-hidden-desktop flex-1">
            <p className="title flex-1 has-text-white has-text-right-mobile">Snow Miku {appViewModel.year}</p>
          </div>

          {this.yearSelector(true)}

          <a
            role="button"
            className={ClassNames("navbar-burger", { 'is-active': this.burgerOpen })}
            aria-label="menu"
            aria-expanded="false"
            onClick={this.toggleBurger}>
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </a>
        </div>

        <div className={ClassNames("navbar-menu", { 'is-active': this.burgerOpen })}>
          <div className="navbar-start">
            {this.yearSelector(false)}

            <div className={ClassNames("navbar-item", "has-dropdown", { 'is-active': this.sortDropdownOpen })}>
              <a className="navbar-link" onClick={this.toggleSortDropdown}>
                {`Sort: ${appViewModel.viewMode}`}
              </a>

              <div className={ClassNames("navbar-dropdown", { 'is-hidden-touch': !this.sortDropdownOpen })}>
                <a className="navbar-item" onClick={this.setLatest}>
                  Latest
                </a>
                <a className="navbar-item" onClick={this.setPopular}>
                  Popular
                </a>
              </div>
            </div>

            <a href="https://piapro.jp/pages/official_collabo/2020snowmiku/index" target="blank" className="navbar-item">
              <span>Official pages</span>
              <span className="icon">
                <i className="fas fa-external-link-alt" />
              </span>
            </a>

            <a href="https://www.mikufan.com/snow-miku-2020-and-rabbit-yukine-design-submissions-now-open-the-theme-is-musical-instrument/" target="blank" className="navbar-item">
              <span>Information in English (mikufan.com) </span>
              <span className="icon">
                <i className="fas fa-external-link-alt" />
              </span>
            </a>

          </div>
        </div>
      </nav>
    )
  }

  private toggleBurger = () => {
    if (this.burgerOpen) {
      this.closeAll()
    } else {
      this.burgerOpen = true
    }
  }
  private toggleSortDropdown = () => {
    if (this.sortDropdownOpen) {
      this.sortDropdownOpen = false
    } else {
      this.closeSubmenus()
      this.sortDropdownOpen = true
    }
  }
  private toggleYearDropdown = () => {
    if (this.yearDropdownOpen) {
      this.yearDropdownOpen = false
    } else {
      this.closeSubmenus()
      this.yearDropdownOpen = true
    }
  }
  private setLatest = () => {
    appViewModel.setViewMode('Latest')
    this.closeAll()
  }
  private setPopular = () => {
    appViewModel.setViewMode('Popular')
    this.closeAll()
  }
  private makeYearSetter = (year: string) => () => {
    appViewModel.setYear(year)
    this.closeAll()
  }
  private closeSubmenus = () => {
    this.yearDropdownOpen = false
    this.sortDropdownOpen = false
  }
  private closeAll = () => {
    this.closeSubmenus()
    this.burgerOpen = false
  }
}
