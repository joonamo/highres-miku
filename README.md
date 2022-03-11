# highres-miku

Simple Python and React app for scraping and displaying slightly more high-res thumbnails for Piapro's Snow Miku contest.

Tested to run on Dokku-host, should also work in Heroku.

Check it out at [https://snowmiku.net](https://snowmiku.net)!

Licenced under MIT licence, see LICENCE file.

## Development

### Requirements 

- [Python](https://www.python.org/) 3.8.x or newer
- [Pipenv](https://pipenv.pypa.io) Just some working version
- [Node.js](https://nodejs.org/en/) 14.x or newer
- [Yarn](https://yarnpkg.com/) 3.2.0 or newer

### Backend

1. Install dependencies
  * `$ pipenv install`
2. Start virtualenv
  * `$ pipenv shell`
3. Run backend
  * `$ sh run_devserver.sh` 
4. You now have the API server running in port 3939. Development server automatically reloads on Python file changes.

### Frontend

1. Install dependecies
  * `$ yarn`
2. Start Parcel packager
  * `$ yarn start-dev`
3. You now have front-end served at port 3000. Parcel proxies requests to the API server. Parcel offers hot module reload.
