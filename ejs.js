function compile(str){
    var tpl=str.replace(/\n/g,"\\n").replace(/<%=([\s\S]+?)%>/g,function(a,b){
        return  "'+"+b+"+'";
    }).replace(/<%([\s\S]+?)%>/g,function(a,b){
        return  "'\n"+b+"tpl+='";
    });
    tpl="with(obj){\nvar tpl='"+tpl+"';\n return tpl}";
    return new Function("obj",tpl);
}
// var fn=compile(str);  //返回一个函数

function render(str,data){
    if(typeof str=="string"){
        return compile(str)(data);
    }else if(typeof str=="function"){
        return str(data);
    }
}

module.exports.render=render;
module.exports.compile=compile;
