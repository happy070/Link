import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Modal, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import Card from '../../Components/Molecules/Card/Card';
import Button from '../../Components/Atoms/Buttons/Button';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import CustomTextInput from '../../Components/Atoms/Inputs/CustomTextInput';
import Typography from '../../Components/Atoms/Typography/Typography';
import uuid from 'react-native-uuid';
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from '@react-navigation/native';

const Signup = () => {
    const [Name, setName] = useState("");
    const [Email, setEmail] = useState("");
    const [Mobile, setMobile] = useState("");
    const [Pin, setPin] = useState("");
    const [ConfirmPin, setConfirmPin] = useState("");
    const [modalVisible, setModalVisible] = useState(false);  // State for modal visibility
    const [loading, setLoading] = useState(false);  // State for loader visibility
    const [successMessage, setSuccessMessage] = useState("");  // State for success message
    const navigation = useNavigation();

    const Login = () =>{
        navigation.navigate("Login")
    }
    const Register = () => {
        // Validation checks
        if (!Name || !Email || !Mobile || !Pin || !ConfirmPin) {
            Alert.alert("Validation Error", "All fields are required.");
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(Email)) {
            Alert.alert("Validation Error", "Please enter a valid email address.");
            return;
        }

        if (Mobile.length !== 10 || isNaN(Mobile)) {
            Alert.alert("Validation Error", "Mobile number must be 10 digits.");
            return;
        }

        if (Pin !== ConfirmPin) {
            Alert.alert("Validation Error", "Passwords do not match.");
            return;
        }

        // Proceed with the registration
        const userId = uuid.v4();
        setModalVisible(true);  // Show the modal
        setLoading(true);  // Show loader

        firestore()
            .collection("users")
            .doc(userId)
            .set({
                Name: Name,
                Email: Email,
                Mobile: Mobile,
                Pin: Pin,
                userId: userId,
            })
            .then(() => {
                // Simulate a delay of 3 seconds before showing success message
                setTimeout(() => {
                    setLoading(false);  // Hide loader
                    setSuccessMessage("User registered successfully!");  // Set success message
                }, 3000);  // 3-second delay
            })
            .catch((error) => {
                setLoading(false);  // Hide loader
                setSuccessMessage("");  // Reset success message
                console.log("We got some error", error);
                Alert.alert("Error", "Something went wrong. Please try again.");
            });
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "black" }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: "black"
                }}
                keyboardShouldPersistTaps="handled"
            >
             <View style={{marginBottom:20,flexDirection:"column",alignSelf:"flex-start",paddingHorizontal:30}}>
                <View style={{flexDirection:"row"}}>
                <Typography color='white' fontSize={responsiveFontSize(2)} fontWeight='600' lineHeight={25} >Signup</Typography>
                <Text style={{lineHeight:25}}> 🔗</Text>
                </View>
                <Typography color='#FFA500' fontSize={responsiveFontSize(2)} fontWeight='600' lineHeight={25}>Let's Build Your Link Profile</Typography>
             </View>
                <Card
                    backgroundColor="white"
                    borderRadius={15}
                    alignItems="center"
                    height={responsiveHeight(60)}
                    width={responsiveWidth(90)}
                    style={{ marginBottom: 50 }}
                >
                    <View style={{ marginTop: 20 }}>
                        <Typography color="grey" fontSize={responsiveFontSize(2)} fontWeight="700" lineHeight={26}>
                            Name
                        </Typography>
                        <CustomTextInput placeholder="Enter Your Name" width={responsiveWidth(80)} onChangeText={(event) => { setName(event) }} />
                    </View>
                    <View style={{ marginTop: 0 }}>
                        <Typography color="grey" fontSize={responsiveFontSize(2)} fontWeight="700" lineHeight={26}>
                            Email
                        </Typography>
                        <CustomTextInput placeholder="Enter Your Email" width={responsiveWidth(80)} onChangeText={(event) => { setEmail(event) }} />
                    </View>
                    <View style={{ marginTop: 0 }}>
                        <Typography color="grey" fontSize={responsiveFontSize(2)} fontWeight="700" lineHeight={26}>
                            Mobile
                        </Typography>
                        <CustomTextInput inputMode='numeric' placeholder="Enter Your Mobile" width={responsiveWidth(80)} onChangeText={(event) => { setMobile(event) }} />
                    </View>
                    <View style={{ marginTop: 0 }}>
                        <Typography color="grey" fontSize={responsiveFontSize(2)} fontWeight="700" lineHeight={26}>
                            Pin
                        </Typography>
                        <CustomTextInput inputMode='numeric' placeholder="Enter Your Pin" width={responsiveWidth(80)} onChangeText={(event) => { setPin(event) }} />
                    </View>
                    <View style={{ marginTop: 0 }}>
                        <Typography color="grey" fontSize={responsiveFontSize(2)} fontWeight="700" lineHeight={26}>
                            Confirm Pin
                        </Typography>
                        <CustomTextInput inputMode='numeric' placeholder="Re-Enter Your Pin" width={responsiveWidth(80)} onChangeText={(event) => { setConfirmPin(event) }} />
                    </View>

                    <View>
                        <Typography color='black' fontSize={responsiveFontSize(2)} fontWeight='600' onPress={Login}>Already Have Account? Login</Typography>
                    </View>
                </Card>

                <Button
                    text={"Submit"}
                    backgroundColor="#FFA500"
                    height={responsiveHeight(6)}
                    width={responsiveWidth(50)}
                    onPress={Register}
                />

                {/* Success Modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)' // Background overlay
                    }}>
                        <View style={{
                            width: 250,
                            height: 250,
                            backgroundColor: 'white',
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 20
                        }}>
                            {loading ? (
                                <ActivityIndicator color={"red"} size={"large"} />
                            ) : (
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    color: '#333',
                                    textAlign: 'center'
                                }}>
                                    {successMessage || "Please wait..."}
                                </Text>
                            )}

                            {/* Close Button */}
                            {!loading && (
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalVisible(false)
                                        navigation.navigate("Login");
                                    }}
                                    style={{
                                        marginTop: 20,
                                        paddingVertical: 10,
                                        paddingHorizontal: 20,
                                        backgroundColor: '#FFA500',
                                        borderRadius: 5
                                    }}
                                >
                                    <Text style={{ color: 'white', fontSize: 16 }}>Login</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Signup;
