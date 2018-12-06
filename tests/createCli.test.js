import createCli from '../src/createCli';

describe('createCli', () => {
  it('should be a function', () => {
    expect(createCli).toBeInstanceOf(Function);
  });

  describe('when called with no arguments', () => {
    it('should not throw an error', async () => {
      expect(createCli).not.toThrowError();
    });

    describe('returned function', () => {
      let cli;
      beforeEach(() => {
        cli = createCli();
      });

      it('should be a function', () => {
        expect(cli).toBeInstanceOf(Function);
      });

      it('should not throw when called', async () => {
        await expect(cli()).resolves.toBeFalsy();
      });
    });
  });
});
