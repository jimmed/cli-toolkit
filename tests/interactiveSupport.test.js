import interactiveSupported from '../src/interactiveSupported';

const mockIsTTY = {
  mock(value) {
    if (this.mocked) {
      throw new Error(
        'mockIsTTY.mock may not be called again without calling mockIsTTY.reset first',
      );
    }
    this.oldValue = process.stdout.isTTY;
    process.stdout.isTTY = value;
    this.mocked = true;
  },
  reset() {
    if (!this.mocked) {
      throw new Error(
        'mockIsTTY.reset may not be called without first calling mockIsTTY.mock',
      );
    }
    process.stdout.isTTY = this.oldValue;
    delete this.oldValue;
    this.mocked = false;
  },
};

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
