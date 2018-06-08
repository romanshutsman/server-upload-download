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


app.post('/upload', upload.single('file'), function(req, res) {
  // res.send(200)
  res.status(200).json({
    message: 'File uploaded successfully'
  });
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
  
});

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
  // fileReq = req.params.file
  // var file = __dirname+ '/uploads/' + fileReq;
  //  res.download('./uploads/'+fileReq); 
  //  res.send(200)
  res.status(200).json({
    message: 'File downloaded successfully'
  });
});




app.listen(port, function() {
  console.log('leistening on port', port);
}) 
