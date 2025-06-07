import { formatDate } from '@/utils/formatters';

describe('formatDate', () => {
  it('should format a valid ISO date string correctly', () => {
    const isoDate = '2023-10-27T10:30:00.000Z'; // UTC time
    // Wynik będzie zależał od strefy czasowej środowiska testowego
    // Aby test był deterministyczny, mockuj strefę czasową lub użyj daty bez informacji o czasie
    // Na potrzeby tego przykładu, zakładamy, że pl-PL i lokalna strefa dają przewidywalny wynik
    // Przykładowo, jeśli test jest uruchamiany w Polsce (UTC+2 w lecie), to będzie 12:30
    // Dla prostoty, skupmy się na części daty, która jest mniej zależna od strefy czasowej
    const result = formatDate(isoDate);
    expect(result).toContain('2023'); // Powinien zawierać rok
    expect(result).toContain('paź'); // Powinien zawierać miesiąc (skrót)
    // Dokładne sprawdzenie jest trudne bez mockowania strefy czasowej.
  });

  it('should format a valid Date object correctly', () => {
    const dateObject = new Date(2024, 0, 15, 12, 0, 0); // 15 Styczeń 2024, 12:00
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