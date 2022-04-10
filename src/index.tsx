import { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import 'normalize.css';
import './styles/index.css';

import App from './App';
// import { ReactFlowProvider } from 'react-flow-renderer';

ReactDOM.render(
  <StrictMode>
    {/* <ReactFlowProvider> */}
    <App />
    {/* </ReactFlowProvider> */}
  </StrictMode>,
  document.querySelector('#root')
);
