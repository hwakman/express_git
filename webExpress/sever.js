var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session');
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

function addslashes(str) {
    str = str.replace(/\\/g, '\\\\');
    str = str.replace(/\'/g, '\\\'');
    str = str.replace(/\"/g, '\\"');
    str = str.replace(/\0/g, '\\0');
    return str;
}

//set method
app.set('view engine','ejs');
app.set('views','./temps');

//use method
app.use(nodeadmin(app));
app.use(session({secret: "Secret Key!"}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//get method
app.get('/',function(req ,res){
  res.render('index');
});

app.get('/home',function(req,res){
  if(req.session.authen == null){
    res.redirect('/');
  }
  else{
    var autor = [];
    var topic = [];
    var content = [];
    var code = [];
    var action = [];
    var post_user = [];
    var message = [];
    conn.query("SELECT * FROM new_feed ORDER BY  post_date DESC",function(err,result){
      for(var i = 0 ; i < result.length ; i++){
        autor[i]   = result[i].post_by;
        topic[i]   = result[i].topic;
        content[i] = result[i].content;
      }
      conn.query("SELECT * FROM history ORDER BY date DESC LIMIT 5",function(err,result){
        for (var i = 0; i < result.length; i++) {
          code[i] = result[i].user;
          action[i] = result[i].topic;
        }
        conn.query("SELECT * FROM message WHERE get_user = '"+req.session.authen+"' ORDER BY get_date DESC",function(err,result){
          for (var i = 0; i < result.length; i++) {
            post_user[i] = result[i].post_user;
            message[i] = result[i].message;
          }
          console.log(result);
          res.render('home',{
            autor : autor,
            topic : topic,
            content : content,
            code : code,
            action : action,
            message : message,
            post_user : post_user,
          });
        });
      });
    });
  }
});

app.get('/news',function(req,res){
  if(req.session.authen == null){
    res.redirect('/');
  }
  else {
    var topic = [];
    var content = [];
    conn.query("SELECT * FROM new_feed WHERE topic='"+req.query['topic']+"'",function(err,result){
      for (var i = 0; i < result.length; i++) {
        topic[i] = result[i].topic;
        content[i] = result[i].content;
      }
      res.render('news_content',{
        topic : topic,
        content : content
      });
    });
  }
});

app.get('/read_message',function(req,res){
  var post = [];
  var message = [];
  var sql = "SELECT * FROM message";
  sql += " WHERE (post_user ='"+req.query['user']+"' AND get_user = '"+req.session.authen+"')";
  sql += " OR (post_user ='"+req.session.authen+"' AND get_user = '"+req.query['user']+"')";
  sql += " ORDER BY get_date DESC LIMIT 5";
  conn.query(sql,function(err,result){
    for (var i = 0; i < result.length; i++) {
      post[i] = result[i].post_user;
      message[i] = result[i].message;
    }
    res.render('message',{
      post : post,
      message : message,
      email : req.query['user'],
      login_user : req.session.authen,
    });
  });
});

app.get('/store',function(req,res){
  if(req.session.authen == null){
    res.redirect('/');
  }
  else {
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
      conn.query("SELECT * FROM goods WHERE code = '"+req.query['search']+"' OR name like '"+req.query['search']+"%'",function(err,result){
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
  }
});

app.get('/goodsdetail',function(req,res){
  if(req.session.authen == null){
    res.redirect('/');
  }
  else {
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
      if (result == '') {
          code = 'This item does not exist or was deleted !';
      }
      else {
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
  }
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
  });
  conn.query("INSERT INTO history VALUE ('"+req.query['code']+"','DELETE','"+Date.now()+"')",function(err){
    if (err) throw err;
    console.log('history update !');
  });
  res.redirect('/store');
});

app.get('/reg_form',function(req,res){
  res.render('reg_form');
});

app.get('/customer',function(req,res){
  if(req.session.authen == null){
    res.redirect('/');
  }
  else {
    var name = [];
    var email = [];
    var test_history = [];
    console.log(req.session.authen);
    if (req.query['search'] != null) {
      conn.query("SELECT * FROM user WHERE name = '"+req.query['search']+"' or email like '"+req.query['search']+"%'",function(err,result){
        for (var i = 0; i < result.length; i++) {
          name[i] = result[i].name;
          email[i] = result[i].email;
        }
        res.render('customer',{
          name : name,
          email : email,
          login_user : req.session.authen,
        });
      });
    }
    else {
      conn.query("SELECT * FROM user",function(err,result){
        for (var i = 0; i < result.length; i++) {
          name[i] = result[i].name;
          email[i] = result[i].email;
        }
        res.render('customer',{
          name : name,
          email : email,
          login_user : req.session.authen,
        });
      });
    }
  }
});

app.get('/message_send',function(req,res){
  console.log(req.query['user']);
});

app.post('/message_send',function(req,res){
  if(req.body['get_user']!='' && req.body['message'] != ''){
    console.log(req.body['get_user'],req.body['message']);
    conn.query("SELECT * FROM user WHERE email='"+req.body['get_user']+"'",function(err,result){
      if(result != ''){
        conn.query("INSERT INTO message VALUE('"+req.body['get_user']+"','"+req.body['message']+"','"+req.session.authen+"','"+Date.now()+"')");
      }
      res.redirect('/customer');
    });
  }
  else {
    res.redirect('/customer');
  }
});

app.post('/message_send_re',function(req,res){
  if(req.body['get_user']!='' && req.body['message'] != ''){
    conn.query("SELECT * FROM user WHERE email='"+req.body['get_user']+"'",function(err,result){
      if(result != ''){
        conn.query("INSERT INTO message VALUE('"+req.body['get_user']+"','"+addslashes(req.body['message'])+"','"+req.session.authen+"','"+Date.now()+"')");
      }
      res.redirect("/read_message?user="+req.body['get_user']+"");
    });
  }
  else {
    res.redirect("/read_message?user="+req.body['get_user']+"");
  }
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
  req.session.authen = null;
  res.render('index');
});

//post method
app.post('/home',function(req,res){
  var reqLogin = req.body;
  conn.query("SELECT * FROM authen WHERE email='"+reqLogin['name']+"' AND password='"+reqLogin['password']+"'",function (err,result){
    if (result != '' && result != null) {
      req.session.authen = reqLogin['name']
      res.redirect('/home');
    }
    else {
      res.redirect('/');
    }
  });
});

app.post('/post_news',function(req,res){
  var reqLogin = req.body;
  conn.query("INSERT INTO new_feed VALUE('"+reqLogin['n_topic']+"','"+reqLogin['n_content']+"','"+req.session.authen+"','"+Date.now()+"')");
  res.redirect('/home');
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
        conn.query("INSERT INTO history VALUE ('"+reqPass['code']+"','CREATE','"+Date.now()+"')",function(err){
          if (err) throw err;
          console.log('history update !');
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
  conn.query("INSERT INTO history VALUE ('"+reqPass['code']+"','UPDATE','"+Date.now()+"')",function(err){
    if (err) throw err;
    console.log('history update !');
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
