import React, { Component } from "react";
import logo from './logo.svg';
import './index.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Button } from 'antd';
import FeedSearchBar from '../Widgets/FeedSearchBar';
import FeedSearchResult from '../Widgets/FeedSearchResult';
import { connect } from "react-redux";
import { fetchUser } from "../../features/firebaseauth";
import Auth from "../Widgets/Authentication";
import SignIn from "../Views/SignIn";

const FeedSearchWrapper = () => {
  // NOTE: button is fake as of now
  return (
    <div>
      <FeedSearchBar/>
      <Button type="primary">Button</Button>
      <FeedSearchResult/>
    </div>
  )
}

const SignInWrapper = () => {
  return (
    <div><h3>Please authenticate</h3>
      <SignIn>

      </SignIn>
    </div>
  )
}

class App extends Component {

  render() {
    this.props.fetchUser();
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<SignInWrapper/>}/>
          <Route path="/app" element={<Auth><FeedSearchWrapper/></Auth>} />
        </Routes>
      </Router>
    );
  }
}

export default connect(null, { fetchUser })(App);