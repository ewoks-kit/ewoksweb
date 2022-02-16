import create from 'zustand';

import execution from './execution';

const state = create((set, get) => ({
  ...execution(set, get),
}));

export default state;
