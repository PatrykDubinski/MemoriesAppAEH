import { formatDate } from '@/utils/formatters';

describe('formatDate', () => {
  it('should format a valid ISO date string correctly', () => {
    const isoDate = '2023-10-27T10:30:00.000Z';
    const result = formatDate(isoDate);
    expect(result).toContain('2023');
    expect(result).toContain('paź');
  });

  it('should format a valid Date object correctly', () => {
    const dateObject = new Date(2024, 0, 15, 12, 0, 0);
    const result = formatDate(dateObject);
    expect(result).toBe('15 sty 2024, 12:00');
  });

  it('should return "Nieprawidłowa data" for an invalid date string', () => {
    const invalidDateString = 'this-is-not-a-date';
    expect(formatDate(invalidDateString)).toBe('Nieprawidłowa data');
  });

  it('should return "Nieprawidłowa data" for an invalid Date object', () => {
    const invalidDateObject = new Date('this-is-not-a-date');
    expect(formatDate(invalidDateObject)).toBe('Nieprawidłowa data');
  });
});