import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// TODO: change to Browser router, deploy on another site.
import { HashRouter as Router } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import './index.css';
import App from './App';
import store from './app/store';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <Provider store={store}>
      {/* Use HashRouter only for GitHub Pages */}
      {/* <Router basename={process.env.PUBLIC_URL}> */}
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
