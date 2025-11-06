jest.mock('../../../src/stores/conversationStore');

const { healthCheck, root } = require('../../../src/controllers/healthController');
const { ConversationStore } = require('../../../src/stores/conversationStore');

describe('healthController', () => {
  let mockReq;
  let mockRes;
  let mockStoreInstance;

  beforeEach(() => {
    // Setup mock request and response
    mockReq = {};
    mockRes = {
      json: jest.fn()
    };

    // Setup mock store instance
    mockStoreInstance = {
      size: jest.fn().mockReturnValue(3)
    };

    // Mock getInstance to return our mock instance
    ConversationStore.getInstance = jest.fn().mockReturnValue(mockStoreInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('healthCheck', () => {
    test('should return ok status', () => {
      healthCheck(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalled();
      const response = mockRes.json.mock.calls[0][0];
      expect(response.status).toBe('ok');
    });

    test('should return conversation count', () => {
      healthCheck(mockReq, mockRes);

      expect(ConversationStore.getInstance).toHaveBeenCalled();
      expect(mockStoreInstance.size).toHaveBeenCalled();
      
      const response = mockRes.json.mock.calls[0][0];
      expect(response.conversations).toBe(3);
    });

    test('should include timestamp', () => {
      healthCheck(mockReq, mockRes);

      const response = mockRes.json.mock.calls[0][0];
      expect(response.timestamp).toBeDefined();
      expect(new Date(response.timestamp).toString()).not.toBe('Invalid Date');
    });

    test('should include uptime', () => {
      healthCheck(mockReq, mockRes);

      const response = mockRes.json.mock.calls[0][0];
      expect(response.uptime).toBeDefined();
      expect(typeof response.uptime).toBe('number');
      expect(response.uptime).toBeGreaterThanOrEqual(0);
    });

    test('should include memory usage', () => {
      healthCheck(mockReq, mockRes);

      const response = mockRes.json.mock.calls[0][0];
      expect(response.memory).toBeDefined();
      expect(response.memory.heapUsed).toBeDefined();
    });
  });

  describe('root', () => {
    test('should return running status', () => {
      root(mockReq, mockRes);

      const response = mockRes.json.mock.calls[0][0];
      expect(response.status).toBe('Backend running');
    });

    test('should include endpoints list', () => {
      root(mockReq, mockRes);

      const response = mockRes.json.mock.calls[0][0];
      expect(response.endpoints).toBeDefined();
      expect(Array.isArray(response.endpoints)).toBe(true);
      expect(response.endpoints.length).toBeGreaterThan(0);
    });

    test('should include timestamp', () => {
      root(mockReq, mockRes);

      const response = mockRes.json.mock.calls[0][0];
      expect(response.timestamp).toBeDefined();
    });

    test('should include version', () => {
      root(mockReq, mockRes);

      const response = mockRes.json.mock.calls[0][0];
      expect(response.version).toBeDefined();
    });
  });
});