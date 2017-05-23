'use strict'
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp')

/**
 * 用于快速存储 图片等
 *
 * @param {Object} [req] express 路由中的 req
 * @param {Object} [res] express 路由中的 res
 * @param {Array} [imgsName] A string (or array of strings) representing cookie signing secret(s).
 * @param {String} [newName]
 * @param {String} [cb] 回调函数
 * @return {Object} 返回 图片在地址 写入 req[imgsName]，方便后续调用
 * @public
 */

function saveImgs(req, res, path, imgsName, newName, cb) {

  var imgsLength = imgsName.length;
  var imgData, filePath, originalName;
  var ext, count = 0;
  var uploadPath = path || './public'

  imgsName.forEach(function (e, i, arr) {
    imgData = req.files[e];
    filePath = imgData.path;
    originalName = imgData.originalFilename;

    if (originalName) {
      var readData = fs.createReadStream(filePath)
      ext = originalName.split('.')[1];
      var img = newName+'.'+ext;
      const newPath = `${uploadPath}/${e}/`;  // 必须加点
      var newFile = newPath + img;
      mkdirp(newPath, function(){
        readData.pipe(fs.createWriteStream(newFile))
          .on('err', () => {imgsLength--;count--})
          .on('finish', ()=> {
            req[e] = `${e}/${img}`
            count++;
            if (count === imgsLength) {
              cb();
            }
          });
      })
    }  else {
      count++;
      if (count === imgsLength) {
        cb()
      }
    }
  })  // 循环结束
}

module.exports = saveImgs
