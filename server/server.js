const express = require('express')
const fs = require('fs')
const fileUpload = require('express-fileupload');
const multer  = require('multer');
const { join } = require('path');
const path = require('path');

const app = express()
const port = 8468
const keyStorage = {}
const uploadDirectory = __dirname + '/uploads';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        splittedNameWExtention = file.originalname.split('.')
        fileExtension = splittedNameWExtention[splittedNameWExtention.length - 1]
        
        splittedName = splittedNameWExtention.slice(0, -1);
        cb(null, splittedName.join('') + '_' + uniqueSuffix + '.' + fileExtension)
    }
})

const upload = multer({ storage: storage });

function initializeServer(){
    app.emit('ready')
}

function generateKey() {
    const max = 999999;
    const min = 100000;
    const key = Math.floor(Math.random() * (max - min) + min).toString();

    while (key in keyStorage) {
        key = Math.random() * (max - min) + min;
    }

    return key
}

function saveFileInfo(file){
    // if we upload too many files then generating a non-existing key will be hard.
    // not handling this because we can always use a long hash as a key.
    key = generateKey()
    keyStorage[key] = file
    return key
}

app.use((req, res, next) => {
    console.log(req.headers)
    next()
})

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.static(path.join(__dirname, '../client/build')));

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).send('Something broke!')
})

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.get('/getFile', (req, res) => {
    console.log("received a request")
    console.log(req.query)
    const fileInfo = keyStorage[req.query.fileId]
    console.log(fileInfo)
    const options = {
        dotfiles: 'deny',
        headers: {
            'Access-Control-Expose-Headers': ['filename'],
            'x-timestamp': Date.now(),
            'x-sent': true,
            'filename': fileInfo.filename
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
    console.log(req.file)
    key = saveFileInfo(req.file)
    console.log(`file ${req.file.originalname} saved successfully with key: ${key} and location: ${req.file.path}`)
    res.json([{
        message: `file saved successfully with key: ${key}`,
        key: key
    }])
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

