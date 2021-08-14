import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from './views/Login';
import NavBar from './components/NavBar';
import Home from './views/Home';

const App: React.FC = (props) => {
  return (
    <>
      <NavBar />
      <Router>
        <Switch>
          <Route path={['/', '/login']} exact component={Login} />
          <Route path="/home" component={Home} />
        </Switch>
      </Router>
      {props.children}
    </>
  );
};

export default App;
