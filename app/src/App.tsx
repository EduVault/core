import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';
import { Login, NavBar, HomePage, AppHome } from './components/';
import { GuardedRoute } from './components/Library/GuardedRoute';
import { EduVaultContext } from './EduVaultContext';

const App: React.FC = (props) => {
  const {
    api: { checkAuth },
  } = useContext(EduVaultContext);

  return (
    <>
      <NavBar />
      <Router>
        <Switch>
          <Route path={'/app/login'} component={Login} />
          <GuardedRoute
            auth={checkAuth}
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
