import * as ClassNames from 'classnames'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import * as React from 'react'
import { appViewModel } from './AppViewModel'

@observer
export class Titlebar extends React.Component {
  @observable private burgerOpen: boolean = false
  @observable private sortDropdownOpen: boolean = false

  constructor(props: any) {
    super(props)

    this.toggleBurger = this.toggleBurger.bind(this)
    this.toggleSortDropdown = this.toggleSortDropdown.bind(this)
    this.setLatest = this.setLatest.bind(this)
    this.setPopular = this.setPopular.bind(this)
  }

  public render() {
    return (
      <nav className="navbar is-info is-fixed-top" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            <p className="title has-text-white">Snow Miku 2020</p>
          </a>

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
            <div className={ClassNames("navbar-item", "has-dropdown", { 'is-active': this.sortDropdownOpen })}>
              <a className="navbar-link" onClick={this.toggleSortDropdown}>
                {`Sort: ${appViewModel.viewMode}`}
              </a>

              <div className={ClassNames("navbar-dropdown", {'is-hidden-touch': !this.sortDropdownOpen})}>
                <a className="navbar-item" onClick={this.setLatest}>
                  Latest
                </a>
                <a className="navbar-item" onClick={this.setPopular}>
                  Popular
                </a>
              </div>
            </div>

            <a href="https://piapro.jp/pages/official_collabo/2020snowmiku/index" target="blank" className="navbar-item">
              <span>Official contest pages </span>
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

  private toggleBurger() {
    this.burgerOpen = !this.burgerOpen
  }
  private toggleSortDropdown() {
    this.sortDropdownOpen = !this.sortDropdownOpen
  }
  private setLatest() {
    appViewModel.setViewMode('Latest')
    this.sortDropdownOpen = false
    this.burgerOpen = false
  }
  private setPopular() {
    appViewModel.setViewMode('Popular')
    this.sortDropdownOpen = false
    this.burgerOpen = false
  }
}
