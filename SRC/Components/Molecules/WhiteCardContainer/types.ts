/**
 * Props for the WhiteCardContainer component.
 */
export interface WhiteCardContainerProps {
  /**
   * The content of the WhiteCardContainer.
   */
  children?: React.ReactNode;
  /**
   * CSS display property.
   */
  display?: string;
  /**
   * CSS flex-direction property.
   */
  flexDirection?: any;
  /**
   * CSS height property.
   */
  height?: string;
  /**
   * CSS margin-top property.
   */
  marginTop?: string;
  /**
   * CSS padding-top property.
   */
  padding?: string;
  /**
   * Text for the header.
   */
  header?: string;
  /**
   * CSS background-color property.
   */
  backgroundColor?: string;
  /**
   * CSS color property.
   */
  color?: string;
  /**
   * CSS position property.
   */
  position?: any;
  /**
   * CSS align-items property.
   */
  alignItems?: string;
  /**
   * CSS justify-content property.
   */
  justifyContent?: string;
  /**
   * Click event handler.
   */
  onClick?: () => void;
  /**
   * CSS grid-template-columns property.
   */
  gridTemplateColumns?: string;
  /**
   * CSS grid-template-rows property.
   */
  gridTemplateRows?: string;
  /**
   * CSS text-align property.
   */
  textAlign?: any;
  /**
   * CSS width property.
   */
  width?: any;
  /**
   * CSS font-weight property for the header.
   */
  headerFontWeight?: React.CSSProperties["fontWeight"];
  /**
   * CSS padding property for the header.
   */
  headerPadding?: React.CSSProperties["padding"];
  /**
   * CSS font-size property for the header.
   */
  headerFontSize?: React.CSSProperties["fontSize"];
  /**
   * CSS border-radious for card
   */
  borderRadius?: string;
  /**
   * CSS box-shadow for Card
   */
  boxShadow?: string;
  /**
  * CSS borderTop for Card
  */
  borderTop?: string;
  /**
  * CSS borderBottom for Card
  */
  borderBottom?: string;
  /**
  * CSS borderLeft for Card
  */
  borderLeft?: string;
  /**
  * CSS borderRight for Card
  */
  borderRight?: string;
  /**
  * CSS background for Card
  */
  background?: string;
  /**
   * CSS minWidth for Card
   */
  minWidth?: string;

  /**
 * CSS minWidth for Card
 */
  maxWidth?: string;
  /**
  * CSS margin for Card
  */
  margin?: string
  /**
* CSS overflow for Card
*/
  overflow?: string
  /**
* CSS border for Card
*/
  border?: string

  classNameForWhiteCardContainer?: string

  maxHeight?: string
}
