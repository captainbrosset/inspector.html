### inspector.html

This is a prototype inspector written without any XUL and based on React and Redux.

#### Getting Started

```js
$ npm install
$ npm start
```

Start Firefox in remote debugging mode and go to a tab you want to inspect.

```
$ /Applications/FirefoxNightly.app/Contents/MacOS/firefox-bin --start-debugger-server 6080
$ node_modules/.bin/firefox-proxy
```

Open the inspector.

```
$ open index.html
```
