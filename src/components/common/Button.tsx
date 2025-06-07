import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { useAppTheme } from '@/styles/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  variant = 'primary',
  icon,
}) => {
  const theme = useAppTheme();

  const getButtonColors = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary,
          textColor: theme.dark ? theme.colors.text : '#FFFFFF',
        };
      case 'danger':
        return {
          backgroundColor: theme.colors.error,
          textColor: '#FFFFFF',
        };
      case 'primary':
      default:
        return {
          backgroundColor: theme.colors.primary,
          textColor: '#FFFFFF',
        };
    }
  };

  const { backgroundColor, textColor } = getButtonColors();

  const buttonDynamicStyle: ViewStyle = {
    backgroundColor: disabled || loading ? theme.colors.secondary : backgroundColor,
    opacity: disabled || loading ? 0.7 : 1,
  };

  const textDynamicStyle: TextStyle = {
    color: textColor,
  };

  return (
    <TouchableOpacity
      style={[styles.button, buttonDynamicStyle, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[styles.text, textDynamicStyle, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 5,
  },
});

export default Button;