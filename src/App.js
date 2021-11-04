import React, {useEffect} from 'react';
// import logo from './logo.svg';
import './App.css';
import {
  // BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";

import { getAuth, onAuthStateChanged } from "firebase/auth";

import ChatPage from './components/ChatPage/ChatPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';

import app from './firebase';

function App(props) {

  let history = useHistory();

  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, user => {
      // console.log('user', user);
      // 로그인이 된 상태
      if(user) {
        history.push("/"); // 채팅페이지
      } else {
        history.push("/login"); // 로그인페이지
      }
    })
  });

  return (
    // <Route>
      <Switch>
        <Route exact path="/" component={ChatPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
      </Switch>
    // </Router>
  );
}

export default App;
