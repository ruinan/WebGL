const express = require('express');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const app = express();

app.use(express.static('public'));
app.use(fileUpload());

// return the html page
app.get('/', (req, res) => {
    res.sendFile('./public/index.html');
    res.end();
});

// upload the picture
app.post('/image', (req, res) => {

    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // use the same image name that will automatically load the new picture when page redirection happens
    // delete the previous one
    let sampleFile = req.files.picture;
    fs.unlink('./public/images/test.jpg', err => {
        if (err) {
            throw err;
        }
        console.log('text.jpg deleted');
    });
    // set the new one
    sampleFile.mv(`./public/images/test.jpg`, function(err) {
        if (err) return res.status(500).send(err);
        res.redirect('/');
    });
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000');
});
