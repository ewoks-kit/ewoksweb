import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import 'normalize.css';
import './styles/index.css';

import App from './App';
import ExecutedWorkflows from '../src/Components/Execution/ExecutedWorkflows';

ReactDOM.render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/edit-workflows" element={<Navigate to="/" replace />} />
        <Route path="/monitor-workflows" element={<ExecutedWorkflows />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
  document.querySelector('#root')
);
