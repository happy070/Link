import React from 'react';
import {View} from 'react-native';
import {CardTypes} from './CardTypes';
import CardStyles from './CardStyles';

const Card: React.FC<CardTypes> = ({
  width,
  height,
  backgroundColor,
  borderRadius,
  justifyContent,
  alignItems,
  style,
  children,
  marginRight,
  padding
}) => {
  return (
    <View
      style={[
        CardStyles.container, // Use imported styles here
        {
          width,
          height,
          backgroundColor,
          borderRadius,
          justifyContent,
          alignItems,
          marginRight,
         padding
        },
        style,
      ]}>
      {children}
    </View>
  );
};

export default Card;
