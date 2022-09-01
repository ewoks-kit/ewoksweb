import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import 'normalize.css';
import './styles/index.css';

import App from './App';
// import SignUp from './layout/SignUp';
import EwoksUiInfo from './Components/EwoksUiInfo';
import ExecutionTable from './Components/ExecutionTable';

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EwoksUiInfo />} />
        <Route path="/edit-workflows" element={<App />} />
        <Route path="/monitor-workflows" element={<ExecutionTable />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
  document.querySelector('#root')
);
