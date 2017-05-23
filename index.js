'use strict'
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const imagemin = require('imagemin');
const minimatch = require("minimatch");
const cryptoRandomString = require('crypto-random-string');
const JpegTran = require('jpegtran');
const OptiPng = require('optipng');
const debug = require('debug')('save');

// const imagemin = require('gulp-imagemin');

// /*
//  * 用于快速存储 图片等
//  *
//  * @param {Object} [req] express 路由中的 req
//  * @param {Object} [res] express 路由中的 res
//  * @param {Array} [imgsName] A string (or array of strings) representing cookie signing secret(s).
//  * @param {String} [newName]
//  * @param {String} [cb] 回调函数
//  * @return {Object} 返回 图片在地址 写入 req[imgsName]，方便后续调用
//  * @public
//  */

function saveImgs(req, res, path, imgsName, newNamearg, cb) {

  let imgData, filePath, originalName, count = 0;
  const imgsLength = imgsName.length;
  const uploadPath = path || './public';
  const newName = newNamearg || Date.now() + cryptoRandomString(6);
  let optiImg = new JpegTran(['-rotate', 90, '-progressive']);



  imgsName.forEach(function (e, i, arr) {
    imgData = req.files[e];
    filePath = imgData.path;
    originalName = imgData.originalFilename;

    if (originalName && minimatch(originalName, "*.+(jpg|jpeg|png)")) {
      const readData = fs.createReadStream(filePath);
      const ext = originalName.split('.')[1];
      const img = newName+'.'+ext;
      const newPath = `${uploadPath}/${e}/`;  // 必须加点
      const newFile = newPath + img;
      // if (ext === 'png') {
      //   imgOpt = new OptiPng(['-o7']);
      // }
      
      debug(ext)

      mkdirp(newPath, function(){
        readData.pipe(optiImg).pipe(fs.createWriteStream(newFile))
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
