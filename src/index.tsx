import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import 'normalize.css';
import './styles/index.css';

import App from './App';
// import EwoksUiInfo from './Components/Frontpage/EwoksUiInfo';
// import ExecutionTable from './Components/Execution/ExecutionTable';

ReactDOM.render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {/* element={<EwoksUiInfo />} */}
        <Route path="/edit-workflows" element={<Navigate to="/" replace />} />
        {/* <Route path="/monitor-workflows" element={<ExecutionTable />} /> */}
      </Routes>
    </HashRouter>
  </StrictMode>,
  document.querySelector('#root')
);
