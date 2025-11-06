import { downloadChartAsPNG, exportChartAsJSON } from './exportUtils';

describe('exportUtils', () => {
  beforeEach(() => {
    global.document.createElement = jest.fn(() => ({
      download: '',
      href: '',
      click: jest.fn()
    }));
  });

  describe('downloadChartAsPNG', () => {
    test('returns true on success', () => {
      const mockChart = {
        getDataURL: jest.fn(() => 'data:image/png;base64,mock')
      };
      expect(downloadChartAsPNG(mockChart)).toBe(true);
    });

    test('returns false when chartInstance is null', () => {
      expect(downloadChartAsPNG(null)).toBe(false);
    });
  });

  describe('exportChartAsJSON', () => {
    beforeEach(() => {
        // Mock browser APIs used in the function
        global.URL.createObjectURL = jest.fn(() => 'mock-url');
        global.URL.revokeObjectURL = jest.fn();
        
        // Mock <a> element and its methods
        const mockClick = jest.fn();
        document.createElement = jest.fn(() => ({
        click: mockClick,
        set href(value) { this._href = value; },
        get href() { return this._href; },
        set download(value) { this._download = value; },
        get download() { return this._download; },
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('returns true on success', () => {
        const chartConfig = { type: 'bar', option: {} };
        const result = exportChartAsJSON(chartConfig);
        
        expect(result).toBe(true);
        expect(global.URL.createObjectURL).toHaveBeenCalled();
        expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });

    test('returns false when chartConfig is missing', () => {
        expect(exportChartAsJSON(null)).toBe(false);
    });
  });
});