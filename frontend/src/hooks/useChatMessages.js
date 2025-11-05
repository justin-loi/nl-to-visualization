import { useState } from 'react';

const useChatMessages = (initialMessages = []) => {
  const [messages, setMessages] = useState(initialMessages);

  const addMessage = (message) => {
    const sanitizedMessage = {
      ...message,
      text: typeof message.text === 'string' ? message.text : JSON.stringify(message.text),
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, sanitizedMessage]);
    return sanitizedMessage.id;
  };

  const addUserMessage = (text) => {
    const textString = typeof text === 'string' ? text : String(text);
    return addMessage({ type: 'user', text: textString });
  };

  const addAssistantMessage = (text, chartConfig = null) => {
    const textString = typeof text === 'string' ? text : String(text);
    return addMessage({ type: 'assistant', text: textString, chartConfig });
  };

  const updateMessageText = (messageId, text, chartConfig = null, insights = [], followUpQuestions = []) => {
    setMessages(prev => {
      const updated = prev.map(msg => {
        if (msg.id === messageId) {
          const updatedMsg = { 
            ...msg, 
            text: typeof text === 'string' ? text : String(text),
            chartConfig: chartConfig !== undefined ? chartConfig : msg.chartConfig,
            insights: insights.length > 0 ? insights : (msg.insights || []),
            followUpQuestions: followUpQuestions.length > 0 ? followUpQuestions : (msg.followUpQuestions || [])
          };
          return updatedMsg;
        }
        return msg;
      });
      return updated;
    });
  };

  return { messages, addMessage, addUserMessage, addAssistantMessage, updateMessageText };
};

export default useChatMessages;