import { renderHook, act } from '@testing-library/react';
import useChatMessages from './useChatMessages';

describe('useChatMessages', () => {
  test('should add user message', () => {
    const { result } = renderHook(() => useChatMessages());
    
    act(() => {
      result.current.addUserMessage('Test message');
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].type).toBe('user');
    expect(result.current.messages[0].text).toBe('Test message');
  });

  test('should add assistant message with chart', () => {
    const { result } = renderHook(() => useChatMessages());
    const chartConfig = { type: 'bar', option: {} };
    
    act(() => {
      result.current.addAssistantMessage('Response', chartConfig);
    });

    expect(result.current.messages[0].chartConfig).toEqual(chartConfig);
  });

  test('should update message text', () => {
    const { result } = renderHook(() => useChatMessages());
    let messageId;
    
    act(() => {
      messageId = result.current.addAssistantMessage('Initial');
    });

    act(() => {
      result.current.updateMessageText(messageId, 'Updated');
    });

    expect(result.current.messages[0].text).toBe('Updated');
  });
});