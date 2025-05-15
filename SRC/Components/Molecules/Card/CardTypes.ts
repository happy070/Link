import {ViewStyle} from 'react-native';

export interface CardTypes {
  width?: number;
  height?: ViewStyle['height'];
  backgroundColor: string;
  borderRadius: number;
  justifyContent?: ViewStyle['justifyContent'];
  alignItems?: ViewStyle['alignItems'];
  style?: ViewStyle;
  marginRight?: ViewStyle['marginRight'];
  children?: React.ReactNode;
  padding?:ViewStyle['padding'];
}
