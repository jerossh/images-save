'use strict'
const cryptoRandomString = require('crypto-random-string');
const imagemin = require('imagemin');// const minimatch = require("minimatch");
const debug = require('debug')('save');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminSvgo = require('imagemin-svgo');

// const option = {
//     files: req.files,
//     savePath: 'public/upload',
//     imgsName: [], // defalut: req.filse[input[name]]
// }

function saveImgs(option) {
  return new Promise(function(resolve, reject) {

    const { files, savePath, imgsName, newNameForImg } = option;
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
    const uploadPath = savePath || './public';
    const newName = newNameForImg || Date.now() + cryptoRandomString(6);

    imgsName.forEach(function (e, i, arr) {
      imgObj = files[e];
      if (!imgObj) {reject(new Error(`can't find ${e}, please check imgsName again`))}
      filePath = imgObj.path;
      originalName = imgObj.name;
      ext = imgObj.type.split('/')[1];

      if (originalName) {
        // const readData = fs.createReadStream(filePath);
        const ext = originalName.split('.')[1];
        const img = newName+'.'+ext;
        // const newPath = `${uploadPath}/${e}/`;  //  由于 imagessave 的原因，已经无法重命名
        const newPath = `${uploadPath}/`;  // 必须加点
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

// connect-multipart 下
// { fieldName: 'img2',
// originalFilename: '10.url.png',
// path: '/var/folders/dn/rbczn1wn0bnf9zsxb6gkf50m0000gn/T/DPhBlFOc2CCjJ_DrRSJdAzMl.png',
// headers:
// { 'content-disposition': 'form-data; name="img2"; filename="10.url.png"',
//   'content-type': 'image/png' },
// size: 175321,
// name: '10.url.png',
// type: 'image/png' }

// koabody
// files:
//    { mediaFile:
//       File {
//         domain: null,
//         _events: {},
//         _eventsCount: 0,
//         _maxListeners: undefined,
//         size: 116638,
//         path: '/var/folders/b8/hrr_8c_57t35yddhmlp9tynm0000gn/T/upload_29363bfbe6a1e016443f7a2883351c5c',
//         name: 'about2.jpg',
//         type: 'image/jpeg',
//         hash: null,
//         lastModifiedDate: 2017-06-13T17:14:56.474Z,
//         _writeStream: [Object] } }

// JPG和JPEG其实是一个东西