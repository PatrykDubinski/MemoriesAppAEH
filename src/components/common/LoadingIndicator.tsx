import React, { JSX } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAppTheme } from '@/styles/theme';

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  message?: string;
}

const LoadingIndicator = ({
  size = 'large',
  message,
}: LoadingIndicatorProps): JSX.Element => {
  const theme = useAppTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {message && (
        <Text style={[styles.messageText, { color: theme.colors.text }]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default LoadingIndicator;