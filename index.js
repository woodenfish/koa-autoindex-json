const util = require('util');
const fs = require('fs');
const stat = util.promisify(fs.stat)
const readdir = util.promisify(fs.readdir)
const URL = require('url')
const path = require('path')
const normalize = path.normalize
const join = path.join;

function removeHidden(files) {
  return files.filter(function (file) {
    return file[0] !== '.'
  });
}

/**
 * autoindex 
 * @param {string} rootPath - the path you want to autoindex
 * @param {Object} [opts]   - {filter: a -> Boolean , removeHidden: Boolean}
 * @returns {generater}
 */
module.exports = function (rootPath = __dirname, opts = {}) {
  return function* (next) {
    if (this.method !== 'GET' && this.method !== 'HEAD') {
      yield next;
      return;
    }

    // parse url
    var url = URL.parse(this.url);
    var dir = decodeURIComponent(url.pathname);

    // join / normalize from root dir
    var path = normalize(join(rootPath, dir));

    try {
      var info = yield stat(path)
      if (!info.isDirectory()) {
        return yield next
      }

      var files = yield readdir(path)
      if (opts.filter) {
        files = files.filter(function (filename) {
          return opts.filter(filename);
        });
      }
      if (opts.removeHidden) {
        files = removeHidden(files)
      }
      var infos = yield files.map((file) => { return stat(join(path, file)) })
      infos = infos.map((info, index) => {
        var d = {
          name: files[index],
          mtime: info.mtime,
          type: info.isDirectory() ? 'directory' : 'file'
        }
        if (!info.isDirectory()) {
          d.size = info.size
        }
        return d
      })
      this.body = infos;
    } catch (e) {
      return yield next
    }
  }
}
