var bcrypt   = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var User = require('./models/user');

module.exports = {
    
    tokenizeUser : function(username){

        var sKey = "XS7DJ%DK2S$DN4SK&D1SJ";

        var token = jwt.sign({ username: username }, sKey); 

        return token;
    },
    
    updateAccount : function(token, username, email, business, school, relationship, token, req, res){
        
        var sKey = "XS7DJ%DK2S$DN4SK&D1SJ";
        
        jwt.verify(token, sKey, function(err, decode){
            if(err){
                res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "500"}));
            }else if(decode){
                //find user to update
                User.findOne({username: decode.username}, function(err, user){
                    if(err){
                        res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "500"}));
                    }else{
                        if(!user){
                            res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "INV_USER"}));
                        }else{
                            //Check if there is already a user with this username
                            if(user.username !== username){
                                User.findOne({username:username}, function(err, otherUser){
                                    if(err){
                                        res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "500"}));
                                    }else if(otherUser){
                                        res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "USERN_TAKEN"}));
                                    }else{
                                        //Check if the user wants to update the email along with the other info.
                                        if(user.email !== email){
                                            //Check if other user have the email
                                            User.findOne({email:email}, function(err, otherUser){
                                                if(err){
                                                    res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "500"}));
                                                }else if(otherUser){
                                                    res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "EMAIL_TAKEN"}));
                                                }else{
                                                    //Update info and send email to user
                                                    user.username = username;
                                                    user.email = email;
                                                    user.business = business;
                                                    user.school = school;
                                                    user.relationship = relationship;

                                                    user.save(function(err){
                                                        if(err){
                                                            res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "500"}));
                                                        }else{
                                                            //Send email
                                                            //=================================
                                                            //=================================
                                                            var token = jwt.sign({ username: username }, sKey); 
                                                            res.send(JSON.stringify({ "message" : "SUCCESS", 'token': token }));
                                                            
                                                        }
                                                    });
                                                }
                                            });
                                        }else{
                                            
                                            console.log('ff');
                                            
                                            user.username = username;
                                            user.business = business;
                                            user.school = school;
                                            user.relationship = relationship;

                                            user.save(function(err){
                                                if(err){
                                                    res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "500"}));
                                                }else{
                                                    //Send email
                                                    //=================================
                                                    //=================================
                                                    var token = jwt.sign({ username: username }, sKey); 
                                                    res.send(JSON.stringify({ "message" : "SUCCESS", 'token': token }));
                                                }
                                            });
                                        }
                                    }
                                });   
                            }else{
                                //The user doesnt want to update the username
                                //Check if the user wants to update the email along with the other info.
                                if(user.email !== email){
                                    //Check if other user have the email
                                    User.findOne({email:email}, function(err, otherUser){
                                        if(err){
                                            res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "500"}));
                                        }else if(otherUser){
                                            res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "EMAIL_TAKEN"}));
                                        }else{
                                            //Update info and send email to user
                                            user.username = username;
                                            user.email = email;
                                            user.business = business;
                                            user.school = school;
                                            user.relationship = relationship;

                                            user.save(function(err){
                                                if(err){
                                                    res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "500"}));
                                                }else{
                                                    //Send email
                                                    //=================================
                                                    //=================================
                                                    var token = jwt.sign({ username: username }, sKey); 
                                                    res.send(JSON.stringify({ "message" : "SUCCESS", 'token': token }));

                                                }
                                            });
                                        }
                                    });
                                }else{

                                    user.username = username;
                                    user.business = business;
                                    user.school = school;
                                    user.relationship = relationship;

                                    user.save(function(err){
                                        if(err){
                                            res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "500"}));
                                        }else{
                                            //Send email
                                            //=================================
                                            //=================================
                                            var token = jwt.sign({ username: username }, sKey); 
                                            res.send(JSON.stringify({ "message" : "SUCCESS", 'token': token }));
                                        }
                                    });
                                }
                            }
                        }
                    }
                });
            }
        });
    },
    
    changePassword : function (req, res){
        
        var sKey = "XS7DJ%DK2S$DN4SK&D1SJ";
        var token = req.body.token;
        
        //check the new password and the password confirm matches
        var newPass = req.body.currPassword;
        var newPass = req.body.newPassword;
        var newPassConfirm = req.body.newPasswordConfirm;
        
        jwt.verify(token, sKey, function(err, decode){
            if(err){
                res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "500"}));
            }else if(decode){
                if(newPass !== newPassConfirm){
                    res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "PASSW_DM"}));
                }else{
                    User.findOne({username:decode.username}, function(err, user){
                        if(err){
                            res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "500"}));
                        }else{
                            
                            user.password = user.generateHash(newPass);
                            user.save(function(err){
                                if(err){
                                    res.send(JSON.stringify({ "message" : "FAILURE", "rson" : "500"}));
                                }else{
                                    //Send email
                                    //=================================
                                    //=================================
                                    res.send(JSON.stringify({ "message" : "SUCCESS"}));
                                }
                            });
                        }
                    });
                }
            }
        });
    },


    getUsername : function (token){
        var sKey = "XS7DJ%DK2S$DN4SK&D1SJ";

        var decoded = jwt.verify(token, sKey);
        return decoded.username;
    }
    
    

};