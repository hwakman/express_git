var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//set method
app.set('view engine','ejs');
app.set('views','./temps');

//use method
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//get method
app.get('/',function(req ,res){
  res.render('index');
});

app.get('/home',function(req,res){
  res.render('home',{
    p_content : 'content example'
  });
});

app.get('/store',function(req,res){
  var ex_content = [];
  for(var i = 0;i<=6;i++){
    ex_content[i] = "example_content."+(i+1)
  }
  res.render('store',{
    data : ex_content,
    type : ex_content
  });
});

app.get('/customer',function(req,res){
  res.render('customer');
});

app.get('/logout',function(req,res){
  res.render('index');
});

//post method
app.post('/home',function(req,res){
  var reqLogin = req.body;

  res.render('home',{
    p_content : 'content example'
  });
});

//listen port
app.listen('8000',function(){
  console.log('listen on localhost:3030');
});
