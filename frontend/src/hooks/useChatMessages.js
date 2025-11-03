import { useState } from 'react';

const useChatMessages = (initialMessages = []) => {
  const [messages, setMessages] = useState(initialMessages);

  const addMessage = (message) => {
    // Ensure text is always a string, not an object
    const sanitizedMessage = {
      ...message,
      text: typeof message.text === 'string' ? message.text : JSON.stringify(message.text),
      id: messages.length + 1,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, sanitizedMessage]);
  };

  const addUserMessage = (text) => {
    const textString = typeof text === 'string' ? text : String(text);
    addMessage({ type: 'user', text: textString });
  };

  const addAssistantMessage = (text, chartConfig = null) => {
    const textString = typeof text === 'string' ? text : String(text);
    addMessage({ type: 'assistant', text: textString, chartConfig });
  };

  return { messages, addMessage, addUserMessage, addAssistantMessage };
};

export default useChatMessages;