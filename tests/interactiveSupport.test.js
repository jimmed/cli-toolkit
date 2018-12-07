import interactiveSupported from '../src/interactiveSupported';
import mockIsTTY from './mocks/isTTY';

describe('interactiveSupported', () => {
  it('should be a function', () => {
    expect(interactiveSupported).toBeInstanceOf(Function);
  });

  describe('when process.stdout.isTTY is true', () => {
    beforeEach(() => mockIsTTY.mock(true));
    afterEach(() => mockIsTTY.reset());

    it('should return true', () => {
      expect(interactiveSupported()).toBe(true);
    });
  });

  describe('when process.stdout.isTTY is false', () => {
    beforeEach(() => mockIsTTY.mock(false));
    afterEach(() => mockIsTTY.reset());

    it('should return false', () => {
      expect(interactiveSupported()).toBe(false);
    });
  });
});
