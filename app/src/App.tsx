import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Login, NavBar, HomePage, AppHome } from './components/';
import { useSelector } from './model';
import { selectLoggedIn } from './model/auth';
import { GuardedRoute } from './components/Library/GuardedRoute';

const App: React.FC = (props) => {
  const loggedIn = useSelector(selectLoggedIn);
  return (
    <>
      <NavBar />
      <Router>
        <Switch>
          <Route path={['/login', '/app/login']} component={Login} />
          <GuardedRoute auth={loggedIn} path={['/']} component={AppHome} />
          <Route path={['/*', '/home']} component={HomePage} />
        </Switch>
      </Router>
      {props.children}
    </>
  );
};

export default App;
