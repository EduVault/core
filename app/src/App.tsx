import './App.css';
import Login from './views/Login';

const App: React.FC = (props) => {
  return (
    <div className="App">
      <Login></Login>
      {props.children}
    </div>
  );
};

export default App;
