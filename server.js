var express = require('express');
var app = express();

var fs = require("fs");
var bodyParser = require('body-parser');
var multer = require('multer');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: './tmp/'}).array('multiInputFileName'));

app.get('/', function(req, res) {
    console.log("Request arrived");
    res.sendFile(__dirname + "/" + "home.html");
});

app.get('/video', function(req, res) {
    console.log("Video method")
    const path = './movie.mkv'
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range
    console.log("Request Arrived 123");
    console.log("file Size : "+fileSize);
    console.log("Range : " + range);
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] 
        ? parseInt(parts[1], 10)
        : fileSize-1
      const chunksize = (end-start)+1
      const file = fs.createReadStream(path, {start, end})
      console.log("File picked")
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(206, head);
      file.pipe(res);
      console.log("File Size : " + fileSize);
      console.log("Chunk Size : " + chunksize);
      console.log("Parts : " + parts);
      console.log("Start : " + start);
      console.log("End : " + end);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head)
      fs.createReadStream(path).pipe(res)
    }
  });

var server = app.listen(5000, () => {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Listener : " + host + "  " + port)
});