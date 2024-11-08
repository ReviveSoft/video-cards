import "./styles/tailwind.css";


import { TextareaTron } from "./components/textareatron";
import {SelecTron} from './components/select';
import TranslateTron from './components/translate/translatetron';
import {SuggesTron} from './components/suggest';
import {LabelTron}  from './components/label';
import  Predictron from './components/predict/predictron';
import { ComboTextAreaTron } from "./components/combotextareatron";
import { AgentConfig, AgentTypes, ButtonConfigType } from "./types";

export {
  TextareaTron,
  SelecTron,
  TranslateTron,
  SuggesTron,
  LabelTron,
  Predictron,
  ComboTextAreaTron,
  AgentTypes
};
  export type { ButtonConfigType, AgentConfig };

