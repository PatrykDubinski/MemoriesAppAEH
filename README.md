# MemoriesApp

Prosta aplikacja do zapisywania wspomnień stworzona w React Native (z Expo).

## Spis Treści

1.  [Opis Projektu](#opis-projektu)
2.  [Wymagania Projektowe i Ich Realizacja](#wymagania-projektowe-i-ich-realizacja)
3.  [Użyte Technologie](#użyte-technologie)
4.  [Funkcjonalności Aplikacji](#funkcjonalności-aplikacji)
5.  [Struktura Projektu](#struktura-projektu)
6.  [Uruchomienie Projektu](#uruchomienie-projektu)
7.  [Skrypty](#skrypty)
8.  [Testowanie](#testowanie)
9.  [Jakość Kodu](#jakość-kodu)
10. [Dokumentacja](#dokumentacja)
11. [Dalszy Rozwój](#dalszy-rozwój)

## Opis Projektu

`MemoriesApp` to aplikacja mobilna umożliwiająca tworzenie, przeglądanie, edycję i usuwanie wspomnień. Została zaprojektowana z myślą o pokazaniu dobrych praktyk w tworzeniu aplikacji React Native, w tym zarządzania stanem, nawigacji, responsywności, integracji z funkcjami natywnymi, testowania i bezpieczeństwa.

## Wymagania Projektowe i Ich Realizacja

Poniżej znajduje się lista 14 wymagań projektowych wraz z opisem ich realizacji w tej aplikacji:

1.  **Architektura aplikacji (Context API)**
    *   **Realizacja:** Aplikacja wykorzystuje React Context API do zarządzania globalnym stanem.
        *   `AppContext` (`src/contexts/AppContext.tsx`): Zarządza motywem aplikacji (jasny/ciemny) i jego trwałością w AsyncStorage.
        *   `NotesContext` (`src/contexts/NotesContext.tsx`): Zarządza stanem notatek (lista, ładowanie, błędy) oraz operacjami CRUD na notatkach, współpracując z `StorageService`.
    *   **Uzasadnienie:** Context API jest wbudowany w React, prostszy do zrozumienia dla tej skali projektu niż Redux. Idealny do współdzielenia stanu globalnego, który nie zmienia się nadmiernie często.

2.  **Obsługa różnych rozmiarów i orientacji ekranu**
    *   **Realizacja:**
        *   Użycie **Flexbox** do budowy layoutów responsywnych (np. w `HomeScreen`, `NoteScreen`).
        *   Stosowanie dynamicznych stylów w komponentach.
        *   Hook `useScreenDimensions` (`src/hooks/useResponsive.ts`) do potencjalnego dostosowywania UI w zależności od wymiarów ekranu
        *   Komponent `KeyboardAvoidingView` w `NoteScreen` dla lepszego UX przy wprowadzaniu tekstu.

3.  **Jakość kodu (ESLint, Prettier, TypeScript)**
    *   **Realizacja:**
        *   Projekt wykorzystuje **TypeScript** dla bezpieczeństwa typów i lepszej czytelności.
        *   Skonfigurowane narzędzia **ESLint** (`.eslintrc.js`) i **Prettier** (`.prettierrc.js`) do automatycznego formatowania i analizy statycznej kodu.
        *   Zdefiniowane skrypty `lint`, `lint:fix`, `format` w `package.json`.
        *   Struktura katalogów promująca modularność i czytelność.

4.  **Testy jednostkowe (Jest, React Native Testing Library)**
    *   **Realizacja:**
        *   Testy jednostkowe dla serwisów (np. `src/__tests__/services/StorageService.test.ts`) sprawdzające logikę operacji na danych.
        *   Testy komponentów (np. `src/__tests__/components/common/Button.test.ts`) weryfikujące renderowanie i interakcje.
        *   Przykładowe testy dla funkcji pomocniczych (`src/__tests__/utils/formatters.test.ts`).
        *   Konfiguracja Jest (`jest.config.js`, `jest.setup.ts`) z mockowaniem zależności (AsyncStorage, Location).
        *   Dążenie do wysokiego pokrycia testami (konfiguracja `collectCoverage` w `package.json`).

5.  **Dokumentacja kodu i projektu (JSDoc, README)**
    *   **Realizacja:**
        *   Ten plik `README.md` zawiera szczegółowy opis projektu.
        *   Komentarze JSDoc w kluczowych funkcjach i komponentach (np. w `src/utils/formatters.ts`, `src/services/*`).

6.  **Integracja z natywnymi funkcjami urządzenia**
    *   **Realizacja:**
        1.  **Lokalne przechowywanie danych (`@react-native-async-storage/async-storage`):**
            *   Używane do zapisywania notatek (`StorageService.ts`) oraz preferencji motywu (`AppContext.tsx`).
            *   Dane są dostępne offline.
        2.  **Geolokalizacja (`expo-location`):**
            *   Funkcja dodawania aktualnej lokalizacji do notatki w `NoteScreen.tsx` przy użyciu `LocationService.ts`.
            *   Obsługa prośby o uprawnienia.

7.  **Zarządzanie asynchronicznymi operacjami (async/await, Promises)**
    *   **Realizacja:**
        *   Szerokie użycie `async/await` do obsługi operacji asynchronicznych (np. w serwisach, kontekstach, ekranach przy zapisie/odczycie danych, pobieraniu lokalizacji).
        *   Obsługa stanu ładowania (`isLoading`, `isSaving`) w komponentach i kontekstach, aby informować użytkownika.
        *   Obsługa błędów za pomocą `try...catch`.

8.  **Nawigacja między ekranami (React Navigation)**
    *   **Realizacja:**
        *   Użycie biblioteki `React Navigation` (`@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs`).
        *   Zagnieżdżona nawigacja: `StackNavigator` jako główny nawigator, zawierający `BottomTabNavigator`.
        *   Ekrany: `HomeScreen` (lista notatek), `NoteScreen` (dodawanie/edycja), `SettingsScreen`.
        *   Przekazywanie parametrów do ekranów (np. `noteId` do `NoteScreen`).
        *   Dynamiczne ustawianie tytułów ekranów.
        *   Zdefiniowane typy dla nawigacji w `src/navigation/types.ts`.

9.  **Wydajność aplikacji**
    *   **Realizacja:**
        *   Użycie `FlatList` w `HomeScreen` do efektywnego renderowania listy notatek.
        *   `React.memo` (choć nieużyte jawnie w tej prostej aplikacji, jest to praktyka do rozważenia dla bardziej złożonych komponentów).
        *   `useCallback` w `NotesContext` i `HomeScreen` (dla `refreshNotes`) do memoizacji funkcji przekazywanych do zależności `useEffect` / `useFocusEffect`.
        *   `useMemo` w `AppContext` do memoizacji wartości kontekstu.
        *   Unikanie niepotrzebnych re-renderów poprzez odpowiednie zarządzanie stanem i propsami.
        *   Asynchroniczne ładowanie danych z informacją zwrotną dla użytkownika.

10. **Styl i UI/UX (Spójność, Motywy)**
    *   **Realizacja:**
        *   System motywów (jasny/ciemny) zarządzany przez `AppContext` i zaimplementowany w `src/styles/theme.ts`.
        *   Style komponentów definiowane za pomocą `StyleSheet.create` dla optymalizacji.
        *   Reużywalne komponenty UI (`Button`, `FormField`) zapewniające spójny wygląd.
        *   Dbałość o podstawowe zasady UX (np. informacja zwrotna przy akcjach, obsługa stanu ładowania, `KeyboardAvoidingView`).
        *   Użycie ikon z `@expo/vector-icons` dla lepszej wizualizacji.

11. **Obsługa stanu aplikacji (Context API)**
    *   **Realizacja:** Szczegółowo opisane w punkcie 1 (Architektura). `AppContext` i `NotesContext` centralizują zarządzanie kluczowymi częściami stanu aplikacji.

12. **Obsługa błędów i sytuacji wyjątkowych**
    *   **Realizacja:**
        *   Komponent `ErrorBoundary` (`src/components/common/ErrorBoundary.tsx`) owijający całą aplikację do łapania błędów renderowania.
        *   Obsługa błędów w operacjach asynchronicznych (`try...catch`) w serwisach i kontekstach.
        *   Wyświetlanie przyjaznych komunikatów o błędach użytkownikowi (np. `ErrorDisplay.tsx`, `Alert`).
        *   Mechanizm "Spróbuj ponownie" w `ErrorDisplay`.

13. **Tryb offline**
    *   **Realizacja:**
        *   Notatki i preferencje motywu są przechowywane lokalnie za pomocą `AsyncStorage`.
        *   Aplikacja jest w pełni funkcjonalna offline w zakresie przeglądania, tworzenia, edycji i usuwania notatek.
        *   **Synchronizacja:** W tej prostej aplikacji nie ma backendu, więc nie ma mechanizmu synchronizacji danych z serwerem. Wszystkie dane są tylko lokalne.

14. **Bezpieczeństwo**
    *   **Realizacja:**
        *   **Przechowywanie danych:** Wrażliwe dane (w tej aplikacji nie ma ich wiele, ale np. tokeny w bardziej złożonej) powinny być przechowywane za pomocą `expo-secure-store`. `AsyncStorage` jest używany do danych niewrażliwych.
        *   **Walidacja danych wejściowych:** Prosta walidacja po stronie klienta w `NoteScreen` (tytuł i treść nie mogą być puste). W aplikacji z backendem kluczowa jest walidacja serwerowa.
        *   **HTTPS:** W przypadku komunikacji z API, w tej aplikacji jest to tylko przykładowe placeholder API, należy używać HTTPS.
        *   **Uprawnienia:** Aplikacja prosi o uprawnienia do lokalizacji tylko wtedy, gdy użytkownik inicjuje akcję pobrania lokalizacji.

## Użyte Technologie

*   **React Native (Expo ~51)**: Framework do tworzenia aplikacji mobilnych.
*   **TypeScript**: Statyczne typowanie.
*   **React Context API**: Zarządzanie stanem globalnym.
*   **React Navigation (v6)**: Nawigacja.
*   **AsyncStorage**: Lokalne przechowywanie danych.
*   **Expo Location**: Dostęp do geolokalizacji.
*   **Jest & React Native Testing Library**: Testowanie.
*   **ESLint & Prettier**: Jakość i formatowanie kodu.
*   **UUID**: Generowanie unikalnych ID dla notatek.

## Funkcjonalności Aplikacji

*   Tworzenie, odczyt, aktualizacja i usuwanie notatek (CRUD).
*   Przechowywanie notatek lokalnie na urządzeniu.
*   Możliwość dodania informacji o lokalizacji do notatki.
*   Przełączanie motywu aplikacji (jasny/ciemny).
*   Responsywny interfejs użytkownika.
*   Obsługa błędów i informowanie użytkownika.
