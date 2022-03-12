const express = require('express')
const fs = require('fs')
const fileUpload = require('express-fileupload');
const multer  = require('multer');

const app = express()
const port = 8468
const keyStorage = {}
const uploadDirectory = __dirname + '/uploads';
const upload = multer({ dest: uploadDirectory });


function saveValidationFile() {
    const validationFileKey = 'sanityFile'
    const validationFileName = 'randomname'
    const validationFilePath = uploadDirectory + '/' + validationFileName + '.txt'
    const validationFileInfo = `{
        fieldname: 'File',
        originalname: 'aaa.txt',
        encoding: '',
        mimetype: 'txt',
        destination: '${uploadDirectory}',
        filename: '${validationFileName}',
        path: '${validationFilePath}',
        size: 3767679
      }`;
    const validationFileContent = "We are sane."
    
    keyStorage[validationFileKey] = validationFileInfo
    fs.writeFile(validationFilePath, validationFileContent, function (err) {
        if (err) {
            keyStorage.delete(key);
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

function initializeServer(){
    saveValidationFile()
    app.emit('ready')
}

function generateKey() {
    const max = 999999;
    const min = 100000;
    const key = str(Math.random() * (max - min) + min);

    while (key in keyStorage) {
        key = Math.random() * (max - min) + min;
    }

    return key
}

function saveFile(file){
    // if we upload too many files then generating a non-existing key will be hard.
    // not handling this because we can always use a long hash as a key.
    key = generateKey();
    keyStorage[key] = file
    return key
}

app.use((req, res, next) => {
    console.log(req.headers)
    next()
})

app.get('/', (req, res) => {
    console.log("recieved request")
    res.send("you're good amigo")
})

app.get('/getFile', (req, res) => {
    console.log(req.query)
    const fileInfo = keyStorage[req.query.fileId]
    const options = {
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    }
    res.sendFile(fileInfo.path, options, function(err){
        console.error(err)
        res.status(500).send(err)
    })
})
  
app.post('/upload', upload.single('File'), function(req, res) {
    // we have a coupling between the uploading and the routing. Thus the code remains together.
    // Ideally we seperate the two, either by making a tmp folder and extracting files later or by switching multer with another package
    console.log(req.file); // the uploaded file object
    key = saveFile(req.file) // future thought - save the sender info
    res.send(`file saved successfully with key: ${key}`)
})

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).send('Something broke!')
})

app.on('ready', function() { 
    app.listen(port, (err) => {
        if (err) {
            return console.log('something bad happened', err)
        }
        console.log(`server is listening on ${port}`)
    })
})

initializeServer()

