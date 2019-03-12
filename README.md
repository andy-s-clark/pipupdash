# puppers

## S3 Policy

        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "VisualEditor0",
                    "Effect": "Allow",
                    "Action": [
                        "s3:PutObject",
                        "s3:GetObjectAcl",
                        "s3:PutObjectTagging",
                        "s3:DeleteObject",
                        "s3:PutObjectAcl"
                    ],
                    "Resource": "arn:aws:s3:::name-of-bucket-here/*"
                }
            ]
        }

## Environment Variables

* `AWS_ACCESS_KEY_ID` - Required
* `AWS_SECRET_ACCESS_KEY` - Required
* `AWS_BUCKET` - Required name of the S3 bucket
* `AWS_REGION` - Defaults to 'us-west-2'
* `HEADLESS` - Defaults to `true`
* `SLOWMO` - Optional value in ms between characters typed into a form field
* `VIEWPORT_WIDTH` - Defaults to 1920
* `VIEWPORT_HEIGHT` - Defaults to 1080
* `REPEAT` - Defaults to `false`
* `SITES` - Required list of sites in JSON
  * `url` - Required URL
  * `wait` - Optional value in ms to wait after the site is loaded
  * `login` - Optional log in information.
    * `usernameSelector`
    * `passwordSelector`
    * `username`
    * `password`

## Running locally

        AWS_ACCESS_KEY_ID=xxx AWS_SECRET_ACCESS_KEY=yyy AWS_BUCKET=my-bucket SITES='[{"url":"https://www.google.com/"},{"url":"https://slashdot.org/","wait":2000},{"url":"http://mysensuserver.mydomain:3000/","login":{"url":"http://mysensuserver.mydomain:3000/","usernameSelector":"input[name=\"username\"]","passwordSelector":"input[name=\"pass\"]","username":"adminuser","password":"adminpassword"}}]' node index.js

## Build

    dockerbuild -t puppers .

## Run in docker

    docker run -it --rm puppers