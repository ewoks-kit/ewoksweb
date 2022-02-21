import create from 'zustand';
import type { State } from '../types';

import execution from './execution';
import gettingFromServer from './gettingFromServer';
import undoRedo from './undoRedo';
import selectedElement from './selectedElement';
import workingGraph from './workingGraph';

const state = create<State>((set, get) => ({
  ...execution(set, get),
  ...gettingFromServer(set, get),
  ...undoRedo(set, get),
  ...selectedElement(set, get),
  ...workingGraph(set, get),
}));

export default state;
