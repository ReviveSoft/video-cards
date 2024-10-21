
import { Button } from './button';
import { TextareaTronButtonProps } from '../../types';
import React from 'react';
import { Bot } from 'lucide-react';

const   TextareaTronButton: React.FC<TextareaTronButtonProps> = ({ btnConfig, loading }) => {
    const buttonText =btnConfig?.text || 'Enhance'
    if (btnConfig?.button_visible == false) {
        return null
    }
    if (loading == true) {
        return (
            <Button  disabled={true} 
                className={btnConfig?.style || "inline-flex items-center py-2 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"}>
                {!btnConfig?.icon ? <Bot className="animate-spin font-sm  p-[0.5px]" /> : <span className=" animate-spin font-sm  " > {btnConfig?.icon} </span>}
                {btnConfig?.text_visible && buttonText}
            </Button>
        )
    }
    return (
        <Button 
            className={btnConfig?.style || "inline-flex items-center py-2 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"}>
            {!btnConfig?.icon ? <Bot className=" font-sm  p-[0.5px]" /> : <span className="   font-sm  " > {btnConfig?.icon} </span>}
            {btnConfig?.text_visible && buttonText}
        </Button>
    )
}


export { TextareaTronButton }