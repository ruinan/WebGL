var express = require('express');
var app = express();
var multer  = require('multer');
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'public/images/')
//     },
//     filename: function (req, file, cb) {
//         console.log();
//       cb(null, file.fieldname)
//     }
//   })
// var upload = multer({ storage })

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('./public/index.html');
    res.end();
});

app.post('/image', (req, res) => {
    fs.writeFile()
    res.redirect('/');
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

