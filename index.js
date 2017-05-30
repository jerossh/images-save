'use strict'
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const cryptoRandomString = require('crypto-random-string');
const imagemin = require('imagemin');
// const minimatch = require("minimatch");
const debug = require('debug')('save');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminSvgo = require('imagemin-svgo');

// const option = {
//     files: req.files,
//     path: 'public/upload',
//     imgsName: [], // defalut: req.filse[input[name]]
// }

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

    let imgObj, filePath, originalName, ext, imgslink = {}, count = 0;
    const imgsLength = imgsName.length;
    const uploadPath = path || './public';
    const newName = newNameForImg || Date.now() + cryptoRandomString(6);

    imgsName.forEach(function (e, i, arr) {
      imgObj = files[e];
      if (!imgObj) {reject(new Error(`can't find ${e}, please check imgsName again`))}
      filePath = imgObj.path;
      originalName = imgObj.originalFilename;
      ext = imgObj.type.split('/')[1];

      if (originalName) {
        // const readData = fs.createReadStream(filePath);
        const ext = originalName.split('.')[1];
        const img = newName+'.'+ext;
        const newPath = `${uploadPath}/${e}/`;  // 必须加点
        const newFile = newPath + img;

        imagemin([filePath], newPath, {
          plugins: [
              imageminJpegtran(),
              imageminPngquant({quality: '65-80'}),
              imageminGifsicle(),
              imageminSvgo()
          ]
        }).then((files)=> {
          imgslink[e] = files[0].path;
          count++;
          if (count === imgsLength) {
              resolve(imgslink)
          }
        }).catch(err=> reject(err))        
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

// mkdirp(newPath, function() {
//   readData.pipe(fs.createWriteStream(newFile))
//     .on('err', () => {imgsLength--; count--; return console.log('写入发生错误')})
//     .on('finish', ()=> {

//       imgslink[e] = `${e}/${img}`;
//       count++;

//       if (count === imgsLength) {
//         resolve(imgslink)
//       }
//     });
// })


// { fieldName: 'img2',
// originalFilename: '10.url.png',
// path: '/var/folders/dn/rbczn1wn0bnf9zsxb6gkf50m0000gn/T/DPhBlFOc2CCjJ_DrRSJdAzMl.png',
// headers:
// { 'content-disposition': 'form-data; name="img2"; filename="10.url.png"',
//   'content-type': 'image/png' },
// size: 175321,
// name: '10.url.png',
// type: 'image/png' }


// JPG和JPEG其实是一个东西