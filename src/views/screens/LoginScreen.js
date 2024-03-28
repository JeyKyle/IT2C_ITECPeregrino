import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

import Input from "../components/Input";
import Button from "../components/Button";
import Loader from "../components/Loader";
import logobull from "../../img/logo.png";

const LoginScreen = ({ navigation }) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const configureGoogleSignIn = async () => {
      await GoogleSignin.configure({
        webClientId: '390557849441-no23ciurb92pqo0jgsfflk16nb0nvtn5.apps.googleusercontent.com',
        prompt: 'select_account',
      });
      setInitializing(false);
    };

    configureGoogleSignIn();

    const unsubscribe = navigation.addListener('focus', () => {
      setUser(null);
    });

    return unsubscribe;
  }, [navigation]);

  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const { user } = await auth().signInWithCredential(googleCredential);
      setUser(user);
      SocialLoginSuccess(user);
    } catch (error) {
      console.log(error);
    }
  };

  const SocialLoginSuccess = async (user) => {
    navigation.navigate("HomeScreen");
    await AsyncStorage.setItem("UserLoggedInData", JSON.stringify({ user, loggedIn: true }));
  }

  const handleOnChange = (text, input) => {
    setInputs(prevState => ({ ...prevState, [input]: text }));
  };

  const handleError = (text, input) => {
    setErrors(prevState => ({ ...prevState, [input]: text }));
  };

  const validate = () => {
    if (!inputs.email) {
      setErrors(prevState => ({ ...prevState, email: "Email is required" }));
      return false;
    }
    if (!inputs.password) {
      setErrors(prevState => ({ ...prevState, password: "Password is required" }));
      return false;
    }
    return true;
  };

  const login = async () => {
    if (validate()) {
      setLoading(true);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Image style={styles.logo} source={logobull} />
        <Text style={styles.title}>Welcome to the Peregrino's Meat Shop</Text>
        <View style={styles.formContainer}>
          <Input
            label="Email Address"
            iconName="envelope"
            placeholder="Enter your Email Address"
            onChangeText={text => handleOnChange(text, "email")}
            onFocus={() => handleError(null, "email")}
            error={errors.email}
          />
          <Input
            label="Password"
            iconName="key"
            password
            placeholder="Enter your Password"
            onChangeText={text => handleOnChange(text, "password")}
            onFocus={() => handleError(null, "password")}
            error={errors.password}
          />
          {!user ? (
            <Button title="Login" onPress={login} />
          ) : null}
          {!user ? (
            <TouchableOpacity style={styles.googleButton} onPress={onGoogleButtonPress}>
              <View style={styles.googleButtonContent}>
                <Image
                  source={{uri: 'https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-suite-everything-you-need-know-about-google-newest-0.png'}}
                  style={styles.googleLogo}
                />
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
              </View>
            </TouchableOpacity>
          ) : null}
          {!user ? (
            <Text style={styles.registerText} onPress={() => navigation.navigate("RegistrationScreen")}>
              Don't have an account? Register
            </Text>
          ) : null}
        </View>
      </ScrollView>
      <Loader visible={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  googleButton: {
    height: 55,
    width: "100%",
    backgroundColor: "black",
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerText: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    fontWeight: "bold",
    marginTop: 20,
  },
});

export default LoginScreen;