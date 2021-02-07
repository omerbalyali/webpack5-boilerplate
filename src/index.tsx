import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './styles/styles.css';
import App from './containers/App/App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}
