module.exports = function(app, server, io) {

    app.use(function(req,res,next){
        res.header("Access-Control-Allow-Origin", "*");
        next();
    });
    var asynq          = require('async');
    var nodemailer     = require('nodemailer');

    var fs = require('fs');
    var smtpTransport  = require('nodemailer-smtp-transport');
    var wellknown      = require('nodemailer-wellknown');
    var bodyParser     = require('body-parser');

    var bcrypt         = require('bcrypt-nodejs');
    var crypto         = require('crypto');

    var User           = require('./models/user');

    var configAuth = require('../config/auth'); // use this one for testing

    var _              = require('underscore-node');
    const util = require('util')

    var path = require('path'); 

    app.get("/register", function(req, res){

        var email = req.query.email.trim();
        var name = req.query.name.trim();
        
        //Check if the email is taken
        if(name.trim() == "" || email.trim() == ""){
            res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "EMPTY_F"}));
        }else if(!validateEmail(email)){
            res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "INV_EMAIL"}));
        }else{
            User.findOne({email : email}, function(err, user){
                if(err){
                    res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "500"}));
                }else{
                    if(user){
                        res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "EMAIL_TAKEN"}));
                    }else{
                        //Email is ok. Register the user.
                        var user = new User();
                        user.name = name;
                        user.email = email;

                        user.save(function(err){

                            if(err){
                                res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "500"}));
                            }else{
                                res.send(JSON.stringify({ "message" : "SUCCESS"}));
                            }

                        });
                    }
                }
            })
        }
        
    });

    app.get("/", function(req, res){
        res.sendFile(path.join(rootDir + '/index.html'));
    });

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
};
