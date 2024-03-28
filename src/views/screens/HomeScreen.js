import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../components/Button";
import auth from '@react-native-firebase/auth';

const HomeScreen = ({ navigation, route }) => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (route.params?.userData) {
      // If userData is available in the route params, set user details directly
      setUserDetails(route.params.userData);
    } else {
      // Fetch user details from AsyncStorage if not available in route params
      getUserData();
    }
  }, [route.params]);

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("UserLoggedInData");
      if (userData) {
        const user = JSON.parse(userData).user;
        setUserDetails(user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("UserLoggedInData");
      auth()
        .signOut()
        .then(() => {
          console.log('User signed out!');
          navigation.navigate("LoginScreen");
        })
        .catch((error) => console.error("Sign out error: ", error));
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {userDetails?.photoURL && (
        <Image style={styles.image} source={{ uri: userDetails?.photoURL }} />
      )}

      {userDetails ? (
        <>
          <Text style={styles.text}>Welcome {userDetails?.fullname || userDetails?.displayName} </Text>
          <Text style={styles.text}>Email: {userDetails?.email} </Text>
        </>
      ) : (
        <Text style={styles.text}>Loading user data...</Text>
      )}

      <Button title="Logout" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    fontSize: 20,
    color: "black",
  },
  image: {
    width: 250,
    height: 250,
    alignSelf: "center",
  },
});

export default HomeScreen;
