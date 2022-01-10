var http = require('http');
var fs = require('fs');
const req = require('express/lib/request');
const { csonParser } = require('config/parser');
http.createServer(function (req, res) {
  fs.readFile('demofile1.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}).listen(8080);

fs.appendFile('WriteFile.txt','Hello World!', function(err){
    if(err) throw err
    console.log("File Has been get written!")
})

// fs.unlink('CheckFileDelete.txt', function(err){
//     if(err) throw err
//     console.log("File Has Been Deleted")
// })

// fs.rename( 'WriteFile.txt', 'RenamedFile.txt', function(err){
//     if(err) throw err
//     console.log("File HAs Been Renamed")
// })

var url = require('url');
var adr = 'http://localhost:8080/default.htm?year=2017&month=february';
var q = url.parse(adr, true);

console.log(q.host); //returns 'localhost:8080'
console.log(q.pathname); //returns '/default.htm'
console.log(q.search); //returns '?year=2017&month=february'

var qdata = q.query; //returns an object: { year: 2017, month: 'february' }
console.log(qdata.month +" "+qdata.year);