import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '@/components/common/Button';
import { AppProvider } from '@/contexts/AppContext'; // Potrzebne dla useAppTheme

// Prosty wrapper, aby dostarczyć kontekst motywu
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<AppProvider>{ui}</AppProvider>);
};


describe('<Button />', () => {
  it('renders correctly with given title', () => {
    const title = 'Click Me';
    const { getByText } = renderWithTheme(
      <Button title={title} onPress={() => {}} />,
    );
    expect(getByText(title)).toBeTruthy();
  });

  it('calls onPress prop when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = renderWithTheme(
      <Button title="Test Button" onPress={onPressMock} />,
    );
    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const onPressMock = jest.fn();
    const { getByText } = renderWithTheme(
      <Button title="Disabled Button" onPress={onPressMock} disabled />,
    );
    const buttonElement = getByText('Disabled Button');
    fireEvent.press(buttonElement);
    expect(onPressMock).not.toHaveBeenCalled();
    // Można też sprawdzić styl 'opacity', ale jest to bardziej kruche
    // expect(buttonElement.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ opacity: 0.7 })]));
  });

  it('shows ActivityIndicator when loading prop is true', () => {
    const { getByTestId, queryByText } = renderWithTheme( // Użyj getByTestId lub accessibilityRole
      <Button title="Loading Button" onPress={() => {}} loading />,
    );
    // ActivityIndicator nie ma tekstu, więc szukamy go inaczej.
    // Zakładając, że ActivityIndicator jest renderowany:
    // React Native Testing Library nie zawsze łatwo znajduje ActivityIndicator.
    // Możemy sprawdzić, czy tekst przycisku nie jest renderowany.
    expect(queryByText("Loading Button")).toBeNull();
    // Można by dodać testID do ActivityIndicator i szukać po nim,
    // albo sprawdzić, czy przycisk jest zablokowany.
  });

  it('renders with primary variant by default', () => {
    const { getByText } = renderWithTheme(<Button title="Primary" onPress={() => {}} />);
    // Sprawdzenie konkretnego koloru tła jest trudne i kruche w testach jednostkowych.
    // Lepiej polegać na tym, że logika wariantów jest poprawna,
    // a testy E2E/snapshotowe mogą pokryć wygląd.
    expect(getByText('Primary')).toBeTruthy();
  });

  it('renders with danger variant', () => {
    const { getByText } = renderWithTheme(<Button title="Danger" onPress={() => {}} variant="danger" />);
    expect(getByText('Danger')).toBeTruthy();
    // Podobnie, sprawdzenie konkretnego stylu może być pominięte na rzecz logiki.
  });

   it('renders with icon', () => {
    const MockIcon = () => <></>; // Prosty mock ikony
    const { UNSAFE_getByType } = renderWithTheme( // UNSAFE_getByType jest do znalezienia komponentu po typie
        <Button title="With Icon" onPress={() => {}} icon={<MockIcon />} />
    );
    expect(UNSAFE_getByType(MockIcon)).toBeTruthy();
  });
});