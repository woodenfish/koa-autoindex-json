# koa-autoindex-json

List json like nginx autoindex that contains directory listings for a given path.

## Install

This is a Node.js module available through the npm registry. Installation is done using the npm install command:
```
$ npm install koa-autoindex-json
```

## API
```
var autoIndex = require('koa-autoindex-json')
```

#### autoIndex(rootPath, options)

Returns middlware that serves an index of the directory in the given path for Koa.

The `rootPath` is based off the `req.url` value, so a `req.url` of `'/some/dir'` with a path of `'public'` will look at `'public/some/dir'`, Defaults to `__dirname`.

#### Options

Accepts these properties in the `options` object.

##### filter

Apply this filter function to files. Defaults to false. The filter function is called for each file, with the signature `filter(filename, index)` where `filename` is the name of the file, `index` is the array index.

##### removeHidden

Hide (dot) files. Defaults to `false`.

## Demo

### koa 1.x
```
const app = require('koa')();
const autoIndex = require('./index')
app.use(autoIndex(".", { removeHidden: true, filter: (name) => { return name !== 'index.js' } }))
app.listen(18080)
```
### koa 2.x
```
const Koa = require('koa');
let app = new Koa()
const convert = require('koa-convert')
const autoIndex = convert(require('./index'))
app.use(autoIndex(".", { removeHidden: true, filter: (name) => { return name !== 'index.js' } }))
app.listen(18080)
```
Result:
```
curl 'http://localhost:18080/'
[
    {
        name: "README.md",
        mtime: "2018-05-14T12:11:44.215Z",
        type: "file",
        size: 957
    },
        {
        name: "app.js",
        mtime: "2018-05-14T12:30:42.166Z",
        type: "file",
        size: 248
    },
    {
        name: "node_modules",
        mtime: "2018-05-14T12:28:40.347Z",
        type: "directory"
    },
    {
        name: "package.json",
        mtime: "2018-05-14T11:50:57.767Z",
        type: "file",
        size: 616
    }
]
```