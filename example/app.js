/**
 * Module dependencies.
 */

const express = require('express');
const app = express();
const path = require('path');
const multipart    = require('connect-multiparty');
const del = require('del');
const debug = require('debug')('app');
const imgSave = require('../');
let k = 1;

app.use(function (req, res, next) {
  console.log('Time: %d', Date.now(), k++);
//   debug(req)
//   debug(res)
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(multipart());

// 删除文件夹
del(['public/*', '!public/index.html']).then(paths => {
    debug('Deleted files and folders:\n', paths.join('\n'));
});


app.post('/upload', function (req, res) {
    console.log('响应')
    // debug(req)

    const option = {
        files: req.files,
        savePath: __dirname + '/public/upload',
        imgsName: ['img1'],

    }

    const option2 = {
        files: req.files,
        savePath:__dirname + '/public/upload2',
        imgsName: ['img2']
    }
    imgSave(option).then(data => {

        debug(data)
        imgSave(option2).then(data => {
            // debug(data)
            res.redirect('.');
        }) 
    }) 
})
app.listen(3000);
console.log('listening on port 3000');
