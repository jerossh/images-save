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
del(['public/upload']).then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
});

app.post('/upload', function (req, res) {
    // debug('上传了', req.files);
    imgSave(req, res, 'public/upload', ['img1', 'img2'], '', function () {
        // debug('到这里就是成功了');
        res.redirect('.')
    })
})
app.listen(3000);
console.log('listening on port 3000');
