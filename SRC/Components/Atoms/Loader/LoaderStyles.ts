import { StyleSheet } from "react-native";


export const LoaderStyles = StyleSheet.create({
    loaderContainer:{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.6)', // Lighter semi-transparent background
    }
})