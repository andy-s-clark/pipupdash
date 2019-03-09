# puppers

## Environment Variables

* `HEADLESS` - Defaults to `true`
* `SLOWMO` - Optional value in ms between characters typed into a form field
* `VIEWPORT_WIDTH` - Defaults to 1920
* `VIEWPORT_HEIGHT` - Defaults to 1080
* `REPEAT` - Number of times to repeat. Defaults to 0. A value of `-2` will repeat indefinitely.
* `SITES` - Required list of sites in JSON
  * `url` - Required URL
  * `wait` - Optional value in ms to wait after the site is loaded
  * `login` - Optional log in information.
    * `usernameSelector`
    * `passwordSelector`
    * `username`
    * `password`

## Running locally

        SITES='[{"url":"https://www.google.com/"},{"url":"https://slashdot.org/","wait":2000},{"url":"http://mysensuserver.mydomain:3000/","login":{"url":"http://mysensuserver.mydomain:3000/","usernameSelector":"input[name=\"username\"]","passwordSelector":"input[name=\"pass\"]","username":"adminuser","password":"adminpassword"}}]' node index.js

## Build

    dockerbuild -t puppers .

## Run in docker

    docker run -it --rm puppers