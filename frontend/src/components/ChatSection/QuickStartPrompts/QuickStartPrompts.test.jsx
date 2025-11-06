import { render, screen, fireEvent } from '@testing-library/react';
import QuickStartPrompts from './QuickStartPrompts';

describe('QuickStartPrompts', () => {
  test('renders prompt chips', () => {
    render(<QuickStartPrompts onPromptClick={() => {}} show />);
    expect(screen.getByText('Show monthly Tesla vehicle sales trends over the past year')).toBeInTheDocument();
  });

  test('calls onPromptClick with correct text', () => {
    const handleClick = jest.fn();
    render(<QuickStartPrompts onPromptClick={handleClick} show />);
    
    fireEvent.click(screen.getByText('Show monthly Tesla vehicle sales trends over the past year'));
    expect(handleClick).toHaveBeenCalledWith('Show monthly Tesla vehicle sales trends over the past year');
  });

  test('does not render when show is false', () => {
    render(<QuickStartPrompts onPromptClick={() => {}} show={false} />);
    expect(screen.queryByText('Show monthly Tesla vehicle sales trends over the past year')).not.toBeInTheDocument();
  });
});