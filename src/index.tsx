import 'normalize.css';
import './styles/index.css';

import { createRoot } from 'react-dom/client';

import App from './App';
import { assertNonNull } from './utils/typeGuards';

const container = document.querySelector('#root');
assertNonNull(container);
const root = createRoot(container);
root.render(<App />);
