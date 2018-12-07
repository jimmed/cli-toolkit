export default {
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
