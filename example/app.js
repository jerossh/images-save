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

app.use(express.static(path.join(__dirname, 'public')));
app.use(multipart());

// 删除文件夹
del(['public/*', '!public/index.html']).then(paths => {
    debug('Deleted files and folders:\n', paths.join('\n'));
});


app.post('/upload', function (req, res) {

    const option = {
        files: req.files,
        path: 'public/upload',
        imgsName: ['img1'], // defalut: req.filse[input[name]]
        newNameForImg: 'one', // defalut: 
    }

    const option2 = {
        files: req.files,
        path: 'public/upload2',
        imgsName: ['img2'], // defalut: req.filse[input[name]]
        newNameForImg: 'tow', // defalut: 
    }
    // debug('上传了', req.files);
    // imgSave(req, res, 'public/upload', ['img1', 'img2'], '', function () {
    imgSave(option).then(data => {
        debug(data)
        imgSave(option2).then(data => {
            debug(data)
            res.redirect('.');
        }) 
    }) 
    
})
app.listen(3000);
console.log('listening on port 3000');
