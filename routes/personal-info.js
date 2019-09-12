var con = require('./connect-db.js'); /*เชื่อมต่อฐานข้อมูล*/
var bodyParser = require('body-parser');

module.exports = function(app) {

  app.get('/profile', function(req, res) {
    var message = req.query.message;
    var userinfo = req.user;
    var userinfoexpert = req.user.userExpertiseID;

    var sql = "SELECT * FROM project.expertise order by expertiseName;SELECT * FROM project.subexpertise  where subExpertiseID=" +
      userinfoexpert + " order by subExpertiseName;SELECT * FROM project.workplace; ";
    con.query(sql, function(err, results) {
      if (err) console.log("Error Selecting : %s ", err);

      res.render('pages/profile', {
        message: message,
        userinfo: userinfo,

        expertise: results[0],
        subexpertise: results[1],
        workplace: results[2],
      });

    });

  });

  app.get('/edit-profile', function(req, res) {
    var userinfo = req.user;
    res.render('pages/edit-profile', {
      userinfo: userinfo,
    });
  });


  app.get('/edit-workinfo', function(req, res) {
    var message = req.query.message;
    var sql = "SELECT * FROM project.workplace order by wpName;"

    con.query(sql, function(err, results) {
      console.log(sql);
      if (err) console.log("Error Selecting : %s ", err);
      console.log(results);

      var userinfo = req.user;
      res.render('pages/edit-workinfo', {
        message: message,
        userinfo: userinfo,
        allworkplace: results,
      });

    });


  });

  app.get('/edit-expertise', function(req, res) {
    var userinfo = req.user;
    var message = req.query.message;

    var userinfoexpert = req.user.userExpertiseID;
    console.log(userinfoexpert);



    if (userinfoexpert == '' || userinfoexpert == null || userinfoexpert == undefined) {
      var sql = "SELECT * FROM project.expertise order by expertiseName;";
      con.query(sql, function(err, results) {
        if (err) console.log("Error Selecting : %s ", err);

        res.render('pages/edit-expertise', {
          message: message,
          userinfo: userinfo,

          expertise: results,
        });

      });
    }
    if (userinfoexpert >= 0) {
      var sql = "SELECT * FROM project.expertise order by expertiseName;SELECT * FROM project.subexpertise  where subExpertiseID=" +
        userinfoexpert + " order by subExpertiseName  ";
      con.query(sql, function(err, results) {
        if (err) console.log("Error Selecting : %s ", err);

        res.render('pages/edit-expertise', {
          message: message,
          userinfo: userinfo,

          expertise: results[0],
          subexpertise: results[1],
        });

      });
    }





  });

  app.get('/edit-career-history', function(req, res) {
    var userinfo = req.user;
    var message = req.query.message;

    res.render('pages/edit-career-history', {
      message: message,
      userinfo: userinfo,
    });
  });

  app.get('/edit-education-history', function(req, res) {
    var userinfo = req.user;
    res.render('pages/edit-education-history', {
      userinfo: userinfo,
    });
  });







  app.post('/edit-expertise', function(req, res) {

    var userExpertiseID = req.body.userExpertiseID;
    var userSubExpertiseID = req.body.userSubExpertiseID;
    var userSkill = req.body.userSkill;

    console.log(userExpertiseID);
    console.log(userSubExpertiseID);
    console.log(userSkill);

    if (req.body.userExpertiseID == '' || req.body.userExpertiseID == undefined) {
      var message = encodeURIComponent('err A01');
      res.redirect('/edit-expertise?message=' + message);
    }
    if (req.body.userSubExpertiseID == '' || req.body.userSubExpertiseID == undefined) {
      var message = encodeURIComponent('err A02');
      res.redirect('/edit-expertise?message=' + message);
    }

    if (req.body.userSkill == '' || req.body.userSkill == undefined) userSkill = "-";

    console.log(req.user.id);

    var sql = "UPDATE project.users  SET userExpertiseID ='" + userExpertiseID +
      "',userSubExpertiseID ='" + userSubExpertiseID +
      "',userSkill ='" + userSkill +

      "' WHERE id ='" + req.user.id + "' ";



    con.query(sql, function(err, rows) {
      if (err)
        console.log("Error Selecting : %s ", err);
    });

    var message = encodeURIComponent('แก้ไขข้อมูลเรียบร้อยแล้ว');
    res.redirect('/edit-expertise?message=' + message);

  });

  app.post('/edit-workinfo', function(req, res) {

    var userPosition = req.body.userPosition;
    var userWpID = parseInt(req.body.userWpID);
    var userSubWpName = req.body.userSubWpName;
    var userWorkTel = req.body.userWorkTel;
    var userWorkEmail = req.body.userWorkEmail;
    var userWorkAddress = req.body.userWorkAddress;

    if (req.body.userPosition == '' || req.body.userPosition == undefined) userPosition = "-";
    if (req.body.userSubWpName == '' || req.body.userSubWpName == undefined) userSubWpName = "-";
    if (req.body.userWpID == '' || req.body.userWpID == undefined) userWpID = "29";
    if (req.body.userWorkTel == '' || req.body.userWorkTel == undefined) userWorkTel = "-";
    if (req.body.userWorkEmail == '' || req.body.userWorkEmail == undefined) userWorkEmail = "-";
    if (req.body.userWorkAddress == '' || req.body.userWorkAddress == undefined) userWorkAddress = "-";

    console.log(req.user.id);

    var sql = "UPDATE project.users  SET userPosition ='" + userPosition +
      "',userWpID ='" + userWpID +
      "',userSubWpName ='" + userSubWpName +
      "',userWorkTel ='" + userWorkTel +
      "',userWorkEmail ='" + userWorkEmail +
      "',userWorkAddress ='" + userWorkAddress +

      "' WHERE id ='" + req.user.id + "' ";



    con.query(sql, function(err, rows) {
      if (err)
        console.log("Error Selecting : %s ", err);
    });

    var message = encodeURIComponent('แก้ไขข้อมูลเรียบร้อยแล้ว');
    res.redirect('/edit-workinfo?message=' + message);

  });








 //for ajax req data
  app.get('/edit-expertise-data', function(req, res) {
    var userinfo = req.user;
    var expertiseSelectData = req.query.expertiseSelectData;

    var sql = "SELECT * FROM project.subexpertise where subExpertiseID = " + expertiseSelectData + " order by subExpertiseName  ;"

    con.query(sql, function(err, results) {
      console.log(sql);
      if (err) console.log("Error Selecting : %s ", err);
      console.log(results);
      res.send(results);

    });



  })

}