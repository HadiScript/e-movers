// // @ts-nocheck
// import React, { useState, useRef, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   Image,
//   Dimensions,
//   Animated,
//   ImageBackground,
// } from "react-native";
// import { StatusBar } from "expo-status-bar";
// import * as Haptics from "expo-haptics";
// import {
//   Ionicons,
//   FontAwesome5,
//   MaterialCommunityIcons,
// } from "@expo/vector-icons";

// const { width } = Dimensions.get("window");

// // Mock data for services
// const services = [
//   {
//     id: 1,
//     title: "Home Relocation",
//     icon: "home-move",
//     description: "Safe and secure home moving services across Dubai",
//   },
//   {
//     id: 2,
//     title: "Office Moving",
//     icon: "briefcase",
//     description: "Professional office relocation with minimal downtime",
//   },
//   {
//     id: 3,
//     title: "Furniture Dismantling",
//     icon: "tools",
//     description: "Expert furniture disassembly and reassembly",
//   },
//   {
//     id: 4,
//     title: "Packing Services",
//     icon: "box",
//     description: "Premium packing materials and professional techniques",
//   },
// ];

// // Slider items - using colors instead of images for now
// const sliderItems = [
//   {
//     id: 1,
//     color: "#8B0000",
//     title: "Professional Moving",
//     subtitle: "Safe & secure relocation services",
//   },
//   {
//     id: 2,
//     color: "#A52A2A",
//     title: "Careful Packing",
//     subtitle: "We handle your items with care",
//   },
//   {
//     id: 3,
//     color: "#C13030",
//     title: "Fast Delivery",
//     subtitle: "On-time and efficient services",
//   },
// ];

// export default function EHouseMoversApp() {
//   // Animation values
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(-100)).current;
//   const scaleAnim = useRef(new Animated.Value(0.9)).current;

//   // Slider state
//   const [activeSlide, setActiveSlide] = useState(0);
//   const scrollX = useRef(new Animated.Value(0)).current;
//   const slidesRef = useRef(null);

//   // Start animations when component mounts
//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 1000,
//         useNativeDriver: true,
//       }),
//       Animated.spring(slideAnim, {
//         toValue: 0,
//         friction: 8,
//         useNativeDriver: true,
//       }),
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         friction: 6,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Auto-scroll slider
//     const sliderInterval = setInterval(() => {
//       if (slidesRef.current) {
//         const nextSlide = (activeSlide + 1) % sliderItems.length;
//         slidesRef.current.scrollTo({ x: nextSlide * width, animated: true });
//         setActiveSlide(nextSlide);
//       }
//     }, 3000);

//     return () => clearInterval(sliderInterval);
//   }, [fadeAnim, slideAnim, scaleAnim, activeSlide]);

//   const handlePressBooking = () => {
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

//     // Button press animation
//     Animated.sequence([
//       Animated.timing(scaleAnim, {
//         toValue: 0.95,
//         duration: 100,
//         useNativeDriver: true,
//       }),
//       Animated.timing(scaleAnim, {
//         toValue: 1,
//         duration: 100,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Add your booking functionality here
//     console.log("Booking button pressed");
//   };

//   const handlePressService = (service) => {
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//     // Add your service selection functionality here
//     console.log(`Selected service: ${service.title}`);
//   };

//   // Handle slide change
//   const handleSlideChange = (event) => {
//     const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
//     setActiveSlide(slideIndex);
//   };

//   // Render slider dot indicators
//   const renderDotIndicators = () => {
//     return sliderItems.map((_, index) => {
//       const opacity = scrollX.interpolate({
//         inputRange: [(index - 1) * width, index * width, (index + 1) * width],
//         outputRange: [0.3, 1, 0.3],
//         extrapolate: "clamp",
//       });

//       const scale = scrollX.interpolate({
//         inputRange: [(index - 1) * width, index * width, (index + 1) * width],
//         outputRange: [1, 1.3, 1],
//         extrapolate: "clamp",
//       });

//       return (
//         <Animated.View
//           key={index}
//           style={[
//             styles.dot,
//             {
//               opacity,
//               transform: [{ scale }],
//               backgroundColor: index === activeSlide ? "#af1f23" : "#ccc",
//             },
//           ]}
//         />
//       );
//     });
//   };

//   // Get icon component based on name
//   const getIconComponent = (iconName) => {
//     switch (iconName) {
//       case "home-move":
//         return (
//           <MaterialCommunityIcons name="truck-fast" size={32} color="#af1f23" />
//         );
//       case "briefcase":
//         return <FontAwesome5 name="briefcase" size={28} color="#af1f23" />;
//       case "tools":
//         return <FontAwesome5 name="tools" size={28} color="#af1f23" />;
//       case "box":
//         return <FontAwesome5 name="box" size={28} color="#af1f23" />;
//       default:
//         return <FontAwesome5 name="box" size={28} color="#af1f23" />;
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar style="light" />
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* Logo and Header */}
//         <Animated.View
//           style={[
//             styles.header,
//             {
//               opacity: fadeAnim,
//               transform: [{ translateY: slideAnim }],
//             },
//           ]}
//         >
//           <Text style={styles.logo}>E HOUSE</Text>
//           <Text style={styles.tagline}>MOVERS & PACKERS</Text>
//         </Animated.View>

//         {/* Image Slider */}
//         <View style={styles.sliderContainer}>
//           <Animated.ScrollView
//             ref={slidesRef}
//             horizontal
//             pagingEnabled
//             showsHorizontalScrollIndicator={false}
//             onScroll={Animated.event(
//               [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//               { useNativeDriver: false, listener: handleSlideChange }
//             )}
//             scrollEventThrottle={16}
//           >
//             {sliderItems.map((item, index) => (
//               <View style={styles.slide} key={index}>
//                 <View
//                   style={[
//                     styles.slideBackground,
//                     { backgroundColor: item.color },
//                   ]}
//                 >
//                   <View style={styles.slideContent}>
//                     <FontAwesome5
//                       name={
//                         index === 0
//                           ? "truck-moving"
//                           : index === 1
//                           ? "box"
//                           : "shipping-fast"
//                       }
//                       size={40}
//                       color="#fff"
//                       style={styles.slideIcon}
//                     />
//                     <Text style={styles.slideTitle}>{item.title}</Text>
//                     <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
//                   </View>
//                 </View>
//               </View>
//             ))}
//           </Animated.ScrollView>
//           <View style={styles.dotsContainer}>{renderDotIndicators()}</View>
//         </View>

//         {/* Main Booking Button */}
//         <Animated.View
//           style={[
//             styles.bookingButtonContainer,
//             {
//               transform: [{ scale: scaleAnim }],
//               opacity: fadeAnim,
//             },
//           ]}
//         >
//           <TouchableOpacity
//             style={styles.bookingButton}
//             onPress={handlePressBooking}
//             activeOpacity={0.9}
//           >
//             <Text style={styles.bookingText}>BOOK YOUR MOVE NOW</Text>
//             <FontAwesome5
//               name="arrow-right"
//               size={20}
//               color="#fff"
//               style={styles.buttonIcon}
//             />
//           </TouchableOpacity>
//         </Animated.View>

//         {/* Services Section */}
//         <Animated.View
//           style={{
//             opacity: fadeAnim,
//             transform: [{ translateY: slideAnim }],
//           }}
//         >
//           <Text style={styles.sectionTitle}>Our Services</Text>

//           <View style={styles.servicesGrid}>
//             {services.map((service, index) => (
//               <TouchableOpacity
//                 key={service.id}
//                 style={[
//                   styles.serviceItem,
//                   index % 2 === 0 ? styles.serviceLeft : styles.serviceRight,
//                 ]}
//                 onPress={() => handlePressService(service)}
//                 activeOpacity={0.8}
//               >
//                 <View style={styles.serviceIconContainer}>
//                   {getIconComponent(service.icon)}
//                 </View>
//                 <Text style={styles.serviceTitle}>{service.title}</Text>
//                 <Text style={styles.serviceDescription} numberOfLines={2}>
//                   {service.description}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </Animated.View>

//         {/* Why Choose Us Section */}
//         <Animated.View style={{ opacity: fadeAnim, marginTop: 30 }}>
//           <Text style={styles.sectionTitle}>Why Choose Us</Text>

//           <View style={styles.featuresContainer}>
//             <View style={styles.featureItem}>
//               <FontAwesome5 name="clock" size={24} color="#af1f23" />
//               <Text style={styles.featureTitle}>Time-Efficient</Text>
//             </View>

//             <View style={styles.featureItem}>
//               <FontAwesome5 name="shield-alt" size={24} color="#af1f23" />
//               <Text style={styles.featureTitle}>Safe & Secure</Text>
//             </View>

//             <View style={styles.featureItem}>
//               <FontAwesome5 name="hand-holding-usd" size={24} color="#af1f23" />
//               <Text style={styles.featureTitle}>Affordable</Text>
//             </View>
//           </View>
//         </Animated.View>

//         {/* Contact Section */}
//         <View style={styles.contactSection}>
//           <Text style={styles.contactTitle}>Need Help?</Text>
//           <TouchableOpacity style={styles.contactButton}>
//             <FontAwesome5
//               name="phone-alt"
//               size={16}
//               color="#fff"
//               style={styles.contactIcon}
//             />
//             <Text style={styles.contactText}>Call Us Now</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   scrollContent: {
//     padding: 0,
//   },
//   header: {
//     padding: 20,
//     paddingTop: 40,
//     alignItems: "center",
//   },
//   logo: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#af1f23",
//     letterSpacing: 2,
//   },
//   tagline: {
//     fontSize: 16,
//     color: "#555",
//     marginTop: 5,
//     letterSpacing: 1,
//   },
//   sliderContainer: {
//     height: 220,
//     width: width,
//   },
//   slide: {
//     width: width,
//     height: 220,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   slideBackground: {
//     width: width,
//     height: 220,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   slideContent: {
//     padding: 20,
//     alignItems: "center",
//     justifyContent: "center",
//     width: "100%",
//   },
//   slideIcon: {
//     marginBottom: 15,
//   },
//   slideTitle: {
//     color: "white",
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   slideSubtitle: {
//     color: "white",
//     fontSize: 16,
//     textAlign: "center",
//     opacity: 0.9,
//   },
//   dotsContainer: {
//     flexDirection: "row",
//     position: "absolute",
//     bottom: 15,
//     alignSelf: "center",
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginHorizontal: 5,
//   },
//   bookingButtonContainer: {
//     marginHorizontal: 20,
//     marginVertical: 25,
//   },
//   bookingButton: {
//     backgroundColor: "#af1f23",
//     borderRadius: 10,
//     paddingVertical: 18,
//     paddingHorizontal: 25,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#af1f23",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 10,
//   },
//   bookingText: {
//     color: "#ffffff",
//     fontSize: 18,
//     fontWeight: "bold",
//     letterSpacing: 1,
//     marginRight: 10,
//   },
//   buttonIcon: {
//     marginLeft: 5,
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 20,
//     marginTop: 10,
//     paddingHorizontal: 20,
//   },
//   servicesGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     paddingHorizontal: 15,
//   },
//   serviceItem: {
//     width: "47%",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     marginBottom: 15,
//     padding: 15,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: "#eee",
//   },
//   serviceLeft: {
//     marginRight: 5,
//   },
//   serviceRight: {
//     marginLeft: 5,
//   },
//   serviceIconContainer: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "#f8f8f8",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   serviceTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 5,
//   },
//   serviceDescription: {
//     fontSize: 12,
//     color: "#777",
//     lineHeight: 18,
//   },
//   featuresContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     marginTop: 10,
//   },
//   featureItem: {
//     alignItems: "center",
//     width: "30%",
//     backgroundColor: "#f9f9f9",
//     padding: 15,
//     borderRadius: 10,
//   },
//   featureTitle: {
//     marginTop: 10,
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#333",
//     textAlign: "center",
//   },
//   contactSection: {
//     backgroundColor: "#f0f0f0",
//     padding: 20,
//     marginTop: 30,
//     alignItems: "center",
//   },
//   contactTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 15,
//   },
//   contactButton: {
//     backgroundColor: "#af1f23",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   contactText: {
//     color: "#fff",
//     fontWeight: "bold",
//     marginLeft: 8,
//   },
//   contactIcon: {
//     marginRight: 5,
//   },
// });
