import React from 'react';
import Svg, { Path } from 'react-native-svg';

const HomeIcon = ({ color = '#420260', width = 20, height = 20 }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
    >
      <Path
        d="M20 9.39006V16.1001C20 18.2501 18.32 20.0001 16.25 20.0001H12.5V15.2001C12.5 14.5601 11.98 14.0401 11.34 14.0401H8.66C8.02 14.0401 7.51 14.5601 7.51 15.2001V20.0001H3.75C1.68 20.0001 0 18.2501 0 16.1001V9.39006C0 8.24006 0.49 7.15006 1.33 6.40006L7.58 0.920059C8.99 -0.309941 11.02 -0.309941 12.42 0.920059L18.67 6.40006C19.52 7.15006 20 8.24006 20 9.39006Z"
        fill={color}
      />
    </Svg>
  );
};

export default HomeIcon;