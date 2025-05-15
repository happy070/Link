// Importing TextInputProps from 'react-native' to extend its properties for custom text input component.

import { TextInputProps } from "react-native";

/*
  This interface extends the TextInputProps from 'react-native' to define additional props required for a custom text input component.
  It includes properties such as placeholder text and width, which are specific to the custom text input component.
*/
export interface CustomTextInputProps extends TextInputProps {
  placeholder: string; // Placeholder text for the input field
  width: number | string; // Width of the input field
  isEditable?: boolean;
}
