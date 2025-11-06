import { render, screen, fireEvent } from '@testing-library/react';
import MessageBubble from './MessageBubble';

describe('MessageBubble', () => {
  const userMessage = {
    id: 1,
    type: 'user',
    text: 'Hello',
    timestamp: '10:00 AM'
  };

  const assistantMessageWithChart = {
    id: 2,
    type: 'assistant',
    text: 'Here is your chart',
    timestamp: '10:01 AM',
    chartConfig: { type: 'bar', option: {} }
  };

  test('renders user message', () => {
    render(<MessageBubble message={userMessage} onChartSelect={() => {}} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  test('shows chart chip for messages with charts', () => {
    render(<MessageBubble message={assistantMessageWithChart} onChartSelect={() => {}} />);
    expect(screen.getByText('View Chart')).toBeInTheDocument();
  });

  test('calls onChartSelect when chart chip is clicked', () => {
    const handleChartSelect = jest.fn();
    render(<MessageBubble message={assistantMessageWithChart} onChartSelect={handleChartSelect} />);
    
    fireEvent.click(screen.getByText('View Chart'));
    expect(handleChartSelect).toHaveBeenCalledWith(assistantMessageWithChart);
  });
});