# images-save

Save multy images quickly

## Installation

```bash
npm install images-save
```

## Usage 

HTML part:

```html
  <input type='file' name="img1" >
  <input type='file' name="img2" >

```

one folder
```js
const express = require('express');
const app = express();
const imgSave = require('images-save');

app.post('/upload', function (req, res) {
    const option = { files: req.files, path: 'public/upload', imgsName: ['img1'], newNameForImg: 'one'}
    imgSave(option).then(data => res.redirect('.')) 
});

```

multi folders to save

```js
    const option = { files: req.files, path: 'public/upload', imgsName: ['img1'],  newNameForImg: 'one'}
    const option2 = {files: req.files, path: 'public/upload2', imgsName: ['img2'],  newNameForImg: 'ttttt'}
 
    imgSave(option).then(data => {
        imgSave(option2).then(data => {
            res.redirect('.');
        }) 
    }) 
```


## param

```js
    {
        files: req.files, // require
        path: 'public/upload', // defalut 'public/'
        imgsName: [], // defalut: All images you upload
        newNameForImg: 'one', // defalut: 
    }
```


## return 

return promise

HTML part:
```html
  <input type='file' name="img1" >
  <input type='file' name="img2" >

```

to deal it
```js
imgSave(option).then(data => {
    console.log(data['img1'], ' && ', data['img2'])
    res.redirect('.')
    }) 
```



