'use strict';

require('dotenv').config();
const Knex = require('knex');
const crypto = require('crypto');
var multer = require('multer');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const HttpStatus = require('http-status-codes');
const fse = require('fs-extra');
const jwt = require('./jwt');
const model = require('./model');
const moment = require('moment');

const app = express();

const uploadDir = process.env.UPLOAD_DIR || './uploaded';

fse.ensureDirSync(uploadDir);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

var upload = multer({ storage: storage });

// var upload = multer({ dest: process.env.UPLOAD_DIR || './uploaded' });

var db = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: +process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }
});

let checkAuth = (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  } else {
    token = req.body.token;
  }

  jwt.verify(token)
    .then((decoded) => {
      req.decoded = decoded;
      next();
    }, err => {
      return res.send({
        ok: false,
        error: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED),
        code: HttpStatus.UNAUTHORIZED
      });
    });
}

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => res.send({ ok: true, message: 'Welcome to my api-Kiosk By Nalin Soft!', code: HttpStatus.OK }));
app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  res.send({ ok: true, message: 'File uploaded!', code: HttpStatus.OK });
});

app.post('/login', async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username && password) {
    var encPassword = crypto.createHash('md5').update(password).digest('hex');

    try {
      var rs = await model.doLogin(db, username, encPassword);
      if (rs.length) {
        var token = jwt.sign({ username: username });
        res.send({ ok: true, token: token, Licence: 'nalinsoft' });
        //console.log({ ok: true, token: token });
      } else {
        res.send({ ok: false, error: 'Invalid username or password!', code: HttpStatus.UNAUTHORIZED });
      }
    } catch (error) {
      console.log(error);
      res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
    }

  } else {
    res.send({ ok: false, error: 'Invalid data!', code: HttpStatus.INTERNAL_SERVER_ERROR });
  }

});

app.get('/personall', checkAuth, async (req, res) => {
  try {
    var cid = req.body.cid;
    var rs = await model.getPersonAll(db, cid);
    var data = [];

    rs[0].forEach(v => {
      var obj = {};
      obj.hn = v.hn;
      obj.prename = v.prename;      
      obj.fname = v.fname;
      obj.lname = v.lname;
      obj.pop_id = v.pop_id;
      obj.pttype = v.pttype;
      obj.namepttype = v.namepttype;
      obj.male = v.male;
      obj.age = v.age;
      obj.ldate = moment(v.ldate).format('YYYY-MM-DD');
      data.push(obj);
    })
    res.send({ok: true, data, Licence: 'NalinSoft'});
    console.log(data);
 } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }
});

app.get('/personhihn', checkAuth, async (req, res) => {
  try {
    var hn = req.body.hn;
    var rs = await model.getPersonHiHn(db, hn);
    var data = [];

    rs[0].forEach(v => {
      var obj = {};
      obj.hn = v.hn;
      obj.prename = v.prename;      
      obj.fname = v.fname;
      obj.lname = v.lname;
      obj.pop_id = v.pop_id;
      obj.pttype = v.pttype;
      obj.namepttype = v.namepttype;
      obj.male = v.male;
      obj.age = v.age;
      obj.ldate = moment(v.ldate).format('YYYY-MM-DD');
      data.push(obj);
    })
    res.send({ok: true, data, Licence: 'NalinSoft'});
    console.log(data);
 } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }
});

app.get('/personhicid', checkAuth, async (req, res) => {
  try {
    var cid = req.body.cid;
    var rs = await model.getPersonHiCid(db, cid);
    
    var data = [];

    rs[0].forEach(v => {
      var obj = {};
      obj.hn = v.hn;
      obj.prename = v.prename;      
      obj.fname = v.fname;
      obj.lname = v.lname;
      obj.pop_id = v.pop_id;
      obj.pttype = v.pttype;
      obj.namepttype = v.namepttype;
      obj.male = v.male;
      obj.age = v.age;
      obj.ldate = moment(v.ldate).format('YYYY-MM-DD');
      data.push(obj);
    })
    res.send({ok: true, data, Licence: 'NalinSoft'});
    console.log(data);
 } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }
});

app.get('/personovsthn', checkAuth, async (req, res) => {
  try {
    var hn = req.body.hn;
    var vstdttm = req.body.vstdttm;
    var rs = await model.getPersonOvstHn(db, hn,vstdttm);

    var data = [];

    rs[0].forEach(v => {
      var obj = {};
      obj.vn=v.vn;
      obj.hn = v.hn;
      obj.prename = v.prename;      
      obj.fname = v.fname;
      obj.lname = v.lname;
      obj.pop_id = v.pop_id;
      obj.pttype = v.pttype;
      obj.namepttype = v.namepttype;
      obj.male = v.male;
      obj.age = v.age;
      obj.vstdttm = moment(v.vstdttm).format('YYYY-MM-DD HH:mm:ss');
      data.push(obj);
    })
    res.send({ok: true, data, Licence: 'NalinSoft'});
    console.log(data);
 } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }
});

app.get('/personovstcid', checkAuth, async (req, res) => {
  try {
    var cid = req.body.cid;
    var vstdttm = req.body.vstdttm;
    var rs = await model.getPersonOvstCid(db, cid,vstdttm);

    var data = [];

    rs[0].forEach(v => {
      var obj = {};
      obj.vn=v.vn;
      obj.hn = v.hn;
      obj.prename = v.prename;      
      obj.fname = v.fname;
      obj.lname = v.lname;
      obj.pop_id = v.pop_id;
      obj.pttype = v.pttype;
      obj.namepttype = v.namepttype;
      obj.male = v.male;
      obj.age = v.age;
      obj.vstdttm = moment(v.vstdttm).format('YYYY-MM-DD HH:mm:ss');
      data.push(obj);
    })
    res.send({ok: true, data, Licence: 'NalinSoft'});
    console.log(data);
 } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }
});

app.get('/getfu', checkAuth, async (req, res) => {
  try {
    var hn = req.body.hn;
    var hn1 = req.body.hn1;
    var hn2 = req.body.hn2;
    var rs = await model.getFu(db, hn,hn1,hn2);

    var data = [];

        rs[0].forEach(v => {
          var obj = {};
          obj.code = v.code;
          obj.hn = v.hn;      
          obj.cln = v.cln;
          obj.fudate = moment(v.fudate).format('YYYY-MM-DD');
          obj.dspname = v.dspname;
          obj.dct = v.dct;
          data.push(obj);
        })
        res.send({ok: true, data, Licence: 'NalinSoft'});
        console.log(data);
 } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }
});

app.post('/registeroday', checkAuth, async (req, res) => {
  try {
    var tablename= req.body.tablename;    
    var vn = req.body.vn;
    var hn= req.body.hn;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var male = req.body.male;
    var age = req.body.age;
    var pttype = req.body.pttype;
    var vsttime = req.body.vsttime;    
    var rs = await model.postOday(db, tablename,vn,hn,fname,lname,male,age,pttype,vsttime);

    res.send( { ok: true, Licence: 'NalinSotft' } );
    
    console.log({ ok: true });
    
  } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }
});

app.post('/registervisit', checkAuth, async (req, res) => {
  try {
    var vstdttm= req.body.vstdttm;
    var hn= req.body.hn;
    var cln= req.body.cln;
    var pttype= req.body.pttype;
    var register= req.body.register;
    
    var rs = await model.postOvst(db, vstdttm,hn,cln,pttype,register);

    res.send(rs[0]);   

    console.log({ ok: true });
  } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }
});

app.post('/updatevitalsign', checkAuth, async (req, res) => {
  try {
    var bw= req.body.bw;
    var height= req.body.height;            
    var tt=req.body.tt;
    var sbp=req.body.sbp;
    var dbp=req.body.dbp;
    var pr=req.body.pr;
    var bmi=req.body.bmi;
    var vn=req.body.vn;

    var rs = await model.postUpdateVitalSign(db, bw,height,tt,sbp,dbp,pr,bmi,vn);
    res.send( { ok: true } );
    console.log({ ok: true });
  } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }
});

app.post('/updatevitalsignoday', checkAuth, async (req, res) => {
  try {
    var tablename=req.body.tablename;
    var bw= req.body.bw;          
    var tt=req.body.tt;
    var sbp=req.body.sbp;
    var dbp=req.body.dbp;
    var pr=req.body.pr;
    var vn=req.body.vn;
    
    var rs = await model.postUpdateVitalSignOday(db, tablename, bw,tt,sbp,dbp,pr,vn);
    res.send( { ok: true } );
    console.log({ ok: true });
  } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }
});

app.post('/updateldate', checkAuth, async (req, res) => {
  try {    
    var ldate=req.body.ldate;
    var hn=req.body.hn;
    
    var rs = await model.postUPdateLdate(db, ldate,hn);

    res.send( { ok: true } );
    console.log({ ok: true });
  } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }
});

app.post('/addsat', checkAuth, async (req, res) => {
  try {    
    var vn=req.body.vn;
    var sat=req.body.sat;
    
    var rs = await model.postAddSat(db, vn,sat);

    res.send( { ok: true, Licence:'NalinSoft' } );
    console.log({ ok: true });
  } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }
});

app.post('/registerlbbk', checkAuth, async (req, res) => {
  try {
    var labcode=req.body.labcode;
    var vn=req.body.vn;
    var reportby=req.body.reportby;
    var requestby=req.body.requestby;
    var vstdttm=req.body.vstdttm;
    var c2automate=req.body.c2automate;
    var hn=req.body.hn;
    var an=req.body.an;
    var senddate=req.body.senddate;
    var sendtime=req.body.sendtime;
    var srvtime=req.body.srvtime;
    var pttype=req.body.pttype;
    var hcode=req.body.hcode;
    var approve=req.body.approve;
    var lcomment=req.body.lcomment;
    var labcomment=req.body.labcomment;
    var labgroup=req.body.labgroup;
    var pdffile=req.body.pdffile;
    var acceptby=req.body.acceptby;
    var accepttime=req.body.accepttime;
    var rs = await model.postLbbk(db, labcode,vn,reportby,requestby,vstdttm,c2automate,hn,an,senddate,sendtime,srvtime,pttype,hcode,approve,lcomment,labcomment,labgroup,pdffile,acceptby,accepttime);
    res.send( { ok: true } );
    console.log({ ok: true });
  } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }
});

app.post('/users', checkAuth, async (req, res, next) => {
  try {
    var username = req.body.username;
    var password = req.body.password;
    var fullname = req.body.fullname;
    var email = req.body.email;

    if (username && password && email && fullname) {
      var encPassword = crypto.createHash('md5').update(password).digest('hex');
      var data = {
        username: username,
        password: encPassword,
        fullname: fullname,
        email: email
      };
      var rs = await model.save(db, data);
      res.send({ ok: true, id: rs[0] });
    } else {
      res.send({ ok: false, error: 'Invalid data', code: HttpStatus.INTERNAL_SERVER_ERROR });
    }
  } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }
});

app.put('/users/:id', checkAuth, async (req, res, next) => {
  try {
    var id = req.params.id;
    var fullname = req.body.fullname;
    var email = req.body.email;

    if (id && email && fullname) {
      var data = {
        fullname: fullname,
        email: email
      };
      var rs = await model.update(db, id, data);
      res.send({ ok: true });
    } else {
      res.send({ ok: false, error: 'Invalid data', code: HttpStatus.INTERNAL_SERVER_ERROR });
    }
  } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }
});

app.delete('/users/:id', checkAuth, async (req, res, next) => {
  try {
    var id = req.params.id;

    if (id) {
      await model.remove(db, id);
      res.send({ ok: true });
    } else {
      res.send({ ok: false, error: 'Invalid data', code: HttpStatus.INTERNAL_SERVER_ERROR });
    }
  } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }
});

app.get('/users', checkAuth, async (req, res) => {
  try {
    var username = req.query.username;
    var rs = await model.getUsers(db, username);
    res.send({ ok: true, rows: rs[0] });
    //console.log(rs[0]);
 } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}); 

//error handlers
if (process.env.NODE_ENV === 'development') {
  app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: {
        ok: false,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
      }
    });
  });
}

app.use((req, res, next) => {
  res.status(HttpStatus.NOT_FOUND).json({
    error: {
      ok: false,
      code: HttpStatus.NOT_FOUND,
      error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
    }
  });
});

var port = +process.env.WWW_PORT || 4488;

app.listen(port, () => console.log(`Api listening on port ${port}!`));