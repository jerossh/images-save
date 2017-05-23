/**
 * Module dependencies.
 */

const express = require('express');
const app = express();
const path = require('path');
const multipart    = require('connect-multiparty');
const debug = require('debug')('app');
const imgSave = require('../');

app.use(express.static(path.join(__dirname, 'public')));
app.use(multipart());


app.post('/upload', function (req, res) {
    debug('上传了', req.files);
    imgSave(req, res, '', ['img1', 'img2'], 'random', function () {
        debug('到这里就是成功了');
        res.redirect('.')
    })
    
})
app.listen(3000);
console.log('listening on port 3000');
