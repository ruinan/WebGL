var express = require('express');
var fs = require('fs');
const fileUpload = require('express-fileupload');
var app = express();
// const fileUpload = require('express-fileupload');
// var multer  = require('multer');
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
app.use(fileUpload());
app.get('/', (req, res) => {
    res.sendFile('./public/index.html');
    res.end();
});

app.post('/image', (req, res) => {
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.picture;
    fs.unlink('./public/images/test.jpg', err => {
        if (err) {
            throw err;
        }
        console.log('text.jpg deleted');
    });
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(`./public/images/test.jpg`, function(err) {
        if (err) return res.status(500).send(err);

        res.redirect('/');
    });
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
