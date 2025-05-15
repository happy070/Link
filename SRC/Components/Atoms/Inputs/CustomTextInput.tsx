import React from 'react';
import { TextInput, StyleSheet, TextInputProps, StyleProp, TextStyle } from 'react-native';
import { CustomTextInputProps } from './TextInputTypes';

/**
 * CustomTextInput component is a styled TextInput for React Native.
 * It supports customization of width and secure text entry for password inputs.
 *
 * @param {string} placeholder - Placeholder text for the TextInput.
 * @param {number | string} width - Width of the TextInput.
 * @param {boolean} [secureTextEntry=false] - If true, the text input will hide the text inputted, useful for passwords.
 * @param {TextInputProps} rest - Other props that can be passed to TextInput.
 *
 * @returns {JSX.Element} - A styled TextInput component.
 */
const CustomTextInput: React.FC<CustomTextInputProps> = ({
  placeholder,
  width,
  secureTextEntry = false, // Default value for secureTextEntry
  isEditable = true, // Default value for isEditable
  ...rest
}) => {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={"grey"}
      style={[styles.input, { width: width as any }]}  // Dynamically apply width (number or string)
      secureTextEntry={secureTextEntry}  // Set secureTextEntry prop
      editable={isEditable}  // Set editable prop
      {...rest}
    />
  );
};

// StyleSheet for the component
const styles = StyleSheet.create({
  input: {
    height: 45,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'black',
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    color: '#000',
  },
});

export default CustomTextInput;
