import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingsScreen from '@/screens/SettingsScreen';
import { AppProvider } from '@/contexts/AppContext'; // Potrzebny do motywu
import { NavigationContainer } from '@react-navigation/native'; // Potrzebny dla hooków nawigacji

// Mock dla useContext, aby kontrolować motyw i funkcję toggleTheme
const mockToggleTheme = jest.fn();
let mockCurrentTheme = 'light';

jest.mock('@/contexts/AppContext', () => {
  const originalModule = jest.requireActual('@/contexts/AppContext');
  return {
    ...originalModule,
    // AppContext musi być eksportowany, aby useContext działał
    AppContext: originalModule.AppContext, // Przekaż oryginalny kontekst
    // Możemy mockować AppProvider lub dostarczyć wartość przez wrapper
  };
});


// Wrapper, który dostarcza konteksty
const AllTheProviders: React.FC<{children: React.ReactNode, initialTheme?: 'light' | 'dark'}> = ({ children, initialTheme = 'light' }) => {
  // Jeśli chcemy kontrolować stan AppContext w teście
  const [theme, setTheme] = React.useState(initialTheme);
  const toggleTheme = () => {
    mockToggleTheme(); // Wywołaj globalny mock
    setTheme(t => t === 'light' ? 'dark' : 'light');
  };

  return (
    <NavigationContainer>
      <AppProvider>
          {/* Można by tu wstrzyknąć mockowaną wartość kontekstu, jeśli testujemy tylko SettingsScreen */}
          {/* <AppContext.Provider value={{ theme, toggleTheme, isThemeLoading: false }}> */}
            {children}
          {/* </AppContext.Provider> */}
      </AppProvider>
    </NavigationContainer>
  );
};


const renderSettingsScreen = (initialTheme?: 'light' | 'dark') => {
  return render(<SettingsScreen navigation={{} as any} route={{} as any} />, { wrapper: ({children}) => <AllTheProviders initialTheme={initialTheme}>{children}</AllTheProviders> });
};


describe('<SettingsScreen />', () => {
  beforeEach(() => {
    mockToggleTheme.mockClear();
    mockCurrentTheme = 'light'; // Resetuj motyw przed każdym testem
  });

  it('renders correctly', () => {
    const { getByText } = renderSettingsScreen();
    expect(getByText('Tryb Ciemny')).toBeTruthy();
    expect(getByText(/Wersja aplikacji:/)).toBeTruthy(); // Użyj regex dla częściowego dopasowania
  });

  it('toggles theme when switch is pressed', async () => {
    const { getByRole } = renderSettingsScreen('light');
    const themeSwitch = getByRole('switch'); // Znajdź Switch po jego roli

    expect(themeSwitch.props.value).toBe(false); // Początkowo jasny motyw (value=false)

    fireEvent(themeSwitch, 'valueChange', true); // Symuluj zmianę na true (ciemny motyw)
    // Tutaj jest problem, bo mockToggleTheme nie jest bezpośrednio połączony z `toggleTheme` z `AppContext` w tym setupie.
    // W `AllTheProviders` toggleTheme z `AppProvider` jest prawdziwe, a `mockToggleTheme` jest wołany osobno.
    // Aby to działało lepiej, musielibyśmy mockować `useContext(AppContext)` lub mieć pełną kontrolę nad `AppProvider` w teście.

    // Jeśli mockujemy useContext, test wyglądałby tak:
    // const mockContextValue = { theme: 'light', toggleTheme: mockToggleTheme, isThemeLoading: false };
    // jest.spyOn(React, 'useContext').mockReturnValue(mockContextValue);
    // fireEvent(themeSwitch, 'valueChange', true);
    // expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    // mockContextValue.theme = 'dark'; // Zmień stan mocka
    // rerender(<SettingsScreen navigation={{} as any} route={{} as any} />); // Przerenderuj
    // expect(themeSwitch.props.value).toBe(true);

    // Na razie, z obecnym setupem, możemy tylko sprawdzić, czy `mockToggleTheme` został zawołany przez lokalny `toggleTheme` w `AllTheProviders`
    // Trzeba by upewnić się, że `AppProvider` w `AllTheProviders` używa tego `mockToggleTheme`.
    // To jest ograniczenie tego podejścia.

    // Lepszym podejściem dla testowania kontekstu jest testowanie komponentu, który go używa,
    // i sprawdzanie efektów zmiany kontekstu, a nie bezpośrednio funkcji z kontekstu.
    // Tutaj, ponieważ SettingsScreen *używa* AppContext, testujemy interakcję.

    // Spróbujmy sprawdzić, czy `mockToggleTheme` (który jest wołany w `AllTheProviders`) został zawołany.
    // Jeśli `AppProvider` w `AllTheProviders` poprawnie wywołuje `toggleTheme` z własnego stanu,
    // a nasz `mockToggleTheme` jest wywoływany przez wrapper, to jest OK.
    // Ten test jest bardziej testem integracyjnym dla `SettingsScreen` i `AppProvider`.
    // Aby `mockToggleTheme` było faktycznie wywołane przez prawdziwy `toggleTheme` z `AppContext`,
    // musielibyśmy w `AppProvider` użyć `mockToggleTheme` zamiast wewnętrznego `toggleTheme`.
    // To jest złożone.

    // Najprościej: `AppProvider` jest częścią "środowiska" dla `SettingsScreen`.
    // Testujemy, czy interakcja ze Switchem zmienia jego stan (co pośrednio testuje `toggleTheme`).
    // Wymaga to, aby `AllTheProviders` poprawnie aktualizował stan `theme` przekazywany do `AppProvider`.

    // W aktualnym kodzie SettingsScreen używa useContext(AppContext) bezpośrednio.
    // Aby `mockToggleTheme` było zawołane, musimy zapewnić, że `AppContext.Provider` w `AllTheProviders`
    // dostarcza `toggleTheme`, które wywołuje `mockToggleTheme`.
    // W obecnym `AppProvider` `toggleTheme` jest wewnętrzną funkcją.

    // Poprawka: Zmodyfikujmy AllTheProviders, aby dostarczał kontrolowaną wartość kontekstu
  });

  // ... inne testy, np. sprawdzające tekst wersji aplikacji
});

// Zmodyfikowany AllTheProviders dla lepszej kontroli kontekstu w teście SettingsScreen
const TestSettingsProvider: React.FC<{children: React.ReactNode, initialTheme?: 'light' | 'dark'}> = ({ children, initialTheme = 'light' }) => {
  const [currentThemeState, setCurrentThemeState] = React.useState(initialTheme);

  const controlledToggleTheme = () => {
    mockToggleTheme(); // Wywołaj nasz mock
    setCurrentThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const contextValue = {
    theme: currentThemeState,
    toggleTheme: controlledToggleTheme,
    isThemeLoading: false,
  };

  return (
    <NavigationContainer>
      <AppContext.Provider value={contextValue}>
        {children}
      </AppContext.Provider>
    </NavigationContainer>
  );
};

const renderSettingsScreenWithControlledContext = (initialTheme?: 'light' | 'dark') => {
  return render(<SettingsScreen navigation={{} as any} route={{} as any} />, { wrapper: ({children}) => <TestSettingsProvider initialTheme={initialTheme}>{children}</TestSettingsProvider> });
};


describe('<SettingsScreen /> with controlled context', () => {
  beforeEach(() => {
    mockToggleTheme.mockClear();
  });

  it('Switch value reflects initial theme', () => {
    const { getByRole } = renderSettingsScreenWithControlledContext('dark');
    const themeSwitch = getByRole('switch');
    expect(themeSwitch.props.value).toBe(true); // Ciemny motyw (value=true)
  });

  it('calls mockToggleTheme and updates switch when pressed', () => {
    const { getByRole, rerender } = renderSettingsScreenWithControlledContext('light');
    let themeSwitch = getByRole('switch');
    expect(themeSwitch.props.value).toBe(false);

    fireEvent(themeSwitch, 'valueChange', true); // Użytkownik przełącza na "dark"

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);

    // Aby zobaczyć zmianę wartości Switcha, musimy przerenderować komponent z nową wartością kontekstu,
    // którą TestSettingsProvider sam sobie ustawił.
    // Rerender z tą samą instancją TestSettingsProvider powinien pokazać zaktualizowany stan.
    rerender(<SettingsScreen navigation={{} as any} route={{} as any} />);
    themeSwitch = getByRole('switch'); // Pobierz ponownie referencję do switcha
    expect(themeSwitch.props.value).toBe(true); // Switch powinien być teraz włączony

    fireEvent(themeSwitch, 'valueChange', false); // Użytkownik przełącza z powrotem na "light"
    expect(mockToggleTheme).toHaveBeenCalledTimes(2);
    rerender(<SettingsScreen navigation={{} as any} route={{} as any} />);
    themeSwitch = getByRole('switch');
    expect(themeSwitch.props.value).toBe(false);
  });
});