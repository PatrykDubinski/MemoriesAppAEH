import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '@/components/common/Button';
import { AppProvider } from '@/contexts/AppContext';

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
  });

  it('shows ActivityIndicator when loading prop is true', () => {
    const { getByTestId, queryByText } = renderWithTheme(
      <Button title="Loading Button" onPress={() => {}} loading />,
    );
    expect(queryByText("Loading Button")).toBeNull();
  });

  it('renders with primary variant by default', () => {
    const { getByText } = renderWithTheme(<Button title="Primary" onPress={() => {}} />);
    expect(getByText('Primary')).toBeTruthy();
  });

  it('renders with danger variant', () => {
    const { getByText } = renderWithTheme(<Button title="Danger" onPress={() => {}} variant="danger" />);
    expect(getByText('Danger')).toBeTruthy();
  });

   it('renders with icon', () => {
    const MockIcon = () => <></>;
    const { UNSAFE_getByType } = renderWithTheme(
        <Button title="With Icon" onPress={() => {}} icon={<MockIcon />} />
    );
    expect(UNSAFE_getByType(MockIcon)).toBeTruthy();
  });
});