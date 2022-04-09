import React, { Component } from "react";
import { connect } from "react-redux";
import { Navigate } from 'react-router-dom';

class Auth extends Component {
    render(){
        const {authenticated} = this.props;
        return (
            // As of now navigate to root
            <div>
                { !authenticated && (
                    <Navigate to="/" replace={true} />
                )}
                {this.props.children}
            </div> 
        )
    }
}

function mapStateToProps(state) {
    return { authenticated: state.auth };
}

export default connect(mapStateToProps)(Auth);
