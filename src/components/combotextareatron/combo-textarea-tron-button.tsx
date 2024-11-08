import { Button } from '../textareatron/button';
import React from 'react';
import { Bot, Loader } from 'lucide-react';
import { ButtonConfigType } from '../../types';

interface ComboTextAreaTronButtonProps {
  btnConfig?: ButtonConfigType;
  loading?: boolean;
  showLoaderIcon?: boolean;
  onClick?: () => void;
}

const ComboTextAreaTronButton: React.FC<ComboTextAreaTronButtonProps> = ({
  btnConfig,
  loading,
  showLoaderIcon,
  onClick,
}) => {
  const buttonText = btnConfig?.text || 'Enhance';
  const buttonIcon = btnConfig?.icon || (btnConfig?.text === 'Predict' ? <Loader className="h-4 w-4" /> : <Bot className="h-4 w-4" />);

  if (!btnConfig?.button_visible) return null;

  return (
    <Button
      disabled={loading}
      className={`${btnConfig?.style || "btn-default"} ${loading ? "bg-gray-300" : "hover:bg-blue-600"} transition-colors duration-200`}
      onClick={onClick}
      aria-label={buttonText}
    >
      {/* Show loader or specific icon based on state */}
      {loading ? (
        <Loader className="animate-spin text-blue-600 h-4 w-4" />
      ) : showLoaderIcon ? (
        <Loader className="animate-spin text-blue-600 h-4 w-4" />
      ) : (
        buttonIcon
      )}

      {/* Display button text only if text_visible is true */}
      {btnConfig?.text_visible && <span className="ml-2">{buttonText}</span>}
    </Button>
  );
};

export { ComboTextAreaTronButton };
