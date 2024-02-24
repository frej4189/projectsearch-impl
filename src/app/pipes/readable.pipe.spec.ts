import { ReadablePipe } from './readable.pipe';

describe('ReadablePipe', () => {
  it('create an instance', () => {
    const pipe = new ReadablePipe();
    expect(pipe).toBeTruthy();
  });

  it('should format cents to dollar display', () => {
    const pipe = new ReadablePipe();
    expect(pipe.transform(1234)).toBe('$12.34');
  });

  it('should format cents to dollar display with leading zero', () => {
    const pipe = new ReadablePipe();
    expect(pipe.transform(10)).toBe('$0.10');
  });

  it('should return N/A when price is not defined', () => {
    const pipe = new ReadablePipe();
    expect(pipe.transform(undefined)).toBe('N/A');
  });
});
