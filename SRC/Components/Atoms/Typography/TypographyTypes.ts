import {TextStyle, DimensionValue} from 'react-native';

export type FontWeight =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

export interface TextProps {
  color?: string;
  fontSize?: number;
  lineHeight?: number;
  fontWeight?: FontWeight;
  width?: DimensionValue; // Adjusted to DimensionValue for compatibility
  style?: TextStyle;
  children?: React.ReactNode;
  onPress?: () => void;
}
