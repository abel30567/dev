import React from 'react';
import ContactForm from './contactForm.jsx';
import Confirmation from './confirmation.jsx';
import {NotificationContainer, NotificationManager} from 'react-notifications';
var axios = require("axios");

class App extends React.Component {
    constructor(){
        super();
        this.state = { showForm : true }
    }

    createNotification(type, message = ""){

          switch (type) {
            case 'info':
               return NotificationManager.info('Info message');
              break;
            case 'success':
               return NotificationManager.success('', 'Thank you for contacting us, we will get back to you as soon as possible.!');
              break;
            case 'warning':
              return NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
              break;
            case 'error':
              return NotificationManager.error( message , 'OOPS!!');
              break;
          }

    }

    validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    contact(data, that){
        var name = data.name.trim();
        var lastn = data.lastn.trim();
        var email = data.email.trim();
        var message = data.message.trim();

        if(name == "" || email == "" || message == "" || lastn == ""){
            that.createNotification('error', 'Please fill in the form.');
        }else if(!that.validateEmail(email)){
            that.createNotification('error', 'Invalid E-mail address.');
        }else{
              axios.get('http://www.imarkett.com/contact-req', {
                params: {
                    name: name,
                    lastn: lastn,
                    email: email,
                    message: message
                }
              })
              .then(function (response) {
                if( response.data.message == "SUCCESS" ){
                    that.setState({showForm: false});
                    //that.createNotification('success');
                }else{
                    switch(response.data.rson){
                        case 'EMPTY_F':
                            that.createNotification('error', 'Please fill in the form.');
                        break;
                        case 'INV_EMAIL':
                            that.createNotification('error', 'Invalid E-mail address.');
                        break;
                    }
                }
              })
              .catch(function (error) {
                console.log(error);
              });
        }


    }

    render() {
        return <div className="main-container">
                <div className="contact-form-container">
                 { this.state.showForm ? <ContactForm onContact = { (data) => this.contact(data, this) }/> : <Confirmation closeConf ={()=> { this.setState({showForm: true})}}/> }
                </div>
                <NotificationContainer/>
             </div>;

  }

}

export default App;
