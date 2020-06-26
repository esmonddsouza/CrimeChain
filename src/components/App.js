import React from 'react';
import { Router } from 'react-router-dom';
import Routes from './Routes/Routes';
import axios from 'axios'
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

function App(props) {

  axios.defaults.baseURL = 'http://127.0.0.1:8000/';

  return (
    <div className="App">
        <Router history={history}>
          <Routes />
        </Router>
    </div>
  );
}

export default App;