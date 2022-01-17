import { FC } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
import { Login, NavBar, HomePage, AppHome } from './components/';
import { RequireAuth } from './components/Library/GuardedRoute';

const App: FC = (props) => {
  return (
    <>
      <NavBar />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route
            path="/app"
            element={
              <RequireAuth>
                <AppHome />
              </RequireAuth>
            }
          />
          <Route path={'/login'} element={<Login />} />
        </Routes>
      </Router>
      {props.children}
    </>
  );
};

export default App;
