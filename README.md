[![Netlify Status](https://api.netlify.com/api/v1/badges/113e9559-403b-4890-9e6b-8935234cdd00/deploy-status)](https://app.netlify.com/sites/bannershake/deploys)
![](https://img.shields.io/badge/Vue.js-2.6.11-green.svg?style=flat-square&logo=vue%2Ejs)
![](https://img.shields.io/badge/Vuetify-2.2.11-green.svg?style=flat-square&logo=vuetify)

# BannerShake

Full client side skills banner generator. Visit [https://bannershake.com](https://bannershake.com)

# Examples
![](src/static/examples/boukadam-banner.png)

![](src/static/examples/wafood-skills-banner.png)

## Logos

Logos are provided by [gilbarbara/logos](https://github.com/gilbarbara/logos) and optimized by [svg/svgo](https://github.com/svg/svgo). To import these logos : 

* First clone (or pull) [gilbarara's repo](https://github.com/gilbarbara/logos). This repo must be present at the same level as bannershake
* Then, install [go](https://golang.org/) to run the program and [svgo](https://www.npmjs.com/package/svgo) for optimizing SVG vector graphics files.
* Run the following commands : 
```
go run importLogos.go
npm run svgo
```