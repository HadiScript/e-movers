// // @ts-nocheck

// import React, { useState, useRef, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
//   Animated,
//   Dimensions,
//   StatusBar,
//   Keyboard,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";

// export default function PhoneScreen() {
//   const router = useRouter();
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [keyboardVisible, setKeyboardVisible] = useState(false);

//   // Animation values
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(30)).current;
//   const buttonScaleAnim = useRef(new Animated.Value(0.95)).current;
//   const [isButtonPressed, setIsButtonPressed] = useState(false);

//   const inputRef = useRef(null);

//   useEffect(() => {
//     // Entry animations
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 600,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 600,
//         useNativeDriver: true,
//       }),
//       Animated.spring(buttonScaleAnim, {
//         toValue: 1,
//         friction: 6,
//         tension: 40,
//         delay: 300,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Keyboard listeners
//     const keyboardDidShowListener = Keyboard.addListener(
//       "keyboardDidShow",
//       () => {
//         setKeyboardVisible(true);
//       }
//     );
//     const keyboardDidHideListener = Keyboard.addListener(
//       "keyboardDidHide",
//       () => {
//         setKeyboardVisible(false);
//       }
//     );

//     // Focus input automatically after a short delay
//     setTimeout(() => {
//       if (inputRef.current) {
//         inputRef.current.focus();
//       }
//     }, 500);

//     // Cleanup
//     return () => {
//       keyboardDidShowListener.remove();
//       keyboardDidHideListener.remove();
//     };
//   }, []);

//   const handleBack = () => {
//     // Exit animation then navigate back
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 200,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnim, {
//         toValue: 30,
//         duration: 200,
//         useNativeDriver: true,
//       }),
//     ]).start(() => {
//       router.back();
//     });
//   };

//   const validatePhoneNumber = (phone) => {
//     // Enhanced UAE phone validation
//     const phoneRegex = /^((\+971|0)?5[0-9]{8})$/;

//     // Clean phone number for validation (remove spaces, etc)
//     const cleanPhone = phone.replace(/\s+/g, "");

//     return phoneRegex.test(cleanPhone);
//   };

//   const formatPhoneInput = (text) => {
//     // Remove any non-numeric characters
//     const cleaned = text.replace(/[^0-9]/g, "");

//     // Auto-format with spaces for readability as user types
//     // Format: XX XXX XXXX
//     if (cleaned.length <= 2) {
//       return cleaned;
//     } else if (cleaned.length <= 5) {
//       return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
//     } else {
//       return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(
//         5,
//         9
//       )}`;
//     }
//   };

//   const handlePhoneChange = (text) => {
//     const formattedPhone = formatPhoneInput(text);
//     setPhoneNumber(formattedPhone);

//     // Clear error when user starts typing again
//     if (error) {
//       setError("");
//     }
//   };

//   const handleButtonPressIn = () => {
//     setIsButtonPressed(true);
//     Animated.spring(buttonScaleAnim, {
//       toValue: 0.95,
//       friction: 5,
//       tension: 40,
//       useNativeDriver: true,
//     }).start();
//   };

//   const handleButtonPressOut = () => {
//     setIsButtonPressed(false);
//     Animated.spring(buttonScaleAnim, {
//       toValue: 1,
//       friction: 5,
//       tension: 40,
//       useNativeDriver: true,
//     }).start();
//   };

//   const handleContinue = () => {
//     setError("");
//     Keyboard.dismiss();

//     // Clean phone number for validation
//     const cleanedPhone = phoneNumber.replace(/\s+/g, "");

//     if (!cleanedPhone) {
//       setError("Please enter your phone number");
//       shakeInput();
//       return;
//     }

//     if (!validatePhoneNumber(cleanedPhone)) {
//       setError("Please enter a valid UAE mobile number");
//       shakeInput();
//       return;
//     }

//     // Animate button press before API call
//     Animated.sequence([
//       Animated.timing(buttonScaleAnim, {
//         toValue: 0.9,
//         duration: 100,
//         useNativeDriver: true,
//       }),
//       Animated.timing(buttonScaleAnim, {
//         toValue: 0.95,
//         duration: 100,
//         useNativeDriver: true,
//       }),
//     ]).start(() => {
//       // Simulate API call to send OTP
//       setIsLoading(true);
//       setTimeout(() => {
//         setIsLoading(false);
//         // Navigate to OTP screen with the phone number
//         router.push({
//           pathname: "/(tabs)",
//           params: { phone: cleanedPhone },
//         });
//       }, 1500);
//     });
//   };

//   // Animation for error shake
//   const shakeAnimation = useRef(new Animated.Value(0)).current;

//   const shakeInput = () => {
//     shakeAnimation.setValue(0);
//     Animated.sequence([
//       Animated.timing(shakeAnimation, {
//         toValue: 10,
//         duration: 50,
//         useNativeDriver: true,
//       }),
//       Animated.timing(shakeAnimation, {
//         toValue: -10,
//         duration: 50,
//         useNativeDriver: true,
//       }),
//       Animated.timing(shakeAnimation, {
//         toValue: 10,
//         duration: 50,
//         useNativeDriver: true,
//       }),
//       Animated.timing(shakeAnimation, {
//         toValue: 0,
//         duration: 50,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//     >
//       <StatusBar barStyle="dark-content" />

//       <Animated.View
//         style={[
//           styles.header,
//           {
//             opacity: fadeAnim,
//             transform: [{ translateY: Animated.multiply(slideAnim, -1) }],
//           },
//         ]}
//       >
//         <TouchableOpacity
//           onPress={handleBack}
//           style={styles.backButton}
//           hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
//         >
//           <Ionicons name="arrow-back" size={24} color="#af1f23" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Enter Your Phone</Text>
//       </Animated.View>

//       <Animated.View
//         style={[
//           styles.content,
//           {
//             opacity: fadeAnim,
//             transform: [{ translateY: slideAnim }],
//           },
//         ]}
//       >
//         <Text style={styles.instructionText}>
//           We'll send a verification code to your phone number
//         </Text>

//         <Animated.View
//           style={[
//             styles.inputContainer,
//             { transform: [{ translateX: shakeAnimation }] },
//           ]}
//         >
//           <View style={styles.countryCodeContainer}>
//             <Text style={styles.countryCode}>+971</Text>
//           </View>
//           <TextInput
//             ref={inputRef}
//             style={styles.input}
//             placeholder="50 123 4567"
//             keyboardType="phone-pad"
//             value={phoneNumber}
//             onChangeText={handlePhoneChange}
//             maxLength={12} // Account for formatting spaces
//             placeholderTextColor="#aaa"
//           />
//         </Animated.View>

//         <Animated.View
//           style={{
//             opacity: error ? 1 : 0,
//             transform: [{ translateY: error ? 0 : -10 }],
//           }}
//         >
//           <Text style={styles.errorText}>
//             {error ? (
//               <Ionicons name="alert-circle" size={16} color="#af1f23" />
//             ) : null}{" "}
//             {error}
//           </Text>
//         </Animated.View>

//         <Animated.View
//           style={{
//             transform: [{ scale: buttonScaleAnim }],
//             opacity: fadeAnim,
//           }}
//         >
//           <TouchableOpacity
//             style={[
//               styles.continueButton,
//               (!phoneNumber || isLoading) && styles.disabledButton,
//               isButtonPressed &&
//                 !isLoading &&
//                 phoneNumber &&
//                 styles.buttonPressed,
//             ]}
//             onPress={handleContinue}
//             onPressIn={handleButtonPressIn}
//             onPressOut={handleButtonPressOut}
//             disabled={!phoneNumber || isLoading}
//             activeOpacity={0.9}
//           >
//             {isLoading ? (
//               <ActivityIndicator color="#fff" size="small" />
//             ) : (
//               <>
//                 <Text style={styles.continueButtonText}>CONTINUE</Text>
//                 <Ionicons
//                   name="arrow-forward"
//                   size={18}
//                   color="#fff"
//                   style={styles.buttonIcon}
//                 />
//               </>
//             )}
//           </TouchableOpacity>
//         </Animated.View>

//         {!keyboardVisible && (
//           <Animated.View style={{ opacity: fadeAnim }}>
//             <Text style={styles.securityNote}>
//               <Ionicons
//                 name="shield-checkmark-outline"
//                 size={14}
//                 color="#888"
//               />{" "}
//               Your information is secure and will not be shared
//             </Text>
//           </Animated.View>
//         )}
//       </Animated.View>
//     </KeyboardAvoidingView>
//   );
// }

// const { width, height } = Dimensions.get("window");
// const isIOS = Platform.OS === "ios";

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     // marginBottom: 20,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//     paddingTop: isIOS ? 60 : StatusBar.currentHeight + 20,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//     zIndex: 10,
//   },
//   backButton: {
//     padding: 8,
//     borderRadius: 20,
//     backgroundColor: "rgba(175, 31, 35, 0.08)",
//   },
//   headerTitle: {
//     flex: 1,
//     fontSize: 18,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginRight: 40,
//     color: "#333",
//     letterSpacing: 0.3,
//   },
//   content: {
//     flex: 1,
//     padding: 24,
//     paddingTop: 40,
//     justifyContent: "flex-start",
//   },
//   instructionText: {
//     fontSize: 16,
//     color: "#666",
//     marginBottom: 40,
//     textAlign: "center",
//     lineHeight: 22,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderBottomWidth: 2,
//     borderBottomColor: "#af1f23",
//     marginBottom: 20,
//     paddingBottom: 8,
//   },
//   countryCodeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingRight: 10,
//     borderRightWidth: 1,
//     borderRightColor: "#ddd",
//   },
//   countryCode: {
//     fontSize: 18,
//     fontWeight: "500",
//     color: "#333",
//     paddingHorizontal: 4,
//   },
//   input: {
//     flex: 1,
//     fontSize: 18,
//     color: "#333",
//     paddingLeft: 12,
//     paddingVertical: 8,
//   },
//   errorText: {
//     color: "#af1f23",
//     marginBottom: 20,
//     fontSize: 14,
//     alignItems: "center",
//     flexDirection: "row",
//     alignContent: "center",
//   },
//   continueButton: {
//     backgroundColor: "#af1f23",
//     padding: 16,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 20,
//     shadowColor: "#af1f23",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 6,
//     flexDirection: "row",
//     justifyContent: "center",
//   },
//   disabledButton: {
//     backgroundColor: "#d3a5a6",
//     shadowOpacity: 0.1,
//   },
//   buttonPressed: {
//     backgroundColor: "#941a1d",
//   },
//   continueButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//     letterSpacing: 0.5,
//   },
//   buttonIcon: {
//     marginLeft: 8,
//   },
//   securityNote: {
//     color: "#888",
//     fontSize: 12,
//     textAlign: "center",
//     marginTop: 40,
//     opacity: 0.8,
//   },
// });

// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Dimensions,
  StatusBar,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiService from "../config/ApiServices";
import PhoneInput from "react-native-phone-number-input"; // Add this package for international phone input

export default function PhoneScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    userId: "",
  });
  const [isLoading, setIsLoading] = useState(true); // Start with loading to check for userId
  const [errors, setErrors] = useState({});
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [currentFocus, setCurrentFocus] = useState(null);
  const [hasCheckedUserId, setHasCheckedUserId] = useState(false);

  // Phone input reference
  const phoneInput = useRef(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0.95)).current;
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  // Input refs for focus management
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);

  // Shake animations for error fields
  const shakeAnimations = {
    name: useRef(new Animated.Value(0)).current,
    email: useRef(new Animated.Value(0)).current,
    phone: useRef(new Animated.Value(0)).current,
  };

  useEffect(() => {
    // Check for userId in params or AsyncStorage
    const checkUserData = async () => {
      try {
        // Check if we have userId in params
        if (params.userId) {
          // User ID exists in params, redirect to booking form
          router.replace({
            pathname: "/booking",
            params: {
              userId: params.userId,
            },
          });
          return;
        }

        // Check if user data exists in AsyncStorage
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const parsedData = JSON.parse(userData);

          // If we have a userId, navigate to booking screen
          if (parsedData.userId) {
            router.replace({
              pathname: "/booking",
              params: {
                userId: parsedData.userId,
              },
            });
            return;
          }

          // Otherwise, pre-fill the form with existing data
          setFormData({
            name: parsedData.name || "",
            email: parsedData.email || "",
            phone: parsedData.phone || "",
            userId: parsedData.userId || "",
          });
        }

        setHasCheckedUserId(true);
        setIsLoading(false);

        // Entry animations
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.spring(buttonScaleAnim, {
            toValue: 1,
            friction: 6,
            tension: 40,
            delay: 300,
            useNativeDriver: true,
          }),
        ]).start();

        // Focus input automatically after a short delay
        setTimeout(() => {
          if (nameInputRef.current) {
            nameInputRef.current.focus();
          }
        }, 500);
      } catch (error) {
        console.error("Error retrieving user data:", error);
        setIsLoading(false);
        setHasCheckedUserId(true);
      }
    };

    checkUserData();

    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    // Cleanup
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleBack = () => {
    // Exit animation then navigate back
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 30,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.back();
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    // Simple validation for international phone numbers
    // Check if phone has at least 7 digits (most countries have at least this many digits)
    const digitsOnly = phone.replace(/\D/g, "");
    return digitsOnly.length >= 7;
  };

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Clear specific error when user starts typing again
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  const handleFocus = (field) => {
    setCurrentFocus(field);
  };

  const focusInput = (field) => {
    switch (field) {
      case "name":
        nameInputRef.current?.focus();
        break;
      case "email":
        emailInputRef.current?.focus();
        break;
      case "phone":
        phoneInput.current?.focus();
        break;
      default:
        break;
    }
  };

  const handleButtonPressIn = () => {
    setIsButtonPressed(true);
    Animated.spring(buttonScaleAnim, {
      toValue: 0.95,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    setIsButtonPressed(false);
    Animated.spring(buttonScaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const validateForm = () => {
    const newErrors = {};
    let hasError = false;

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name";
      shakeField("name");
      hasError = true;
    }

    // Validate email (now required)
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address";
      shakeField("email");
      hasError = true;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      shakeField("email");
      hasError = true;
    }

    // Validate phone
    if (!formData.phone) {
      newErrors.phone = "Please enter your phone number";
      shakeField("phone");
      hasError = true;
    } else if (!validatePhoneNumber(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
      shakeField("phone");
      hasError = true;
    }

    setErrors(newErrors);
    return !hasError;
  };

  const shakeField = (field) => {
    const animation = shakeAnimations[field];
    if (animation) {
      animation.setValue(0);
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleContinue = async () => {
    Keyboard.dismiss();

    // Validate the form
    if (!validateForm()) {
      return;
    }

    // Animate button press before API call
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      // Start loading
      setIsLoading(true);

      try {
        // Just use the formData.phone value directly since getNumber() isn't available
        const phoneNumber = formData.phone;

        // Call API to register or update user
        const response = await apiService.registerUser(
          formData.name,
          phoneNumber,
          formData.email // Email is now required
        );

        console.log(response.success);

        if (response.success) {
          // Save user data to AsyncStorage
          const userData = {
            name: formData.name,
            phone: phoneNumber,
            email: formData.email,
            userId: response.data._id, // Assuming the API returns a userId
          };

          await AsyncStorage.setItem("userData", JSON.stringify(userData));

          // Navigate to the booking screen
          router.replace({
            pathname: "/(tabs)",
            // params: {
            //   userId: response.data.userId,
            // },
          });
        } else {
          // Handle API error
          Alert.alert(
            "Error",
            response.message || "Something went wrong. Please try again."
          );
        }
      } catch (error) {
        // Handle network or other errors
        Alert.alert(
          "Connection Error",
          "Unable to connect to the server. Please check your internet connection and try again."
        );
        console.error("API error:", error);
      } finally {
        setIsLoading(false);
      }
    });
  };

  // Show loading indicator while checking userId
  if (isLoading && !hasCheckedUserId) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#af1f23" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />

      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: Animated.multiply(slideAnim, -1) }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Ionicons name="arrow-back" size={24} color="#af1f23" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Information</Text>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.instructionText}>
            Please provide your details to continue
          </Text>

          {/* Name Input */}
          <Text style={styles.inputLabel}>
            Full Name <Text style={styles.requiredStar}>*</Text>
          </Text>
          <Animated.View
            style={[
              styles.inputContainer,
              currentFocus === "name" && styles.focusedInput,
              errors.name && styles.errorInput,
              { transform: [{ translateX: shakeAnimations.name }] },
            ]}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <TextInput
              ref={nameInputRef}
              style={styles.input}
              placeholder="Enter your name"
              value={formData.name}
              onChangeText={(text) => handleChange("name", text)}
              onFocus={() => handleFocus("name")}
              onBlur={() => setCurrentFocus(null)}
              returnKeyType="next"
              onSubmitEditing={() => focusInput("email")}
              autoCapitalize="words"
            />
          </Animated.View>
          {errors.name && (
            <Text style={styles.errorText}>
              <Ionicons name="alert-circle" size={16} color="#af1f23" />{" "}
              {errors.name}
            </Text>
          )}

          {/* Email Input */}
          <Text style={styles.inputLabel}>
            Email <Text style={styles.requiredStar}>*</Text>
          </Text>
          <Animated.View
            style={[
              styles.inputContainer,
              currentFocus === "email" && styles.focusedInput,
              errors.email && styles.errorInput,
              { transform: [{ translateX: shakeAnimations.email }] },
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <TextInput
              ref={emailInputRef}
              style={styles.input}
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => handleChange("email", text)}
              onFocus={() => handleFocus("email")}
              onBlur={() => setCurrentFocus(null)}
              returnKeyType="next"
              onSubmitEditing={() => focusInput("phone")}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Animated.View>
          {errors.email && (
            <Text style={styles.errorText}>
              <Ionicons name="alert-circle" size={16} color="#af1f23" />{" "}
              {errors.email}
            </Text>
          )}

          {/* International Phone Input */}
          <Text style={styles.inputLabel}>
            Phone Number <Text style={styles.requiredStar}>*</Text>
          </Text>
          <Animated.View
            style={[
              styles.inputContainer,
              currentFocus === "phone" && styles.focusedInput,
              errors.phone && styles.errorInput,
              { transform: [{ translateX: shakeAnimations.phone }] },
            ]}
          >
            <PhoneInput
              ref={phoneInput}
              defaultValue={formData.phone}
              defaultCode="AE" // Default country code (can be changed)
              layout="first"
              onChangeFormattedText={(text) => handleChange("phone", text)}
              containerStyle={styles.phoneInputContainer}
              textContainerStyle={styles.phoneTextContainer}
              textInputStyle={styles.phoneTextInput}
              textInputProps={{
                onFocus: () => handleFocus("phone"),
                onBlur: () => setCurrentFocus(null),
                returnKeyType: "done",
                onSubmitEditing: () => Keyboard.dismiss(),
              }}
              withDarkTheme={false}
              withShadow={false}
              autoFocus={false}
            />
          </Animated.View>
          {errors.phone && (
            <Text style={styles.errorText}>
              <Ionicons name="alert-circle" size={16} color="#af1f23" />{" "}
              {errors.phone}
            </Text>
          )}

          <Animated.View
            style={{
              transform: [{ scale: buttonScaleAnim }],
              opacity: fadeAnim,
              marginTop: 30,
            }}
          >
            <TouchableOpacity
              style={[
                styles.continueButton,
                isLoading && styles.disabledButton,
                isButtonPressed && !isLoading && styles.buttonPressed,
              ]}
              onPress={handleContinue}
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
              disabled={isLoading}
              activeOpacity={0.9}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={styles.continueButtonText}>CONTINUE</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color="#fff"
                    style={styles.buttonIcon}
                  />
                </>
              )}
            </TouchableOpacity>
          </Animated.View>

          {!keyboardVisible && (
            <Animated.View style={{ opacity: fadeAnim }}>
              <Text style={styles.securityNote}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={14}
                  color="#888"
                />{" "}
                Your information is secure and will not be shared
              </Text>
            </Animated.View>
          )}
        </Animated.View>
        <View style={styles.bottomPadding} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const { width, height } = Dimensions.get("window");
const isIOS = Platform.OS === "ios";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bottomPadding: {
    height: 80, // Adjust this value based on your booking button height
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    color: "#555",
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: isIOS ? 60 : StatusBar.currentHeight + 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(175, 31, 35, 0.08)",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginRight: 40,
    color: "#333",
    letterSpacing: 0.3,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 30,
    justifyContent: "flex-start",
  },
  instructionText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 25,
    textAlign: "center",
    lineHeight: 22,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginBottom: 8,
    marginTop: 16,
  },
  requiredStar: {
    color: "#af1f23",
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f9f9f9",
    marginBottom: 8,
  },
  focusedInput: {
    borderColor: "#af1f23",
    backgroundColor: "#fff",
    shadowColor: "#af1f23",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  errorInput: {
    borderColor: "#af1f23",
    backgroundColor: "rgba(175, 31, 35, 0.05)",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  // Phone input custom styles
  phoneInputContainer: {
    width: "100%",
    height: 53, // Match the height of other inputs
    backgroundColor: "transparent",
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  phoneTextContainer: {
    backgroundColor: "transparent",
    borderLeftWidth: 1,
    borderLeftColor: "#ddd",
    padding: 0,
    paddingLeft: 8,
    height: 53,
  },
  phoneTextInput: {
    fontSize: 16,
    color: "#333",
    height: 53,
    padding: 0,
  },
  errorText: {
    color: "#af1f23",
    marginBottom: 8,
    fontSize: 13,
    alignItems: "center",
    flexDirection: "row",
  },
  continueButton: {
    backgroundColor: "#af1f23",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#af1f23",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    flexDirection: "row",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#d3a5a6",
    shadowOpacity: 0.1,
  },
  buttonPressed: {
    backgroundColor: "#941a1d",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  securityNote: {
    color: "#888",
    fontSize: 12,
    textAlign: "center",
    marginTop: 30,
    opacity: 0.8,
  },
});
