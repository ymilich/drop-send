const express = require('express')
const fs = require('fs')
const fileUpload = require('express-fileupload');
const app = express()
const port = 8468

// great walkthrough here -https://blog.risingstack.com/your-first-node-js-http-server/
// for now storage is 6-dig key to filepath. filename will be for now the 6-dig code but as we go we 
// can make it safer by setting filename to some name and save the code dictionary in a safer place

const keyStorage = {}

function initializeServer(){
    saveDefaultFile();
    app.emit('ready')
}

function saveDefaultFile() {
    const defaultKey = '000000'
    const defaultFilePath = __dirname + '/' + defaultKey + '.txt'
    keyStorage[defaultKey] = defaultFilePath
    fs.writeFile(defaultFilePath, "this is a default file to be sent to client", function (err) {
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
    const filePath = __dirname + key;
    keyStorage[key] = filePath
    
    fs.writeFile(filePath, file, function(err) {
        if (err) {
            keyStorage.delete(key)
            return console.log(err);
        }
        console.log("The file was saved!");
    });

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
  
app.post('/upload', function(req, res) {
    console.log(req.files.uploadFile); // the uploaded file object
    key = saveFile(req.files.uploadFile) // future thought - save the sender info: req.headers.from for example
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
