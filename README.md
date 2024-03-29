<img src=".erb/img/erb-banner.svg" width="100%" />

<br>

<p>
  Electron React Boilerplate uses <a href="https://electron.atom.io/">Electron</a>, <a href="https://facebook.github.io/react/">React</a>, <a href="https://github.com/reactjs/react-router">React Router</a>, <a href="https://webpack.js.org/">Webpack</a> and <a href="https://www.npmjs.com/package/react-refresh">React Fast Refresh</a>.
</p>

<br>

## Install

Clone the repo and install dependencies:

```bash
git clone
cd
npm install
```

```bash
npm install bcrypt
```
```bash
npm install xlsx
```
```bash
npm install express-rate-limit
```
```bash
npm install dotenv-webpack
```

## Starting Development

Start the app in the `dev` environment:

```bash
npm start
```



## Packaging for Production

To package apps for the local platform:

```bash
npm run package
```

## Docs

See our [docs and guides here](https://electron-react-boilerplate.js.org/docs/installation)

## Community

Join our Discord: https://discord.gg/Fjy3vfgy5q

## Forked From

https://github.com/electron-react-boilerplate/electron-react-boilerplate


## In case your database connection is not yet setup

You can set up in src\main\main.ts 

const db = mysql.createConnection({ <br>
  host: '127.0.0.1', <br>
  user: 'root', <br>
  password: '', <br>
  database: 'prioritrack', <br>
}); <br>
<br>
set this according to your connection settings so the system will connect to your database.
Populate the database [temporary] : 
https://docs.google.com/document/d/1Eq1ravTJ0vKU2cLd0nA7M5bCwqJRTPZXe6jGpmp2CTM/edit?usp=sharing

