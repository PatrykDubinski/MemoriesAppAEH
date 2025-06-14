import React, { JSX } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/styles/theme';
import Button from './Button';

interface ErrorDisplayProps {
  message: string | null;
  onRetry?: () => void;
}

const ErrorDisplay = ({ message, onRetry }: ErrorDisplayProps): JSX.Element | null => {
  const theme = useAppTheme();

  if (!message) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.error + '20'}]}>
      <Text style={[styles.messageText, { color: theme.colors.error }]}>
        Error: {message}
      </Text>
      {onRetry && (
        <Button title="Try again" onPress={onRetry} variant="danger" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default ErrorDisplay;