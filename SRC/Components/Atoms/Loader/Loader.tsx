import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colorCode } from '../../../Utils/ColorValueAndCodeMapper';
import { LoaderStyles } from './LoaderStyles';

// Loader functional component to show a loading spinner
function Loader() {
  return (
    <View style={LoaderStyles.loaderContainer}>
      {/* ActivityIndicator to show the loading spinner */}
      <ActivityIndicator size="large" color={colorCode.DarkBlue} />
    </View>
  );
}

export default Loader;
