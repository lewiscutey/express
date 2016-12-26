var fs = require("fs");
var express=require("./express.js");
var app=express("abc");
app.listen(8888);

// app.set("/abc/",function(req,res){
//     res.send("abc");
// });

// app.set("/abc/:id",function(req,res){
//     res.send(res.param.id);
// });

// app.set("/a/",function(req,res){
//     res.setHeader("Content-Type","text/html;charset=utf-8");
//     res.writeHead(200);
//     res.sendFile("../abc/index.ejs");
// });

app.set("/abc/:id",function(req,res){
    var str = fs.readFileSync("../abc/index.ejs").toString();
    res.render(str,{abc:res.param.id});
});