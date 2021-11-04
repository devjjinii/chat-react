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

import { useDispatch, useSelector } from 'react-redux';
import {
  setUser
} from './redux/actions/user_action';

function App(props) {

  let history = useHistory();
  let dispatch = useDispatch();
  const isLoading = useSelector(state => state.user.isLoading);

  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, user => {
      // console.log('user', user);
      if(user) {   // 로그인이 된 상태
        history.push("/"); // 채팅페이지
        dispatch(setUser(user))
      } else {
        history.push("/login"); // 로그인페이지
      }
    })
  },[]);

  if (isLoading) {
    return (
      <div>
        ...loading
      </div>
    )
  } else {
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
  
}

export default App;
