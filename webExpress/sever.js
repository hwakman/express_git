var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var nodeadmin = require('nodeadmin');
var mysql = require('mysql');
var conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'user',
});

conn.connect(function (err){
  if(err) throw err;
  console.log('connected !');
});

//set method
app.set('view engine','ejs');
app.set('views','./temps');

//use method
app.use(nodeadmin(app));
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
  if (req.query['search'] == null) {
    conn.query('SELECT * FROM goods ORDER BY code',function(err,result){
      var code = [];
      var name = [];
      for (var i = 0; i < result.length; i++) {
        code[i] = result[i].code;
        name[i] = result[i].name;
      }
      res.render('store',{
        data : code,
        name : name
      });
    });
  }
  else {
    conn.query("SELECT * FROM goods WHERE code = '"+req.query['search']+"' OR name like '%"+req.query['search']+"%'",function(err,result){
      if(result != ''){
        var code = [];
        var name = [];
        for (var i = 0; i < result.length; i++) {
          code[i] = result[i].code;
          name[i] = result[i].name;
        }
        res.render('store',{
          data : code,
          name : name
        });
      }
      else {
        res.redirect('/store');
      }
    });
  }
});

app.get('/goodsdetail',function(req,res){
  conn.query("SELECT * FROM goods WHERE code = '"+req.query['code']+"'",function(err,result){
    var code = [];
    var name = [];
    var price = [];
    var total = [];
    var total_price = [];
    var detail = [];
    var reg_date = [];
    var ex_date = [];
    var note = [];
    for (var i = 0; i < result.length; i++) {
      code[i] = result[i].code;
      name[i] = result[i].name;
      price[i] = result[i].price;
      total[i] = result[i].total;
      total_price[i] = result[i].total_price;
      detail[i] = result[i].detail;
      reg_date[i] = result[i].reg_date;
      ex_date[i] = result[i].ex_date;
      note[i] = result[i].note;
    }
    res.render('goodsdetail',{
      code : code,
      name : name,
      price : price,
      total : total,
      total_price : total_price,
      detail : detail,
      reg_date : reg_date,
      ex_date : ex_date,
      note : note
    });
  });
});

app.get('/goodsedit',function(req,res){
  conn.query("SELECT * FROM goods WHERE code = '"+req.query['code']+"'",function(err,result){
    var code = [];
    var name = [];
    var price = [];
    var total = [];
    var detail = [];
    var reg_date = [];
    var ex_date = [];
    var note = [];
    for (var i = 0; i < result.length; i++) {
      code[i] = result[i].code;
      name[i] = result[i].name;
      price[i] = result[i].price;
      total[i] = result[i].total;
      detail[i] = result[i].detail;
      reg_date[i] = result[i].reg_date;
      ex_date[i] = result[i].ex_date;
      note[i] = result[i].note;
    }
    res.render('goodsedit',{
      code : code,
      name : name,
      price : price,
      total : total,
      detail : detail,
      reg_date : reg_date,
      ex_date : ex_date,
      note : note
    });
  });
});

app.get('/goodsdel',function(req,res){
  conn.query("DELETE FROM goods WHERE code = '"+req.query['code']+"'",function(err,result){
    if(err) throw err;
    res.redirect('/store');
  });
});

app.get('/reg_form',function(req,res){
  res.render('reg_form');
});

app.get('/customer',function(req,res){
  conn.query("SELECT * FROM user",function(err,result){
    var name = [];
    var email = [];
    var test_history = [];
    for (var i = 0; i < result.length; i++) {
      name[i] = result[i].name;
      email[i] = result[i].email;
    }
    res.render('customer',{
      name : name,
      email : email,
      sample_history : test_history
    });
  });
});

app.get('/userdetail',function(req,res){
  var name = [];
  var email = [];
  var tel = [];
  var status = [];
  var address = [];
  conn.query("SELECT * FROM user WHERE email='"+req.query['name']+"'",function(err,result){
    for (var i = 0; i < result.length; i++) {
      name[i] = result[i].name;
      email[i] = result[i].email;
      tel[i] = result[i].tel;
      status[i] = result[i].status;
      address[i] = result[i].address;
    }
    res.render('userdetail',{
      name : name,
      email : email,
      tel : tel,
      status : status,
      address : address,
    });
  });
});

app.get('/logout',function(req,res){
  res.render('index');
});

//post method
app.post('/home',function(req,res){
  var reqLogin = req.body;
  conn.query("SELECT * FROM authen WHERE email='"+reqLogin['name']+"' AND password='"+reqLogin['password']+"'",function (err,result){
    if (result != '' && result != null) {
      res.render('home');
    }
    else {
      res.redirect('/');
    }
  });
});

app.post('/regis_commit',function(req,res){
  var reqLogin = req.body;
  console.log(reqLogin);
  if(reqLogin['password'] == reqLogin['conf_password']){
    conn.query("SELECT * FROM user WHERE email='"+reqLogin['email']+"'",function(err,result){
      if (result != '' && result != null){
        res.redirect('/reg_form');
      }
      else{
        conn.query("INSERT INTO user VALUE ('"+reqLogin['name']+"','"+reqLogin['email']+"','"+reqLogin['tel']+"','"+reqLogin['status']+"','"+reqLogin['address']+"')",function(err){
          if(err) throw err;
          console.log("Insert user");
        });
        conn.query("INSERT INTO authen VALUE ('"+reqLogin['email']+"','"+reqLogin['password']+"','003')",function(err){
          console.log("Insert authen");
        });
        res.redirect('/');
      }
    });
  }
  else {
    res.redirect('/reg_form');
  }
});

app.post('/store',function(req,res){
  var reqPass = req.body;
  console.log(reqPass);
});

app.post('/regis_goods',function(req,res){
  var reqPass = req.body;
  console.log(reqPass);
  res.render('regis_goods',{
    code : reqPass['code'],
    name : reqPass['name'],
    price : reqPass['price'],
    ex_date : reqPass['ex_date'],
  });
});

app.post('/regis_goods_conf',function(req,res){
  var reqPass = req.body;
  console.log(reqPass);
  if(reqPass['code'] != '' && reqPass['name'] != ''){
    conn.query("SELECT count(*) as count FROM goods WHERE code='"+reqPass['code']+"'",function(err,result){
      if(result[0].count < 1){
        var sql = "INSERT INTO goods VALUE (";
        sql += "'"+reqPass['code']+"',";
        sql += "'"+reqPass['name']+"',";
        sql += "'"+reqPass['price']+"',";
        sql += "'"+reqPass['total']+"',";
        sql += "'"+(reqPass['total']*reqPass['price'])+"',";
        sql += "'"+reqPass['detail']+"',";
        sql += "'"+reqPass['reg_date']+"',";
        sql += "'"+reqPass['ex_date']+"',";
        sql += "'"+reqPass['note']+"'";
        sql += ")";
        console.log(sql);
        conn.query(sql,function(err){
          if(err) throw err;
          console.log('insert !');
        });
        res.render('regis_goods_conf',{
          code : reqPass['code'],
          name : reqPass['name'],
          price : reqPass['price'],
          total : reqPass['total'],
          detail : reqPass['detail'],
          reg_date : reqPass['reg_date'],
          ex_date : reqPass['ex_date'],
          note : reqPass['note'],
        });
      }
    });
  }
  else{
    res.redirect('/store');
  }
});

app.post('/edit_goods_conf',function(req,res){
  var reqPass = req.body;
  console.log(reqPass);
  var sql = "UPDATE goods SET ";
  sql += " name = '"+reqPass['name']+"',";
  sql += " price = '"+reqPass['price']+"',";
  sql += " total = '"+reqPass['total']+"',";
  sql += " total_price = '"+(reqPass['price']*reqPass['total'])+"',";
  sql += " detail = '"+reqPass['detail']+"',";
  sql += " reg_date = '"+reqPass['reg_date']+"',";
  sql += " ex_date = '"+reqPass['ex_date']+"',";
  sql += " note = '"+reqPass['note']+"'";
  sql += "WHERE code = '"+reqPass['code']+"'"
  console.log(sql);
  conn.query(sql,function(err){
    if(err) throw err;
    console.log('insert !');
  });
  res.render('regis_goods_conf',{
    code : reqPass['code'],
    name : reqPass['name'],
    price : reqPass['price'],
    total : reqPass['total'],
    detail : reqPass['detail'],
    reg_date : reqPass['reg_date'],
    ex_date : reqPass['ex_date'],
    note : reqPass['note'],
  });
});

//listen port
app.listen('8000',function(){
  console.log('listen on localhost:8000');
});
