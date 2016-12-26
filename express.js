"use strict";
var http=require("http");
var url=require("url");
var fs=require("fs");
var ejs = require("./ejs");
class express{
    constructor(param){
        this.setArr=[];
        this.setArr.push({"/\.(js|jpg|png|jpeg)/":true});
        this.flag=true;
    }
    listen(port){
        this.port=port||8080;
        this.create();
    }
    create(){
        var that=this;
        http.createServer(function(req,res){
            that.factory(req,res);
        }).listen(that.port);
    }
    reg(path){
        var p=path.replace(/\//g,"\\/");
        return new RegExp(p+"(\\w*)");
    }
    set(url,callback){
        var obj={};
        if(url.indexOf(":")>-1){
            var arr=url.split(":");
            obj["attr"]=arr[1];
            var url=this.reg(arr[0]);
            obj[url]=callback;
        }else{
            obj["attr"]="";
            obj[url]=callback;
        }
        this.setArr.push(obj);
        // console.log(this.setArr);
    }
    factory(req,res){
        var pathname=url.parse(req.url).pathname;
        var that=this;
        that.flag=true;
        this.setArr.forEach(function(obj){
            if(obj.attr){
                var regstr=Object.keys(obj)[1];
                var tiaojian=eval(regstr).exec(pathname);
                if(tiaojian){
                    res.param={};
                    res.param[obj.attr]=tiaojian[1];
                    that.flag = false;
                    res.send = function (val) {
                        res.end(val);
                    };
                    res.render=function(str,data){
                        console.log(str)
                        var result=ejs.render(str,data);
                        res.end(result);
                    };
                    res.compile=ejs.compile;

                    res.sendFile = function (path) {
                        try {
                            fs.statSync(path);
                            var read = fs.createReadStream(path);
                            read.pipe(res);
                        } catch (e) {
                            console.log("该文件不存在");
                        }
                    };
                    obj[regstr](req, res);
                }
            }else {
                if (Object.keys(obj)[1] == pathname) {
                    that.flag = false;
                    res.send = function (val) {
                        console.log("send");
                        res.end(val);
                    };
                    res.sendFile = function (path) {
                        try {
                            console.log(path);
                            fs.statSync(path);
                            var read = fs.createReadStream(path);
                            read.pipe(res);
                        } catch (e) {
                            console.log("该文件不存在");
                        }
                    };
                    obj[pathname](req, res);
                }
            }
        });

        if(this.flag){
            res.end("路径匹配不到啊！");
        }

    }
}

module.exports=function(param){
    return new express(param);
};