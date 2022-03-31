import * as React from "react"

export const VotingInfo = () => (
  <div className="card has-background-danger-light has-text-light mb-5">
    <div className="card-content">
      <p className="subtitle">
        Voting for Snow Miku 2023 is open 31st March ~ 11th April 2022.{" "}
        <span>
          <a
            href="https://event.goodsmile.info/snowmiku2023/en/"
            target="blank"
          >
            {/* eslint-disable-next-line no-irregular-whitespace */}
            Vote here!{" "}
            <span className="icon">
              <i className="fas fa-external-link-alt" />
            </span>
          </a>
        </span>
      </p>
    </div>
  </div>
)
