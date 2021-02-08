# URLShortner
A self hosted url shortner that includes a JSON Database and a REST Api.

## Installation
Clone the repository and change directories into it:

```
git clone https://github.com/mehtaarn000/URLShortnerExample.git
cd URLShortnerExample
```

Then, install dependencies:

`npm install`

## Usage

Run `node index.js` or `npm run start` to start the server, and head to [http://localhost:3000](http://localhost:3000) in your webbrowser.

To test redirects, go to [http://localhost:3000/example](http://localhost:3000/example) in your webbrowser. You should be redirected to [https://amazon.com](https://amazon.com).

Or, input a url, and the server will return a randomly chosen id and url to you. Go to that given url, and voila!

## REST API usage

Run a post request with curl to the server, for example:

`curl --header "Content-Type: application/json"   --request POST   --data '{"url":"https://google.com"}' http://localhost:3000/api/urlshorten`

The API should return a JSON object with your url. Go to the url and you will be redirected.

