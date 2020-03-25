# Iterate Helper

<a href="https://codeclimate.com/repos/5e6793ca24fdbc2b54003225/maintainability"><img src="https://api.codeclimate.com/v1/badges/14c1e0c0c90ccf652912/maintainability" /></a>

Helper script enabling iframe-based website surveys

# Build

Run the following command to compile src/helper.js into dist/helper-{hash}.js using google closure compiler
`docker-compose run helper build/compile.sh`

# Local Development

1. `docker-compose up`
2. [http://localhost:8084/helper.js](http://localhost:8084/helper.js)
