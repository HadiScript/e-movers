// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ImageBackground,
  Dimensions,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Logo from "@/components/home-screen/Logo";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();


  // this is the comment from my new laptop just checking its pushing from here or not
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0.95)).current;
  const [isPressed, setIsPressed] = useState(false);

  const [isCheckingUserData, setIsCheckingUserData] = useState(true);

  useEffect(() => {
    // Check if we have existing user data
    const checkUserData = async () => {
      try {
        // Start with checking animation
        setIsCheckingUserData(true);

        // Check if user data exists in AsyncStorage
        const userData = await AsyncStorage.getItem("userData");

        if (userData) {
          const parsedData = JSON.parse(userData);
          console.log(userData);
          // If we have a userId, navigate to tabs
          if (parsedData.userId) {
            // Navigate to tabs with a slight delay to allow animation
            setTimeout(() => {
              router.replace({
                pathname: "/(tabs)",
                // params: {
                //   userId: parsedData.userId,
                // },
              });
            }, 300);
            return;
          }
        }

        // If no user data, show the home screen
        setIsCheckingUserData(false);

        // Start entry animations
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }),
        ]).start();
      } catch (error) {
        console.error("Error checking user data:", error);
        setIsCheckingUserData(false);

        // Still show home screen on error
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }),
        ]).start();
      }
    };

    checkUserData();
  }, []);

  useEffect(() => {
    // Logo animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Button fade-in animation (delayed)
    Animated.timing(buttonFadeAnim, {
      toValue: 1,
      duration: 1000,
      delay: 800,
      useNativeDriver: true,
    }).start();

    // Button subtle bounce animation
    Animated.sequence([
      Animated.delay(1200),
      Animated.spring(buttonScaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(buttonScaleAnim, {
      toValue: 0.95,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(buttonScaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleGetStarted = () => {
    // Button press animation before navigation
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push("/phone");
    });
  };

  if (isCheckingUserData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#af1f23" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      {/* <Text>{JSON.stringify()}</Text> */}
      <ImageBackground
        source={require("../assets/images/get.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.75)", "rgba(0,0,0,0.85)"]}
          style={styles.overlay}
        >
          <Logo fadeAnim={fadeAnim} slideAnim={slideAnim} white={true}/>

          <View style={styles.contentContainer}>
            <Animated.View
              style={{
                opacity: buttonFadeAnim,
                transform: [
                  {
                    translateY: Animated.multiply(
                      Animated.subtract(1, buttonFadeAnim),
                      20
                    ),
                  },
                ],
              }}
            >
              <Text style={styles.welcomeText}>
                Welcome to Dubai's trusted moving partner
              </Text>

              <Text style={styles.descriptionText}>
                Reliable and efficient relocation services for local and
                international moves
              </Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.buttonContainer,
                {
                  opacity: buttonFadeAnim,
                  transform: [
                    { scale: buttonScaleAnim },
                    {
                      translateY: Animated.multiply(
                        Animated.subtract(1, buttonFadeAnim),
                        20
                      ),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                style={[styles.button, isPressed && styles.buttonPressed]}
                onPress={handleGetStarted}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
              >
                <Text style={styles.buttonText}>GET STARTED</Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="white"
                  style={styles.buttonIcon}
                />
              </TouchableOpacity>

              <Text style={styles.footnoteText}>
                Dubai's #1 Rated Moving Service
              </Text>
            </Animated.View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const { height, width } = Dimensions.get("window");
const isIOS = Platform.OS === "ios";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: isIOS ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: height * 0.08,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 24,
  },
  welcomeText: {
    fontSize: width < 380 ? 24 : 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 0.3,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  descriptionText: {
    fontSize: width < 380 ? 15 : 17,
    color: "#F0F0F0",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
    opacity: 0.9,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  button: {
    backgroundColor: "#af1f23",
    paddingVertical: 16,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  buttonPressed: {
    backgroundColor: "#941a1d",
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  footnoteText: {
    color: "#ddd",
    fontSize: 13,
    marginTop: 24,
    opacity: 0.8,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    alignContent: "center",
  },
});
