'use strict'
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const cryptoRandomString = require('crypto-random-string');
// const imagemin = require('imagemin');
// const minimatch = require("minimatch");
// const JpegTran = require('jpegtran');
// const OptiPng = require('optipng');
const debug = require('debug')('save');

// const imagemin = require('gulp-imagemin');

/*
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


// const option = {
//     files: req.files,
//     path: 'public/upload',
//     imgsName: [], // defalut: req.filse[input[name]]
//     newNameForImg: '', // defalut: 
// }

// function saveImgs(req, res, path, imgsName, newNameForImg, cb) {
function saveImgs(option) {
  return new Promise(function(resolve, reject) {

    const { files, path, imgsName, newNameForImg } = option;
    // debug(files, '参数')
    if (!Array.isArray(imgsName) ) {reject(new TypeError('hope an array'))}
    if (imgsName.length == 0) {
      let temNum = 0;
      for (let imgName in files) {
        imgsName[temNum++] = imgName;
      }
    }

    let imgObj, filePath, originalName, imgslink = {}, count = 0;
    const imgsLength = imgsName.length;
    const uploadPath = path || './public';
    const newName = newNameForImg || Date.now() + cryptoRandomString(6);

    imgsName.forEach(function (e, i, arr) {
      imgObj = files[e];
      if (!imgObj) {reject(new Error(`can't find ${e}, please check imgsName again`))}
      filePath = imgObj.path;
      originalName = imgObj.originalFilename;

      if (originalName) {
        const readData = fs.createReadStream(filePath);
        const ext = originalName.split('.')[1];
        const img = newName+'.'+ext;
        const newPath = `${uploadPath}/${e}/`;  // 必须加点
        const newFile = newPath + img;

        mkdirp(newPath, function() {
          readData.pipe(fs.createWriteStream(newFile))
            .on('err', () => {imgsLength--; count--; return console.log('写入发生错误')})
            .on('finish', ()=> {

              imgslink[e] = `${e}/${img}`;
              count++;

              if (count === imgsLength) {
                resolve(imgslink)
              }
            });
        })
      }  else {
        count++;
        if (count === imgsLength) { 
          resolve(imgslink)
        }
      }
    })  // 循环结束
  })  
}

module.exports = saveImgs
