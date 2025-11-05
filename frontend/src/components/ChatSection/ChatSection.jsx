import { Box } from '@mui/material';
import ChatHeader from './ChatHeader';
import QuickStartPrompts from './QuickStartPrompts';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatSection = ({ 
  messages, 
  inputValue, 
  onInputChange, 
  onSend, 
  onChartSelect,
  disabled = false,
  chatConfig = {},
  isLoading = false,
  onPromptClick,
  showQuickStart = true,
  streamingMessageId = null
}) => {
  return (
    <Box sx={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      borderRight: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper'
    }}>
      <ChatHeader 
        title={chatConfig.title}
        subtitle={chatConfig.subtitle}
        avatarIcon={chatConfig.avatarIcon}
      />
      <QuickStartPrompts 
        onPromptClick={onPromptClick}
        show={showQuickStart && messages.length === 0}
      />
      <MessageList 
        messages={messages} 
        onChartSelect={onChartSelect}
        isLoading={isLoading}
        streamingMessageId={streamingMessageId}
      />
      <ChatInput 
        value={inputValue} 
        onChange={onInputChange} 
        onSend={onSend}
        disabled={disabled}
      />
    </Box>
  );
};

export default ChatSection;