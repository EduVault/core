import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Login, NavBar, HomePage, AppHome } from './components/';

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
