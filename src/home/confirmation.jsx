import React from 'react';

class Confirmation extends React.Component {
    constructor(){
        super();
    }

    componentDidMount(){
        $("#body").append('<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>');
    }

    render() {
        return  <div className="conf-container">
                    <div className="header">
                        <button onClick = {()=>this.props.closeConf()} className="close-btn">X</button>
                        <div className="circle">
                            <span className="glyphicon glyphicon-ok"></span>
                        </div>
                    </div>
                    <div className="conf-row">
                        <h1>Thank you for registering!</h1>
                    </div>
                    <div className="conf-row">
                        <p>You will be the very first to be on iMarkett</p>
                    </div>
                    <div className="conf-row conf-button">
                        <a href="https://twitter.com/i_Markett" className="twitter-follow-button" data-show-count="false" data-size="large">Follow @i_Markett</a>
                    </div>
                </div>
    }

}

export default Confirmation;
