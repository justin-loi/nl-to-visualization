// __tests__/stores/conversationStore.test.js

const { ConversationStore } = require('../../../src/stores/conversationStore');

describe('ConversationStore', () => {
  let store;

  beforeEach(() => {
    // Reset the singleton instance before each test
    ConversationStore.instance = null;
    store = ConversationStore.getInstance();
  });

  afterEach(() => {
    // Clean up
    ConversationStore.instance = null;
  });

  test('should return singleton instance', () => {
    const instance1 = ConversationStore.getInstance();
    const instance2 = ConversationStore.getInstance();
    
    expect(instance1).toBe(instance2);
  });

  test('should return empty array for new session', () => {
    const history = store.get('new-session-123');
    
    expect(Array.isArray(history)).toBe(true);
    expect(history).toEqual([]);
    expect(history.length).toBe(0);
  });

  test('should add message to history', () => {
    store.addMessage('session1', 'user', 'Hello', null);
    
    const history = store.get('session1');
    
    expect(history.length).toBe(1);
    expect(history[0].role).toBe('user');
    expect(history[0].content).toBe('Hello');
    expect(history[0].chartData).toBeNull();
  });

  test('should add message with chart data', () => {
    const chartData = { 
      series: [{ type: 'bar', data: [1, 2, 3] }] 
    };
    
    store.addMessage('session1', 'assistant', 'Here is your chart', chartData);
    
    const history = store.get('session1');
    expect(history[0].chartData).toEqual(chartData);
  });

  test('should maintain message order', () => {
    store.addMessage('session1', 'user', 'First', null);
    store.addMessage('session1', 'assistant', 'Second', null);
    store.addMessage('session1', 'user', 'Third', null);
    
    const history = store.get('session1');
    
    expect(history.length).toBe(3);
    expect(history[0].content).toBe('First');
    expect(history[1].content).toBe('Second');
    expect(history[2].content).toBe('Third');
  });

  test('should return null for getLastChart when no history exists', () => {
    const chart = store.getLastChart('nonexistent-session');
    
    expect(chart).toBeNull();
  });

  test('should return null when no charts in history', () => {
    store.addMessage('session1', 'user', 'Hello', null);
    store.addMessage('session1', 'assistant', 'Hi', null);
    
    const chart = store.getLastChart('session1');
    
    expect(chart).toBeNull();
  });

  test('should return last chart data', () => {
    const chart1 = { series: [{ type: 'bar', data: [1, 2, 3] }] };
    const chart2 = { series: [{ type: 'line', data: [4, 5, 6] }] };
    
    store.addMessage('session1', 'assistant', 'First chart', chart1);
    store.addMessage('session1', 'user', 'Change it', null);
    store.addMessage('session1', 'assistant', 'Second chart', chart2);
    
    const lastChart = store.getLastChart('session1');
    
    expect(lastChart).toEqual(chart2);
  });

  test('should clear session history', () => {
    store.addMessage('session1', 'user', 'Hello', null);
    expect(store.get('session1').length).toBe(1);
    
    store.clear('session1');
    
    expect(store.get('session1').length).toBe(0);
  });

  test('should return correct size', () => {
    expect(store.size()).toBe(0);
    
    store.addMessage('session1', 'user', 'Hi', null);
    expect(store.size()).toBe(1);
    
    store.addMessage('session2', 'user', 'Hello', null);
    expect(store.size()).toBe(2);
  });

  test('should not affect other sessions when clearing one', () => {
    store.addMessage('session1', 'user', 'Message 1', null);
    store.addMessage('session2', 'user', 'Message 2', null);
    
    store.clear('session1');
    
    expect(store.get('session1').length).toBe(0);
    expect(store.get('session2').length).toBe(1);
  });
});