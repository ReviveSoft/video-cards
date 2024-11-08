import React, { useEffect, useState, useCallback, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createParagraphNode, $createTextNode, $getRoot, $getSelection, $isRangeSelection, EditorState } from 'lexical';
import { ButtonConfigType, AgentTypes, EnhanceAPIPayloadType } from '../../types';
import { predictTextAction, enhanceAction } from '../../actions/inputronActions';
import { ComboTextAreaTronButton } from './combo-textarea-tron-button';
import { Wand, Edit3 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AgentConfig {
  name: string;
  actionType: AgentTypes;
  endpoint?: string;
  payloadConfig?: any;
  icon?: JSX.Element;
}

interface ComboTextAreaTronProps {
  value: string;
  setTextValue: (value: string | ((prevText: string) => string)) => void;
  agentsConfig: AgentConfig[];
  activeAgent: string;
  buttonConfiguration?: ButtonConfigType;
  displayMode?: 'replace' | 'suggest';
  viewOnly?: boolean;
  placeholderText?: string;
  triggerInterval?: number;
  suggestionConfig?: {
    suggestionLabel?: string;
    suggestionStyle?: React.CSSProperties;
    suggestionLabelStyle?: React.CSSProperties;
    buttonConfig?: {
      text?: string;
      visible?: boolean;
      style?: React.CSSProperties;
    };
  };
  textareaStyle?: React.CSSProperties;
  labelConfig?: {
    content: string;
    visible: boolean;
    style?: React.CSSProperties;
  };
  persistAgentSelection?: boolean;
}

const ComboTextAreaTron: React.FC<ComboTextAreaTronProps> = (props) => {
  const editorConfig = {
    namespace: "ComboTextAreaTron",
    onError: (error: Error) => {
      console.error("Lexical Editor Error:", error);
    },
    theme: {},
    editable: !props.viewOnly,
  };
  console.log("ComboTextAreaTron - Props on Init:", props);

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <InnerComboTextAreaTron {...props} />
    </LexicalComposer>
  );
};

const InnerComboTextAreaTron: React.FC<ComboTextAreaTronProps> = ({
  value,
  setTextValue,
  agentsConfig,
  activeAgent,
  buttonConfiguration = { text: "Predict", text_visible: true, button_visible: true, style: "bg-blue-500 text-white px-4 py-2 rounded" },
  displayMode = 'replace',
  viewOnly = false,
  placeholderText = 'Type here...',
  triggerInterval = 300,
  suggestionConfig = {
    suggestionLabel: 'Suggested Text:',
    suggestionStyle: {},
    suggestionLabelStyle: {},
    buttonConfig: { text: 'Apply', visible: true, style: {} },
  },
  textareaStyle = {},
  labelConfig = { content: "Text Area", visible: true, style: {} },
  persistAgentSelection = true,
}) => {
  const [editor] = useLexicalComposerContext();
  const [loading, setLoading] = useState(false);
  const [suggestedText, setSuggestedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentAgent, setCurrentAgent] = useState<AgentConfig | null>(agentsConfig.find(agent => agent.name === activeAgent) || null);
  const [selectedAgentName, setSelectedAgentName] = useState(activeAgent);
  const [ghostText, setGhostText] = useState<string | null>(null);
  const [buttonConfig, setButtonConfig] = useState<ButtonConfigType>(buttonConfiguration);
  const ghostTextRef = useRef<HTMLDivElement | null>(null);
  const contentEditableRef = useRef<HTMLDivElement | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null); // For debouncing
  //const lastTypedChar = useRef<string | null>(null);

  // Adjust ghost text positioning relative to ContentEditable
  useEffect(() => {
    if (contentEditableRef.current && ghostTextRef.current && ghostText) {
      const ghostTextEl = ghostTextRef.current;
      ghostTextEl.style.position = 'relative';
      ghostTextEl.style.width = `${contentEditableRef.current.clientWidth}px`; // Set width to match input
      ghostTextEl.style.textAlign = 'left'; // Center text within the ghost area if desired
    }
  }, [ghostText, value]);

  // Clear ghost text on any key press except Tab
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Tab' && ghostText && displayMode === 'replace') {
      event.preventDefault();
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const textNode = $createTextNode(ghostText);
          selection.insertNodes([textNode]);
          textNode.selectNext();
        }
      });
      setTextValue((prevText) => prevText + ghostText);
      setGhostText(null);
    } else if (event.key !== 'Tab') {
      // Clear ghost text on any key other than 'Tab'
      setGhostText(null);
    }
  }, [displayMode, ghostText, editor, setTextValue]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);


  useEffect(() => {
    setTextValue(value);
    console.log("useEffect - Initial Value Set:", value);
  }, [value, setTextValue]);


  // // Position ghost text at the end of the user's input content
  // useEffect(() => {
  //   if (contentEditableRef.current && ghostTextRef.current && ghostText) {
  //     const contentEditable = contentEditableRef.current;
  //     const ghostTextEl = ghostTextRef.current;
  //     const range = document.createRange();
  //     if (contentEditable.firstChild) {
  //       range.setStart(contentEditable.firstChild, contentEditable.firstChild.textContent?.length || 0);
  //       range.setEnd(contentEditable.firstChild, contentEditable.firstChild.textContent?.length || 0);
  //       const { x, y, height } = range.getBoundingClientRect();
  //       ghostTextEl.style.left = `${x}px`;
  //       ghostTextEl.style.top = `${y + height / 2}px`;
  //     }
  //   }
  // }, [ghostText, value]);


  // Use an effect to sync the buttonConfig based on currentAgent after component mounts
  useEffect(() => {
    if (currentAgent) {
      setButtonConfig({
        ...buttonConfiguration,
        text: currentAgent.actionType === AgentTypes.predict ? "Predict" : "Enhance",
        icon: currentAgent.actionType === AgentTypes.predict ? <Wand /> : <Edit3 />
      });
      console.log("useEffect - Initial buttonConfig set based on currentAgent:", currentAgent);
    }
  }, [currentAgent, buttonConfiguration]);

  useEffect(() => {
    if (!persistAgentSelection) {
      const agent = agentsConfig.find(agent => agent.name === activeAgent);
      setCurrentAgent(agent || null);
      setSelectedAgentName(activeAgent);
      console.log("useEffect - Agent updated based on activeAgent:", agent);
    }
  }, [activeAgent, agentsConfig, persistAgentSelection]);

  const handleAgentAction = useCallback(async () => {
    console.log("handleAgentAction - Action initiated with agent:", currentAgent);
    if (!currentAgent) {
      setError('No valid agent selected.');
      console.warn("handleAgentAction - No valid agent selected.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      let inputText = value || '';
      let data;
      let selectedText = '';

      // Check for a selected range if action is enhance
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) && !selection.isCollapsed()) {
          selectedText = selection.getTextContent();
        }
      });

      // Use selected text if available, otherwise use entire content
      inputText = selectedText || inputText;
      console.log("handleAgentAction - Text to process:", inputText);

      if (currentAgent.actionType === AgentTypes.predict) {
        console.log("handleAgentAction - Predict action triggered.");
        data = await predictTextAction({ text: inputText });
        console.log("handleAgentAction - Predict action response:", data);
        const message = data?.data?.message || '';
        if (displayMode === 'replace') {
          setGhostText(message);
          console.log("handleAgentAction - Predict action in replace mode. Message set:", message);
        } else {
          setSuggestedText(message);
          console.log("handleAgentAction - Predict action in suggest mode. Suggested text set:", message);
        }
      } else if (currentAgent.actionType === AgentTypes.enhance) {
        console.log("handleAgentAction - Enhance action triggered.");
        const enhancePayload: EnhanceAPIPayloadType = {
          inputText,
          user: 'currentUser',
          promptOverride: currentAgent.payloadConfig?.promptOverride,
          spiceitup: currentAgent.payloadConfig?.spiceitup || true,
          number_of_lines: currentAgent.payloadConfig?.number_of_lines || '3',
          metadata: currentAgent.payloadConfig?.metadata,
          useCachedResponse: currentAgent.payloadConfig?.useCachedResponse ?? true,
        };
        console.log("handleAgentAction - Enhance action payload:", enhancePayload);
        data = await enhanceAction(enhancePayload);
        console.log("handleAgentAction - Enhance action response:", data);

        const enhancedText = data?.data?.message || '';
        console.log("handleAgentAction - Enhanced text received:", enhancedText);

        if (displayMode === 'suggest') {
          setSuggestedText(enhancedText);
          console.log("handleAgentAction - Suggest mode, enhanced text set as suggestion.");
        } else {
          // Replace only selected text if it exists, else replace entire content
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection) && !selection.isCollapsed()) {
              selection.insertText(enhancedText);
              console.log("handleAgentAction - Enhanced selected text replaced.");
            } else {
              const root = $getRoot();
              root.clear();
              const paragraphNode = $createParagraphNode();
              const textNode = $createTextNode(enhancedText);
              paragraphNode.append(textNode);
              root.append(paragraphNode);
              textNode.selectEnd();
              console.log("handleAgentAction - Enhanced entire content replaced.");
            }
          });
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error connecting to server';
      setError(errorMessage);
      console.error("handleAgentAction - Error:", errorMessage);
    } finally {
      setLoading(false);
      console.log("handleAgentAction - Loading set to false");
    }
  }, [currentAgent, displayMode, setTextValue, value, editor]);

  const triggerPrediction = useCallback(async () => {
    if (currentAgent?.actionType === AgentTypes.predict) {
      console.log("Triggering prediction with text:", value);
      try {
        await handleAgentAction(); // Call predictive function
      } catch (error) {
        console.error("Prediction failed:", error);
      }
    }
  }, [currentAgent, handleAgentAction, value]);

  // const debouncedPredictAction = useCallback(() => {
  //   console.log("debouncedPredictAction - Called. Current agent actionType:", currentAgent?.actionType);
  //   if (currentAgent?.actionType === AgentTypes.predict) {
  //     if (debounceTimeout.current) {
  //       clearTimeout(debounceTimeout.current);
  //     }
  //     debounceTimeout.current = setTimeout(() => {
  //       console.log("debouncedPredictAction - Debounced handleAgentAction call initiated.");
  //       handleAgentAction();
  //     }, triggerInterval);
  //   }
  // }, [currentAgent, handleAgentAction, triggerInterval]);


  const debouncedPredictAction = useCallback(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      triggerPrediction();
    }, triggerInterval);
  }, [triggerPrediction, triggerInterval]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.key === ' ') {
      debouncedPredictAction();
    } else if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
  }, [debouncedPredictAction]);

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [handleKeyUp]);


  // // Debounced function to trigger prediction after user stops typing for `triggerInterval` ms
  // const debouncedPredictAction = useCallback(() => {
  //   if (debounceTimeout.current) {
  //     clearTimeout(debounceTimeout.current);
  //   }
  //   debounceTimeout.current = setTimeout(() => {
  //     triggerPrediction();
  //   }, triggerInterval);
  // }, [triggerPrediction, triggerInterval]);

  // // Keydown handler to manage debouncing on space and reset on new typing
  // const handleKeyUp = useCallback((event: KeyboardEvent) => {
  //   const typedChar = event.key;

  //   // Trigger debounced prediction only on space
  //   if (typedChar === ' ') {
  //     lastTypedChar.current = ' ';
  //     debouncedPredictAction();
  //   } else {
  //     // Cancel the debounce if other keys are pressed
  //     if (debounceTimeout.current) {
  //       clearTimeout(debounceTimeout.current);
  //     }
  //   }
  // }, [debouncedPredictAction]);

  // useEffect(() => {
  //   document.addEventListener('keyup', handleKeyUp);
  //   return () => {
  //     document.removeEventListener('keyup', handleKeyUp);
  //     if (debounceTimeout.current) {
  //       clearTimeout(debounceTimeout.current);
  //     }
  //   };
  // }, [handleKeyUp]);

  useEffect(() => {
    setTextValue(value);
    console.log("useEffect - Initial Value Set:", value);
  }, [value, setTextValue]);

  const applySuggestedText = useCallback(() => {
    console.log("applySuggestedText - Called with suggested text:", suggestedText);
    if (!suggestedText) return;

    editor.update(() => {
      const selection = $getSelection();
      console.log("applySuggestedText - Current selection:", selection);

      if (!selection || !$isRangeSelection(selection)) {
        console.warn("applySuggestedText - Invalid or non-range selection. Aborting text insertion.");
        return;
      }

      if (currentAgent?.actionType === AgentTypes.predict) {
        if (!selection.isCollapsed()) {
          selection.insertText(suggestedText);
          console.log("applySuggestedText - Predict agent, replaced selected text.");
        } else {
          const textNode = $createTextNode(suggestedText);
          selection.insertNodes([textNode]);
          textNode.selectNext();
          console.log("applySuggestedText - Predict agent, inserted text at cursor.");
        }
      } else if (currentAgent?.actionType === AgentTypes.enhance) {
        const root = $getRoot();
        if (!selection.isCollapsed()) {
          selection.insertText(suggestedText);
          console.log("applySuggestedText - Enhance agent, replaced selected text.");
        } else {
          root.clear();
          console.log("Cleared root content.");

          // Create a new ParagraphNode
          const paragraphNode = $createParagraphNode();

          // Create a new TextNode with the suggested text
          const textNode = $createTextNode(suggestedText);
          console.log("Created new text node with suggested text.");

          // Append the TextNode to the ParagraphNode
          paragraphNode.append(textNode);

          // Append the ParagraphNode to the root
          root.append(paragraphNode);
          console.log("Appended paragraph node to root.");

          // Move the selection cursor to the end of the newly added text node
          textNode.selectEnd();
          console.log("Moved selection to the end of the new text node.");
        }
      }
    });

    setSuggestedText(null);
    console.log("applySuggestedText - Suggested text cleared after applying.");
  }, [editor, suggestedText, currentAgent]);

  const handleAgentSelect = (agentName: string) => {
    const agent = agentsConfig.find(agent => agent.name === agentName);
    console.log("handleAgentSelect - Called with agentName:", agentName);

    if (agent) {
      setCurrentAgent(agent);
      setSelectedAgentName(agentName);
      console.log("handleAgentSelect - Current agent updated to:", agent);

      // Dynamically update the button configuration based on agent action type
      setButtonConfig({
        ...buttonConfig,
        text: agent.actionType === AgentTypes.predict ? 'Predict' : 'Enhance',
        icon: agent.actionType === AgentTypes.predict ? <Wand /> : <Edit3 />
      });

      setSuggestedText(null);
      console.log("handleAgentSelect - Button configuration updated based on agent:", buttonConfig);
    }
  };

  // const onChange = (editorState: EditorState) => {
  //   editorState.read(() => {
  //     const text = $getRoot().getTextContent();
  //     setTextValue(text);
  //     console.log("onChange - Editor text updated to:", text);
  //   });
  // };

  return (
    <div className={cn('combo-textarea-tron-wrapper bg-gray-100 p-4 rounded-lg', viewOnly && 'view-only')} style={textareaStyle}>
      {labelConfig.visible && (
        <label className="block mb-2 font-semibold text-lg text-gray-700" style={labelConfig.style}>
          {labelConfig.content}
        </label>
      )}

      <div className="editor-wrapper" style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {/* ContentEditable for user input */}
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="content-editable p-2 text-lg border border-gray-300 rounded-md"
              style={textareaStyle ? { ...textareaStyle } : undefined}
              ref={contentEditableRef}
            />
          }
          placeholder={<div className="placeholder text-gray-500 italic">{placeholderText}</div>}
          ErrorBoundary={({ children }) => <>{children}</>}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={(editorState: EditorState) => {
          editorState.read(() => {
            const text = $getRoot().getTextContent();
            setTextValue(text);
          });
        }} />

        {/* Ghost text positioned below the editor */}
        {displayMode === 'replace' && ghostText && (
          <div
            ref={ghostTextRef}
            className="ghost-text-overlay"
            style={{
              color: 'rgba(0, 0, 0, 0.4)',
              fontSize: '1rem',
              padding: '4px',
              backgroundColor: '#f9f9f9',
              borderRadius: '4px',
              pointerEvents: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%', // Full width to align with the content
              marginTop: '8px', // Space between editor and ghost text
              textAlign: 'center',
            }}
          >
            <span>{ghostText}</span>
            <span className="tab-indicator" style={{
              padding: '2px 6px',
              backgroundColor: '#d0d0d0',
              borderRadius: '4px',
              color: '#555',
              fontSize: '0.8rem',
            }}>
              Tab
            </span>
          </div>
        )}

        {/* Agent buttons container */}
        <div className="agent-buttons flex items-center space-x-4 mt-4">
          {agentsConfig.map((agent) => (
            <button
              key={agent.name}
              onClick={() => handleAgentSelect(agent.name)}
              className={`agent-icon-button p-2 rounded-full ${selectedAgentName === agent.name ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              title={agent.name}
            >
              {agent.icon || (agent.actionType === AgentTypes.predict ? <Wand className="h-6 w-6" /> : <Edit3 className="h-6 w-6" />)}
            </button>
          ))}
          {buttonConfiguration && (
            <ComboTextAreaTronButton
              btnConfig={buttonConfig}
              loading={loading}
              onClick={() => {
                console.log("ComboTextAreaTronButton - Button clicked. Loading:", loading, "Current Agent:", currentAgent);
                if (currentAgent?.actionType === AgentTypes.enhance) handleAgentAction();
              }}
            />
          )}
        </div>
      </div>

      {displayMode === 'suggest' && suggestedText && (
        <div className="suggestion-box bg-white shadow-md p-2 rounded-md mt-2" style={suggestionConfig.suggestionStyle}>
          <p style={suggestionConfig.suggestionLabelStyle} className="font-semibold text-gray-700">{suggestionConfig.suggestionLabel}:</p>
          <p className="text-gray-600">{suggestedText}</p>
          {suggestionConfig.buttonConfig?.visible && (
            <button
              style={suggestionConfig.buttonConfig.style}
              onClick={applySuggestedText}
              className="apply-btn mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              {suggestionConfig.buttonConfig.text || 'Apply'}
            </button>
          )}
        </div>
      )}

      {error && <div className="error-message text-red-500 mt-2">{error}</div>}


    </div>
  );
};

export { ComboTextAreaTron };

