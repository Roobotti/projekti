import { TextInput as NativeTextInput, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  errorInput: {
    borderColor: 'black',
    
  },
});

const TextInput = ({ style, error, ...props }) => {
  const textInputStyle = [style, error && styles.errorInput];
  textInputStyle.b

  return <NativeTextInput style={textInputStyle} {...props} />;
};

export default TextInput;