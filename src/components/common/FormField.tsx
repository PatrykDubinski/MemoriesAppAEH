import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useAppTheme } from '@/styles/theme';

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: object;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...rest
}) => {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.inputBackground,
            color: theme.colors.text,
            borderColor: error ? theme.colors.error : theme.colors.border,
          },
          style,
        ]}
        placeholderTextColor={theme.colors.placeholder}
        {...rest}
      />
      {error && <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 44,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default FormField;