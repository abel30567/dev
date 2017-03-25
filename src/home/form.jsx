import React from 'react';

class Form extends React.Component {
    constructor(){
        super();
    }
    
    render() {
        return  <div className="form-container">
                <div className="form-header">
                    <span className="glyphicon glyphicon-list-alt"></span>
                    <h1>REGISTER</h1>
                    <span className="glyphicon glyphicon-triangle-bottom"></span>
                </div>
                <div className="form">
                    <div className="form-group">
                        <span className="glyphicon glyphicon-user"></span>
                        <input type="text" placeholder="Name" id="name-input"/>
                    </div>
                    <div className="form-group">
                        <span className="glyphicon glyphicon-envelope"></span>
                        <input type="text" placeholder="Email" id="email-input"/>
                    </div>
                    <div className="form-group">
                        <button onClick = {()=> {
                                var name = document.getElementById("name-input").value;
                                var email = document.getElementById("email-input").value
                                this.props.onRegister( { name: name, email: email } ) } }>
                            SIGN UP
                        </button>
                    </div>
                </div>
            </div>;
    }

}

export default Form;
