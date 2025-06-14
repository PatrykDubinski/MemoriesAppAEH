import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Button from './Button';
import { lightColors, spacing, typography } from '@/styles/theme'

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleResetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong.</Text>
          <Text style={styles.message}>
            Try again later.
          </Text>
          {__DEV__ && this.state.error && (
            <ScrollView style={styles.detailsContainer}>
              <Text style={styles.detailsTitle}>Error Details (DEV):</Text>
              <Text style={styles.detailsText}>{this.state.error.toString()}</Text>
              {this.state.errorInfo && (
                <Text style={styles.detailsText}>
                  {this.state.errorInfo.componentStack}
                </Text>
              )}
            </ScrollView>
          )}
          <Button title="Try again" onPress={this.handleResetError} />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: lightColors.background,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: lightColors.error,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.fontSize.md,
    color: lightColors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  detailsContainer: {
    maxHeight: 200,
    marginVertical: spacing.md,
    padding: spacing.sm,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    width: '100%',
  },
  detailsTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: 'bold',
    color: lightColors.text,
    marginBottom: spacing.xs,
  },
  detailsText: {
    fontSize: typography.fontSize.xs,
    color: lightColors.text,
  },
});

export default ErrorBoundary;