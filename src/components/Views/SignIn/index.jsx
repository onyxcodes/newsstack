import "./index.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import {bindActionCreators} from 'redux';
import { signIn } from "../../../features/firebaseauth";
import { Navigate } from 'react-router-dom';

class SignIn extends Component {
  render() {
      const { signIn, auth } = this.props;
    return (
      <div className="row social-signin-container">
          {auth && (
          <Navigate to="/app" replace={true} />
        )}
        <button className="social-signin" onClick={() => signIn()}>
            {/* <Link to="/">Entra</Link> */}Entra con google
        </button>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
    // auth contain Firebase authentication result
    auth = !!auth;
    return { auth: auth };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({signIn}, dispatch);
}

// export default connect(mapStateToProps, { signIn })(SignIn);
// export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
export default connect(mapStateToProps, mapDispatchToProps)(SignIn);

