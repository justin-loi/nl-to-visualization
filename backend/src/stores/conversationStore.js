class ConversationStore {
  static instance;

  constructor() {
    this.conversations = new Map();
    this.maxHistoryLength = parseInt('50');
  }

  static getInstance() {
    if (!ConversationStore.instance) {
      ConversationStore.instance = new ConversationStore();
    }
    return ConversationStore.instance;
  }

  get(sessionId) {
    return this.conversations.get(sessionId) || [];
  }

  getLastChart(sessionId) {
    const history = this.get(sessionId);
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].chartData) {
        return history[i].chartData;
      }
    }
    return null;
  }

  addMessage(sessionId, role, content, chartData) {
    let history = this.get(sessionId);
    history.push({ role, content, chartData });

    // Trim history if too long
    if (history.length > this.maxHistoryLength) {
      history = history.slice(-this.maxHistoryLength);
    }

    this.conversations.set(sessionId, history);
  }

  clear(sessionId) {
    this.conversations.delete(sessionId);
  }

  size() {
    return this.conversations.size;
  }
}

module.exports = { ConversationStore };