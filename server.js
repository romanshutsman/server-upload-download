var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var bodyParser = require('body-parser');
var path = require('path');
var multer  = require('multer');
var fs = require('fs');
var cors = require('cors')

var http = require('http');
var formidable = require('formidable');
var upload = multer({ dest: './tmp/'});
var uploads = './uploads/';
var download = require('download-file')
let files = [];
var stream = require('stream');
var mime = require('mime-types');
var pipe = require('pipe');




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + './'));
app.use(cors());
// app.use(function(req, res, next) {
// //set headers to allow cross origin request.
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS, PATCH');
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});
const uploadDir = './uploads/' // uploading the file to the same path as app.js

app.post('/upload', (req, res) =>{
  var form = new formidable.IncomingForm()
  form.multiples = true
  form.keepExtensions = true
  form.uploadDir = uploadDir
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: err })
    res.status(200).json({ uploaded: true })
  })
  form.on('fileBegin', function (name, file) {
    const [fileName, fileExt] = file.name.split('.')
    file.path = path.join(uploadDir, `${fileName}.${fileExt}`)
  })
});

// app.post('/upload', upload.single('file'), function(req, res) {
  // res.send(200)

  // console.log(req.file.originalname);
//  res.send("file saved on server");
  // console.log(req.file.path);
  // console.log(req.file);
  // console.log(req.file);
  // res.send(200);
  // var file =  './uploads/' + req.file.originalname;
  // fs.rename(req.file.path, file, function(err) {
  //   if (err) {
  //      res.send(500);
  //   } else {
  //      res.status(200).json({
  //       message: 'File uploaded successfully',
  //       filename: req.file.name
  //     });
  //   }
  // });
  
// });

fs.readdirSync(uploads).forEach(file => {
  files.push(file)
})
app.get('/data', function(req, res){
  console.log(files);
  res.status(200).json(files.map(x => ({ 
    url: 'uploads/'+ x,
    name: x  })))
});
app.get('/download/:file', function(req, res){
  fileReq = req.params.file
  var file = __dirname+ '/uploads/' + fileReq;
   res.download('./uploads/'+fileReq, function(err){
    //CHECK FOR ERROR
    fs.unlink(file);
  }); 


});




app.listen(port, function() {
  console.log('leistening on port', port);
}) 
