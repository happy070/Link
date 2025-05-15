// Import necessary modules from React and React Native
import React from 'react';
import {Text, TextStyle} from 'react-native';

// Importing TextProps type from './TypographyTypes' file
import {TextProps} from './TypographyTypes';

// Define a functional component named Typography which receives props of type TextProps
const Typography: React.FC<TextProps> = ({
  color,
  fontSize,
  lineHeight,
  fontWeight,
  width, // New width property
  style,
  children,
  onPress,
}) => {
  // Define a textStyle object to hold styles for the Text component
  const textStyle: TextStyle = {
    // Set the color of the text to the provided color or default to black
    color: color || "grey",
    // Set the font size to the provided font size or default to 14
    fontSize: fontSize || 14,
    // Set the line height to the provided line height or font size, or default to 20
    lineHeight: lineHeight || fontSize || 20,
    // Set the font weight to the provided font weight or default to 'normal'
    fontWeight: fontWeight || 'normal',
    // Set the width to the provided width or leave it undefined
    width: width,
  };

  // Return a Text component with the computed styles
  return (
    <Text onPress={onPress} style={[textStyle, style]}>
      {children}
    </Text>
  );
};

// Export the Typography component as the default export
export default Typography;
