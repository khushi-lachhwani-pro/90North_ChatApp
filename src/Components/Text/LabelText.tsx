import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  useColorScheme,
} from 'react-native';

function LabelText({
  text,
  styleProps,
  labelProps,
}: {
  text: string;
  styleProps?: StyleProp<TextStyle> | undefined;
  labelProps?: TextProps;
}) {
  const theme = useColorScheme(); // 'light' or 'dark'

  // Conditionally set styles based on the current theme
  const dynamicStyles = theme === 'dark' ? styles.dark : styles.light;

  return (
    <Text style={[styles.label, dynamicStyles, styleProps]} {...labelProps}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    // flex: 1,
    // letterSpacing: 1,
    padding: 7,
    fontSize: 14,
    lineHeight: 15,
    // fontFamily: 'Poppins_400Regular',
  },
  light: {
    color: 'black',
  },
  dark: {
    color: '#5C6BC0',
  },
});

export default LabelText;
