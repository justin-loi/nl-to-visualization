import { useState } from 'react';

const useChatMessages = (initialMessages = []) => {
  const [messages, setMessages] = useState(initialMessages);

  const addMessage = (message) => {
    setMessages(prev => [...prev, {
      ...message,
      id: prev.length + 1,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const addUserMessage = (text) => {
    addMessage({ type: 'user', text });
  };

  const addAssistantMessage = (text, chartConfig = null) => {
    addMessage({ type: 'assistant', text, chartConfig });
  };

  return { messages, addMessage, addUserMessage, addAssistantMessage };
};

export default useChatMessages;