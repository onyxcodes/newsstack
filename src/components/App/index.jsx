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

import DbManager from "../../utils/dbManager";
import Class from "../../utils/dbManager/Class";
import Attribute from "../../utils/dbManager/Attribute";

const TestBed = () => {
  console.log(Class);
  console.log(Attribute)
  let testDbMg = new DbManager("testDb");
  var TestClass = new Class(testDbMg, "TestClass", "class");
  // Create attribute and adds it to above class
  var TestAttribute = new Attribute("TestAttribute", "string", { charLength: 100 });
  debugger;
  ( async () => {
    TestClass = await Class.build(TestClass);
    // add attribute to TestClass
    await TestClass.addAttribute(TestAttribute);
      // Should cause error since attribute with the same name was already added 
    let TestAttributeWithClass;
    try {
      TestAttributeWithClass = new Attribute("TestAttribute", "string", { charLength: 100 }, TestClass);
    } catch (e) {
      console.log("Error", e);
    }
    // Should auto add attribute to above class
    let TestAnotherAttrWithClass = new Attribute("TestAnotherAttr", "string", { charLength: 100, isArray: true }, TestClass);
    TestAnotherAttrWithClass = await Attribute.build(TestAnotherAttrWithClass)
  })();

  debugger;
  // dbManager specific tests
  // let testPreparedDoc = testDbMg.prepareDoc(null, "TestClass", )
  return (
    <div>
      <button>GO</button>
    </div>
  )
}

const FeedSearchWrapper = () => {
  return (
    <div>
      <FeedSearchBar />
      <FeedSearchResult />
      <TestBed />
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
          <Route exact path="/" element={<SignInWrapper />} />
          <Route path="/app" element={<Auth><FeedSearchWrapper /></Auth>} />
        </Routes>
      </Router>
    );
  }
}

export default connect(null, { fetchUser })(App);