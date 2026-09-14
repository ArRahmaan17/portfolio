import "@testing-library/jest-dom";

// Mock lenis ESM module for Jest
jest.mock("lenis", () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    destroy: jest.fn(),
    raf: jest.fn(),
  }));
});

// Reliable window.matchMedia mock for JSDOM that persists across test runs
window.matchMedia = function (query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: function () {},
    removeListener: function () {},
    addEventListener: function () {},
    removeEventListener: function () {},
    dispatchEvent: function () {
      return false;
    },
  };
};

// Mock window.scrollTo for JSDOM
window.scrollTo = function () {};

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = MockIntersectionObserver;
