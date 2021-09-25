import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import EduVault from '@eduvault/sdk-js/dist/main';

import './App.css';
import { Login, NavBar, HomePage, AppHome } from './components/';
import { checkLoginStatus } from './model/auth';
import { GuardedRoute } from './components/Library/GuardedRoute';
import { URL_API } from './config';
import { useDispatch } from './model';

const App: React.FC = (props) => {
  const dispatch = useDispatch();
  let loggedIn = useRef(false);
  useEffect(() => {
    const eduvault = new EduVault({ appID: '1', URL_API });
    const load = async () => await eduvault.load({});
    load();
    loggedIn.current = checkLoginStatus(eduvault, dispatch);
  }, [dispatch]);
  return (
    <>
      <NavBar />
      <Router>
        <Switch>
          <Route path={'/app/login'} component={Login} />
          <GuardedRoute
            auth={loggedIn.current}
            path={['/app/']}
            redirectTo={'app/login'}
            component={AppHome}
          />
          <Route path={['/*', '/home']} component={HomePage} />
        </Switch>
      </Router>
      {props.children}
    </>
  );
};

export default App;
