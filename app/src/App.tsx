import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from './views/Login';
import NavBar from './components/NavBar';
import HomePage from './views/HomePage';
import AppHome from './views/AppHome';

const App: React.FC = (props) => {
  return (
    <>
      <NavBar />
      <Router>
        <Switch>
          <Route path={['/login', '/app/login']} component={Login} />
          <Route path="/app/*" component={AppHome} />
          <Route path={['/*', '/home']} component={HomePage} />
        </Switch>
      </Router>
      {props.children}
    </>
  );
};

export default App;
