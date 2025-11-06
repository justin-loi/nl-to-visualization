import { render, screen, fireEvent } from '@testing-library/react';
import QuickStartPrompts from './QuickStartPrompts';

describe('QuickStartPrompts', () => {
  test('renders prompt chips', () => {
    render(<QuickStartPrompts onPromptClick={() => {}} show />);
    expect(screen.getByText('Show me sales trends')).toBeInTheDocument();
  });

  test('calls onPromptClick with correct text', () => {
    const handleClick = jest.fn();
    render(<QuickStartPrompts onPromptClick={handleClick} show />);
    
    fireEvent.click(screen.getByText('Show me sales trends'));
    expect(handleClick).toHaveBeenCalledWith('Show me sales trends');
  });

  test('does not render when show is false', () => {
    render(<QuickStartPrompts onPromptClick={() => {}} show={false} />);
    expect(screen.queryByText('Show me sales trends')).not.toBeInTheDocument();
  });
});