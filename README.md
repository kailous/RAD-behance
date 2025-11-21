# Behance
> Behance Portfolio Page developed with Vanilla JS

![](https://raw.github.com/pinceladasdaweb/behance/master/screenshot.png)

## Motivation

I created a version of [Vanilla JS](http://vanilla-js.com/) based on the original [tuts+](http://webdesign.tutsplus.com/tutorials/how-to-use-the-behance-api-to-build-a-custom-portfolio-web-page--cms-20884). [Demo here](http://www.pinceladasdaweb.com.br/blog/uploads/behance/).

## Project structure

- `public/`: All static pages and built assets (`index.html`, `project.html`, `about.html`, compiled CSS/JS, svg).
- `src/js` and `src/css`: Source files for the listing (`app.js`) and detail (`project.js`) pages plus styles.
- `config/config.js`: Local defaults for your Behance client ID and user/profile links.
- `server.js`: Express server that serves static files and proxies the Behance API.

## How to use?

In file [`index.html`](index.html), just fill out the user variable with your Behance username:

```javascript
Behance({
    user: 'behance-username-here'
});
```
In file [`config.js`](config/config.js) you must populate the variable `clientId` (or set the `BEHANCE_CLIENT_ID` environment variable) with the Client ID of your app created in central [Developers Behance](https://www.behance.net/dev/apps).

## Local development

```bash
npm install
npm start
```

The `npm start` command runs a small Express server that serves the static files and proxies requests from `/api/behance?user=<username>` to the Behance API.

- Profile + projects list: `GET /api/behance?user=<username>`
- Single project (for an inner page/detail view): `GET /api/behance/projects/<projectId>` (the homepage already links to `project.html?id=<projectId>` which calls this endpoint under the hood)
- About page: `GET /about`
- Contact page (static form demo): `GET /contact`
If you change anything in `src/js` or `src/css`, run `npm run build` (or `npx gulp`) to regenerate the minified assets loaded by the HTML pages.

## Browser support

![IE](https://raw.githubusercontent.com/alrra/browser-logos/master/internet-explorer/internet-explorer_48x48.png) | ![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/firefox/firefox_48x48.png) | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/master/opera/opera_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
IE 8+ ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

## License

[MIT](LICENSE)
