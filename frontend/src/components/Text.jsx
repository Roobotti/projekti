import { Text as NativeText, StyleSheet } from 'react-native';

import theme from '../theme';

const styles = StyleSheet.create({
  text: {
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.main,
  },

  fontSizeSubheading: {
    fontSize: theme.fontSizes.subheading,
  },
  fontSizePrimeheading: {
    fontSize: theme.fontSizes.primeheading
  },

});

const Text = ({ fontSize, fontWeight, style, ...props }) => {
  const textStyle = [
    styles.text,
    fontSize === 'subheading' && styles.fontSizeSubheading,
    fontSize === 'primeheading' && styles.fontSizePrimeheading,
    style,
  ];

  return <NativeText style={textStyle} {...props} />;
};

export default Text;