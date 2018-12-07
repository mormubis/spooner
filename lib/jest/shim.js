// React 16 depends on requestAnimationFrame (even in test environments).
// Origin of this fix: github.com/facebook/jest/issues/4545#issuecomment-332762365
global.requestAnimationFrame = callback => {
  setTimeout(callback, 0);
};
