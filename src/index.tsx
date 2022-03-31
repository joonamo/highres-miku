import "./styles/sass/style.scss"

import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { App } from "./App"

const root = ReactDOM.createRoot(document.getElementById("root")!)

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path=":year" element={<App />}>
          <Route path=":viewMode" element={<App />}>
            <Route path=":currentPage" element={<App />}>
              {/* All the routes lead to ~Rome~ <App /> */}
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
)
