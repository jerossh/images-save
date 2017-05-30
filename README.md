# images-save

Save multi images quickly and optimize images | 多图片快速保存到多位置并优化图片大小

## Installation

```bash
npm install images-save --save
```

## Usage 

HTML part:

```html
  <input type='file' name="img1" >
  <input type='file' name="img2" >

```
one folder ／ 保存到一个位置

```js
const express = require('express');
const app = express();
const path = require('path');
const multipart = require('connect-multiparty');
const imgSave = require('images-save');

app.use(express.static(path.join(__dirname, 'public')));
app.use(multipart());

app.post('/upload', function (req, res) {
    const option = { files: req.files, path: 'public/upload', imgsName: ['img1']};
    imgSave(option).then(data => res.redirect('.')) ;
});

app.listen(3000);
console.log('listening on port 3000');

```

multi folders to save ／ 不同图保存到 不同位置

```js
const option = { files: req.files, path: 'public/upload', imgsName: ['img1']};
const option2 = {files: req.files, path: 'public/upload2', imgsName: ['img2']};

imgSave(option).then(data => {
    imgSave(option2).then(data => {
        res.redirect('.');
    }); 
}); 
```


## param

```js
{
    files: req.files, // require
    path: 'public/upload', // defalut 'public/'
    imgsName: ['img1', 'img4'], // defalut: All images you upload
}
```


## return 

return promise

HTML part:
```html
<input type='file' name="img1" >
<input type='file' name="img2" >

```

To deal it
```js
imgSave(option).then(data => {
    console.log(data['img1'], ' && ', data['img2'])
    res.redirect('.')
    }) 
```



