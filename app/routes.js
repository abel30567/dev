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

        var email = req.query.email.trim().toLowerCase();
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
            
                                // create reusable transporter object using the default SMTP transport
                                let transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                        user: 'info@imarkett.com',
                                        pass: 'iMarkettinfo2017'
                                    }
                                });

                                // setup email data with unicode symbols
                                let mailOptions = {
                                    from: "iMarket", // sender address
                                    to: email, // list of receivers
                                    subject: 'Welcome to iMarket!', // Subject line
                                    text: 'Hello ' + name + ', thank you for joining iMarket.', // plain text body
                                };

                                // send mail with defined transport object
                                transporter.sendMail(mailOptions, (error, info) => {
                                    if (error) {
                                        console.log("Error : " + error);
                                    }else{

                                        console.log(info);
                                        res.send(JSON.stringify({ "message" : "SUCCESS"}));
                                    }
                                });
                                
                            }

                        });
                    }
                }
            })
        }

    });

    app.get("/contact", function(req, res){

        var email = req.query.email.trim().toLowerCase();
        var name = req.query.name.trim();
        var lastn = req.query.lastn.trim();
        var message = req.query.message.trim();

        //Check if the email is taken
        if( name == "" || email == "" || lastn == "" || message == "" ){
            res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "EMPTY_F"}));
        }else if(!validateEmail(email)){
            res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "INV_EMAIL"}));
        }else{
                        // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'info@imarkett.com',
                    pass: 'iMarkettinfo2017'
                }
            });

            let text = 'Name : ' + name + ' ' + lastn + '\n';
            text += 'Email : ' + email + '\n';
            text += 'Message : ' + message + '\n';

            // setup email data with unicode symbols
            let mailOptions = {
                from: "info@imarkett.com", // sender address
                to: "abel@imarkett.com", // list of receivers
                subject: 'Message from user', // Subject line
                text: text, // plain text body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Error : " + error);
                }else{
                    res.send(JSON.stringify({ "message" : "SUCCESS"}));
                }
            });
        }

    });

    app.get("/", function(req, res){
        res.sendFile(path.join(rootDir + '/index.html'));
    });
    app.get("/about", function(req, res){
        res.sendFile(path.join(rootDir + '/about.html'));
    });

    app.get("/faq", function(req, res){
        res.sendFile(path.join(rootDir + '/faq.html'));
    });

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
};
