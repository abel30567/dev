import React from 'react';
import Form from './form.jsx';
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
               return NotificationManager.success('', 'Congratulations!');
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
    
    register(data, that){
        
        if(data.name.trim() == "" || data.email.trim() == ""){
            that.createNotification('error', 'Please fill in the form.');
        }else if(!that.validateEmail(data.email)){
            that.createNotification('error', 'Invalid E-mail address.');
        }else{
              axios.get('http://localhost:3000/register', {
                params: {
                    name: data.name,
                    email: data.email
                }
              })
              .then(function (response) {
                if( response.data.message == "SUCCESS" ){
                    that.setState({showForm: false});
                    that.createNotification('success');
                }else{
                    switch(response.data.rson){
                        case 'EMAIL_TAKEN':
                            that.createNotification('error', 'You already registered!');
                        break;
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
                <div className="opacity-container"></div>
                <div className="row">
                    <div className="col-sm-6 white-text">
                        <h1>Welcome to iMarkett.</h1>
                        <h4>The internet's social marketplace</h4>
                        <p className="text">
                            <br />
                            Connect with your friends. Sell your items faster.<br />
                            Share products you love & earn cash with the tap of a button! <br />
                        </p>
                    </div>
                    <div className="col-md-6">
                        { this.state.showForm ? <Form onRegister={ (data)=> this.register(data, this) } /> : <Confirmation closeConf ={()=> { this.setState({showForm: true})}}/> }
                    </div>
                </div>
                <NotificationContainer/> 
             </div>;

  }

}

export default App;
 
