import { render, screen } from '@testing-library/react';
import AIInsights from './AIInsights';

describe('AIInsights', () => {
  test('renders insights when provided', () => {
    const insights = ['Sales increased by 40%', 'Peak on Thursday'];
    render(<AIInsights insights={insights} />);
    
    expect(screen.getByText('Sales increased by 40%')).toBeInTheDocument();
    expect(screen.getByText('Peak on Thursday')).toBeInTheDocument();
  });

  test('does not render when insights is empty', () => {
    const { container } = render(<AIInsights insights={[]} />);
    expect(container.firstChild).toBeNull();
  });
});