# images-save

Save multy images quickly

## Installation

```bash
npm install images-save
```

## Usage 

```js
saveImgs(req, res, path, imgsName, newNameForImg, cb)
```

#### Example

```js
const express = require('express');
const app = express();
const imgSave = require('images-save');
const imgSave = require('images-save');
const models = require('./models');

app.post('/upload', function (req, res) {
    const id = req.body.item.id;
    // ['img1', 'img2'] tow imgs to upload,
    imgSave(req, res, 'public/upload', ['img1', 'img2'], '', function () {
        models.findById(id).then((data) => {
            data['img1'] = req['img1'];
            data['img1'] = req['img1'];
            data.save()
            return res.redirect('.');
        })
        
    })
});

```
HMTL part:

```html
  <input type='file' name="img1" >
  <input type='file' name="img2" >

```

## param

 *  {Object} [req] express 路由中的 req
 *  {Object} [res] express 路由中的 res
 *  {Array} [imgsName] A string (or array of strings) representing cookie signing secret(s).
 *  {String} [newName]
 *  {String} [cb] 回调函数
 *  {Object} images link in req[imgsName]

 ## return 

req[imgsName]

