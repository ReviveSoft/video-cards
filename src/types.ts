export interface TextareaTronButtonProps {
  btnConfig?: ButtonConfigType;
  loading?: boolean;
}

export type ButtonConfigType = {
  button_visible?: boolean;
  text_visible?: boolean;
  text?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.ReactElement<any>;
  style?: string;
  justify?: string;
};

export type AgentConfig = {
  name: string; // Unique identifier for the agent (e.g., "predict", "enhance")
  type: AgentTypes; // Agent type from the AgentTypes enum
  label?: string; // Optional label to describe the agent
  endpoint: (inputText: string) => Promise<any>; // Function that triggers the respective action
};

export type EnhanceResponseType = {
  data: {
    message: string;
  };

  error: string;
};

export type InpuTronProps = {
  id: string;
  type: "predict" | "suggest" | "select" | "enhance";
  onChange: (name: string, value: string) => void;
  textareaStyle?: string;
  placeHolder?: string;
  label?: string;
  prompt?: string;
  name: string;
  buttonConfiguration?: {
    text_visible?: boolean;
    text?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon?: any;
    style?: string;
  };
};

export type SuggestAPIPayloadType = {
  list: string;
};

export type EnhanceTextProps = {
  name: string;
  label?: string;
  placeHolder?: string;
  prompt?: string;
  onChange?: (key: string, value: string) => void;
  buttonConfiguration?: {
    text_visible?: boolean;
    text?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon?: any;
    style?: string;
  };
  textareaStyle?: string;
};

export type EnhanceAPIPayloadType = {
  inputText: string;
  user: string;
  promptOverride: string;
  spiceitup: boolean;
  number_of_lines: string;
  metadata?: {
    field_name?: string;
    action?: string;
  };
  useCachedResponse?: boolean
  
};

export type InvokeAPIPayloadType = {
  name: string;
  inputText: string;
  user: string;
  spiceitup: boolean;
  number_of_lines: string;
  metadata?: {
    field_name?: string;
    action?: string;
  };
  useCachedResponse?: boolean
};

export type PredictTextPayloadType = {
  text: string;
};


export type feedbackTextPayloadType = {
  text: string;
};


export type TranslateAPIPayloadType = {
  text:string;
  languages: string[]
}


export enum AgentTypes {
  analyze = "analyze",
  custom = "custom",
  enhance = "enhance",
  feedback = "feedback",
  predict = "predict",
  reason = "reason"
}

export interface CustomAgentMap {
  [name: string]: string;
}

export interface CustomAgentFieldMap {
  [clientId: string]: CustomAgentMap;
}