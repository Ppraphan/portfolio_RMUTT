var axios = require('axios');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var bodyParser = require("body-parser");
var url = require('url');
var querystring = require('querystring');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var authController = require('../controllers/authcontroller.js');
var con = require('./connect-db.js');
var role = require('./role.js');
module.exports = function(app, passport) {

  app.get('/useridcheck', isLoggedIn, authController.useridcheck);

  app.post('/useridcheck', function(req, res) {
    var userinfo = req.user;
    var listID = [];
    var email = req.body.newemail;
    console.log("newemail = " + email);

    var sql = "SELECT email FROM project.users";
    con.query(sql, function(err, rows, result) {
      console.log("------------------------------------------------");
      if (err) throw err;

      for (var i = 0; i < rows.length; i++) {
        listID.push(rows[i].email);
      }
      console.log(listID);

      let result2 = listID;
      console.log(result2);

      for (let i = 0; i < result2.length; i++) {
        var resultSearch = result2.includes(email);
      }

      if (resultSearch == true) {
        var mses = "e-mail : " + email + "ถูกใช้ไปแล้ว";
        res.render("pages/useridcheck", {
          userinfo: userinfo,
          messages: mses,
        });
      } else {
        email = encodeURIComponent(email);
        res.redirect('/signup?email=' + email);
      }

    });
  });

  app.get('/signup', isLoggedIn, function(req, res) {
    var userinfo = req.user;
    var email = req.query.email;
    var query = con.query('SELECT countryISOCode,countryName FROM project.country order by countryName', function(err, rows) {
      if (err)
        console.log("Error Selecting : %s ", err);
      res.render('pages/signup', {
        userinfo: userinfo,
        data: rows,
        email: email,
      });
    });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/addprofile',
    failureRedirect: '/signup',
    session: false,
  }));

  app.get("/signup/getDpment/:catdata", function(req, res) {
    var catdata = req.params.catdata;

    console.log(catdata);

    var sql = "SELECT Sub_Dpment_name FROM project.sub_dpment where Sub_Dpment_Parent ='" + req.params.catdata + "'";
    console.log(sql);
    con.query(sql, function(err, rows) {
      console.log(rows);
      if (err) throw err;
      res.send(rows);
    });
  });

  app.get('/signin', authController.signin);


  app.get('/', function(req, res) {
    var message = req.query.message;
    var userinfo = req.user;

    var sql = "SELECT profilePic,firstname,lastname,userPosition,userWpID FROM project.users limit 0, 10;"+
    "SELECT * FROM project.expertise  order by expertiseName;"+
    "SELECT * FROM project.workplace order by wpName;";

    con.query(sql, function(err, results) {
      if (err) console.log("Error Selecting : %s ", err);

      res.render('pages/index', {
        message: message,
        userinfo: userinfo, 
        data:results[0],
        expertise:results[1],
        workplace:results[2],
      });
    });

  });

  app.get('/logout', authController.logout);

  app.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/',
    failureRedirect: '/signin'
  }));

  function movefile(req, res, next) {}

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/signin');
  }

  app.all('*', function(req, res, next) {
    if (req.path === '/' || req.path === '/login'|| req.path === '/forgot-password')
      next();
    else
      isLoggedIn(req, res, next);
  });

  function requireRole(role) {
    return function(req, res, next) {
      if (req.user.userPermission === role) {
        next();
      } else {
        res.send(403);
      }
    }
  }

  //
  // app.get("/foo/:id", requireRole("user"), foo.show);
  // app.post("/foo", requireRole("admin"), foo.create);
  //
  // // All bars are protected
  // app.all("/foo/bar", requireRole("admin"));
  //
  // // All paths starting with "/foo/bar/" are protected
  // app.all("/foo/bar/*", requireRole("user"));

}
