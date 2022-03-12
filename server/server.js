const express = require('express')
const fs = require('fs')
const fileUpload = require('express-fileupload');
const multer  = require('multer');

const app = express()
const port = 8468
const keyStorage = {}
const uploadDirectory = __dirname + '/uploads';
const upload = multer({ dest: __dirname + '/uploads' });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory)
    },
    filename: function (req, file, cb) {
        key = generateKey()
        filePath = uploadDirectory + '/' + file.originalname
        keyStorage[key] = filePath
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
  
  const upload = multer({ storage: storage })


// great walkthrough here -https://blog.risingstack.com/your-first-node-js-http-server/
// for now storage is 6-dig key to filepath. filename will be for now the 6-dig code but as we go we 
// can make it safer by setting filename to some name and save the code dictionary in a safer place


function initializeServer(){
    saveDefaultFile();
    app.emit('ready')
}

function saveDefaultFile() {
    const defaultKey = '000000'
    const defaultFilePath = __dirname + '/' + defaultKey + '.txt'
    keyStorage[defaultKey] = defaultFilePath
    const defaultFileInfo = `{
        fieldname: 'File',
        originalname: '20180918_204658.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: 'C:\\code\\git\\drop-send\\uploads\\server',
        filename: '8c4611102394020fd927891544572d4b',
        path: 'C:\\code\\git\\drop-send\\server\\uploads\\8c4611102394020fd927891544572d4b',
        size: 3767679
      }`;
    fs.writeFile(defaultFilePath, defaultFileInfo, function (err) {
        if (err) {
            keyStorage.delete(key);
            return console.log(err);
        }
        console.log("The file was saved!");
    });
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
    const filePath = keyStorage[req.query.fileId]
    const options = {
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    }
    res.sendFile(filePath, options, function(err){
        console.error(err)
        res.status(500).send(err)
    })
})
  
app.post('/upload', upload.single('File'), function(req, res) {
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

// mongoose.connect( "mongodb://localhost/mydb" );
// mongoose.connection.once('open', function() { 
//     // All OK - fire (emit) a ready event. 
//     app.emit('ready'); 
// });
