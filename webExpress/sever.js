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
  for(var i = 0;i<=20;i++){
    ex_content[i] = "Example_content_"+(i+1)
  }
  res.render('store',{
    data : ex_content,
    type : ex_content
  });
});

app.get('/goodsdetail',function(req,res){
  console.log()
  res.render('goodsdetail',{
    code : req.query['code']
  });
});

app.get('/customer',function(req,res){
  var ex_content = [];
  var test_history = [];
  for(var i = 0;i<=6;i++){
    ex_content[i] = "example_content."+(i+1)
  }
  for(var i = 0;i<=20;i++){
    test_history[i] = "* [Topic@] [User@] example_history_"+(i+1)
  }
  res.render('customer',{
    data : ex_content,
    type : ex_content,
    sample_history : test_history
  });
});

app.get('/logout',function(req,res){
  res.render('index');
});

//post method
app.post('/home',function(req,res){
  var reqLogin = req.body;
  if (reqLogin['name'] != '' && reqLogin['password'] != '') {
    res.render('home',{p_content : 'xxxxx'});
  }
  else {
    res.render('index');
  }
});

//listen port
app.listen('8000',function(){
  console.log('listen on localhost:3030');
});
