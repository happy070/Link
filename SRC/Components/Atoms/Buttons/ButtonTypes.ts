import {StyleProp, ViewStyle} from 'react-native';
import {FunctionComponent} from 'react';
import {SvgProps} from 'react-native-svg';

/*
  This interface defines the props required for a button component in a React Native application.
  It includes properties such as onPress function, text content, height, width, background color,
  text color, and an optional style property for additional styling customization.
*/
export interface ButtonTypes {
  onPress?: () => void; // Function to be executed when the button is pressed
  text: any; // Text content of the button
  height: number; // Height of the button
  width: number; // Width of the button
  backgroundColor: string; // Background color of the button
  borderRadius?: string;
  textColor: string; // Text color of the button
  style?: StyleProp<ViewStyle>; // Optional additional style for the button
  svgIcon?: FunctionComponent<SvgProps>; // Optional SVG icon to display
  svgIconLeft?: FunctionComponent<SvgProps>;
}
