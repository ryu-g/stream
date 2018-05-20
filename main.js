var util = require('util');
var twitter = require('twitter');
var path = require('path');
var setting = require('./token')
var twit = new twitter(setting.token);

var mime = {
  ".css": "text/css",
  ".html": "text/html"
  // 読み取りたいMIMEタイプはここに追記
};
var keyword = process.argv[2]; //第一引数
var option = {'track': keyword};
console.log(keyword+'を含むツイートを取得します。');
var fs = require('fs');
var app = require('http').createServer(function(req, res) {
  if (req.url == '/') {
    filePath = '/index.html';
  } else {
    filePath = req.url;
  }
  var fullPath = __dirname + filePath;
  res.writeHead(200, {'Content-Type': mime[path.extname(fullPath)] || "text/plain"});
  fs.readFile(fullPath, function(err, data) {
    if (err) {
      // エラー時の応答
    } else {
      res.end(data, 'UTF-8');
    }});
}).listen(3000);
var io = require('socket.io').listen(app);
io.sockets.on('connection', function(socket) {
    io.sockets.emit('init', keyword);
  socket.on('msg', function(data) {
    io.sockets.emit('msg', data);
    // console.log(data);
    // 送信確認
  });
});
twit.stream('statuses/filter', option, function(stream) {
  stream.on('data', function (data) {
    io.sockets.emit('msg', data.text);
     console.log(data);
    // 受信確認
  });
});