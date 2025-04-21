// Import Jest DOM extensions
import '@testing-library/jest-dom';

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
    this.mockIsIntersecting = true;
  }

  observe(element) {
    this.elements.add(element);
    this.callback([
      {
        isIntersecting: this.mockIsIntersecting,
        target: element,
        intersectionRatio: 1,
      },
    ]);
  }

  unobserve(element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }

  // Helper for tests
  mockAllElementsAsIntersecting(isIntersecting) {
    this.mockIsIntersecting = isIntersecting;
    this.elements.forEach((element) => {
      this.callback([
        {
          isIntersecting,
          target: element,
          intersectionRatio: isIntersecting ? 1 : 0,
        },
      ]);
    });
  }
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock ResizeObserver
class MockResizeObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
  }

  observe(element) {
    this.elements.add(element);
  }

  unobserve(element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }
}

global.ResizeObserver = MockResizeObserver;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollTo
window.scrollTo = jest.fn();

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    key: jest.fn(index => {
      return Object.keys(store)[index] || null;
    }),
    get length() {
      return Object.keys(store).length;
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
});

// Mock console.error to fail tests on React warnings
const originalConsoleError = console.error;
console.error = (...args) => {
  // Check if this is a React-specific warning
  const message = args.join(' ');
  if (
    /Warning.*not wrapped in act/.test(message) ||
    /Warning.*Cannot update a component/.test(message) ||
    /Warning.*Can't perform a React state update/.test(message)
  ) {
    throw new Error(message);
  }
  originalConsoleError(...args);
};
