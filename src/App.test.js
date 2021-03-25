import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
// TODO: change to Browser router, deploy on another site.
// import { BrowserRouter as Router } from "react-router-dom";
import { HashRouter as Router } from "react-router-dom";
import App from './App';
import store from './app/store';

test('renders learn react link', () => {
  render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  );
  const linkElement = screen.getByText(/Journals/i);
  expect(linkElement).toBeInTheDocument();
});
