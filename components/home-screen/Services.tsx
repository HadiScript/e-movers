// // @ts-nocheck
// import React, { useRef, useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Animated,
//   Dimensions,
//   Platform,
//   Pressable,
// } from "react-native";
// import * as Haptics from "expo-haptics";
// import {
//   FontAwesome5,
//   MaterialCommunityIcons,
//   Ionicons,
//   Feather,
// } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { BlurView } from "expo-blur";

// const { width } = Dimensions.get("window");
// const CARD_WIDTH = width * 0.8;
// const CARD_HEIGHT = 240;

// const services = [
//   {
//     id: 1,
//     title: "Home Relocation",
//     icon: "home-move",
//     description: "Safe and secure home moving services across Dubai",
//     features: [
//       "Full packing service",
//       "Furniture protection",
//       "Insurance coverage",
//     ],
//     color: "#FF4B4B",
//     gradient: ["#FF4B4B", "#FF6262", "#FF7979"],
//   },
//   {
//     id: 2,
//     title: "Office Moving",
//     icon: "briefcase",
//     description: "Professional office relocation with minimal downtime",
//     features: ["Weekend availability", "IT equipment care", "Workspace setup"],
//     color: "#4B7BFF",
//     gradient: ["#4B7BFF", "#627FFF", "#7993FF"],
//   },
//   {
//     id: 3,
//     title: "Furniture Services",
//     icon: "tools",
//     description: "Expert furniture disassembly and reassembly",
//     features: ["Professional tools", "Experienced team", "On-site service"],
//     color: "#4BFF88",
//     gradient: ["#4BFF88", "#62FF9A", "#79FFAB"],
//   },
//   {
//     id: 4,
//     title: "Premium Packing",
//     icon: "box",
//     description: "Premium packing materials and professional techniques",
//     features: [
//       "High-quality materials",
//       "Fragile item care",
//       "Custom solutions",
//     ],
//     color: "#FFB84B",
//     gradient: ["#FFB84B", "#FFC062", "#FFC979"],
//   },
// ];

// const ServiceCard = ({
//   service,
//   index,
//   activeIndex,
//   handlePress,
//   isPressed,
// }) => {
//   const scaleAnim = useRef(new Animated.Value(0.9)).current;
//   const floatAnim = useRef(new Animated.Value(0)).current;
//   const glowAnim = useRef(new Animated.Value(0)).current;
//   const rotateAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // Entrance animation
//     Animated.spring(scaleAnim, {
//       toValue: 1,
//       friction: 8,
//       tension: 40,
//       delay: index * 100,
//       useNativeDriver: true,
//     }).start();

//     // Floating animation
//     const floatAnimation = Animated.loop(
//       Animated.sequence([
//         Animated.timing(floatAnim, {
//           toValue: -5,
//           duration: 2000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(floatAnim, {
//           toValue: 5,
//           duration: 2000,
//           useNativeDriver: true,
//         }),
//       ])
//     );
//     floatAnimation.start();

//     // Glow pulse animation
//     const glowAnimation = Animated.loop(
//       Animated.sequence([
//         Animated.timing(glowAnim, {
//           toValue: 1,
//           duration: 1500,
//           useNativeDriver: true,
//         }),
//         Animated.timing(glowAnim, {
//           toValue: 0,
//           duration: 1500,
//           useNativeDriver: true,
//         }),
//       ])
//     );
//     glowAnimation.start();

//     return () => {
//       floatAnimation.stop();
//       glowAnimation.stop();
//     };
//   }, []);

//   const handlePressIn = () => {
//     Animated.spring(scaleAnim, {
//       toValue: 0.95,
//       useNativeDriver: true,
//     }).start();
//   };

//   const handlePressOut = () => {
//     Animated.spring(scaleAnim, {
//       toValue: 1,
//       useNativeDriver: true,
//     }).start();
//   };

//   const glowOpacity = glowAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0.1, 0.3],
//   });

//   const getIconComponent = (iconName) => {
//     const iconProps = { size: 32, color: "#fff" };
//     switch (iconName) {
//       case "home-move":
//         return <MaterialCommunityIcons name="truck-fast" {...iconProps} />;
//       case "briefcase":
//         return <FontAwesome5 name="briefcase" {...iconProps} />;
//       case "tools":
//         return <FontAwesome5 name="tools" {...iconProps} />;
//       case "box":
//         return <FontAwesome5 name="box" {...iconProps} />;
//       default:
//         return <FontAwesome5 name="box" {...iconProps} />;
//     }
//   };

//   return (
//     <Animated.View
//       style={[
//         styles.cardWrapper,
//         {
//           transform: [{ scale: scaleAnim }, { translateY: floatAnim }],
//         },
//       ]}
//     >
//       <Pressable
//         onPress={() => handlePress(service, index)}
//         onPressIn={handlePressIn}
//         onPressOut={handlePressOut}
//         style={({ pressed }) => [
//           styles.cardPressable,
//           pressed && styles.cardPressed,
//         ]}
//       >
//         <LinearGradient
//           colors={service.gradient}
//           style={styles.card}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//         >
//           {/* Animated Glow */}
//           <Animated.View
//             style={[
//               styles.glow,
//               {
//                 backgroundColor: service.color,
//                 opacity: glowOpacity,
//               },
//             ]}
//           />

//           {/* Top Section */}
//           <View style={styles.topSection}>
//             <View style={styles.iconContainer}>
//               <BlurView intensity={20} style={styles.iconBlur}>
//                 {getIconComponent(service.icon)}
//               </BlurView>
//             </View>

//             <View style={styles.headerContent}>
//               <Text style={styles.cardTitle}>{service.title}</Text>
//               <Text style={styles.cardDescription}>{service.description}</Text>
//             </View>
//           </View>

//           {/* Features Section */}
//           <View style={styles.featuresSection}>
//             {service.features.map((feature, idx) => (
//               <View key={idx} style={styles.featureItem}>
//                 <Feather name="check-circle" size={16} color="#fff" />
//                 <Text style={styles.featureText}>{feature}</Text>
//               </View>
//             ))}
//           </View>

//           {/* Bottom Section */}
//           <View style={styles.bottomSection}>
//             <TouchableOpacity
//               style={styles.selectButton}
//               onPress={() => handlePress(service, index)}
//             >
//               <Text style={styles.selectButtonText}>Select Service</Text>
//               <FontAwesome5 name="arrow-right" size={14} color="#fff" />
//             </TouchableOpacity>
//           </View>

//           {/* Decorative Elements */}
//           <View style={styles.decorativeCircle1} />
//           <View style={styles.decorativeCircle2} />
//         </LinearGradient>
//       </Pressable>
//     </Animated.View>
//   );
// };

// const Services = ({ fadeAnim, slideAnim }) => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const scrollViewRef = useRef(null);
//   const titleScaleAnim = useRef(new Animated.Value(0.9)).current;
//   const subtitleOpacityAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // Animate title
//     Animated.spring(titleScaleAnim, {
//       toValue: 1,
//       friction: 8,
//       tension: 40,
//       useNativeDriver: true,
//     }).start();

//     // Animate subtitle
//     Animated.timing(subtitleOpacityAnim, {
//       toValue: 1,
//       duration: 800,
//       delay: 300,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   const handlePress = (service, index) => {
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//     setActiveIndex(index);
//     console.log(`Selected service: ${service.title}`);

//     // Scroll to the selected card
//     if (scrollViewRef.current) {
//       scrollViewRef.current.scrollTo({
//         x: index * (CARD_WIDTH + 20),
//         animated: true,
//       });
//     }
//   };

//   return (
//     <Animated.View
//       style={{
//         opacity: fadeAnim,
//         transform: [{ translateY: slideAnim }],
//       }}
//     >
//       {/* Section Header */}
//       <View style={styles.headerContainer}>
//         <Animated.Text
//           style={[
//             styles.sectionTitle,
//             {
//               transform: [{ scale: titleScaleAnim }],
//             },
//           ]}
//         >
//           Professional Services
//         </Animated.Text>
//         <Animated.Text
//           style={[
//             styles.sectionSubtitle,
//             {
//               opacity: subtitleOpacityAnim,
//             },
//           ]}
//         >
//           Choose the perfect solution for your moving needs
//         </Animated.Text>
//       </View>

//       {/* Services Horizontal Scroll */}
//       <Animated.ScrollView
//         ref={scrollViewRef}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.scrollViewContent}
//         snapToInterval={CARD_WIDTH + 20}
//         decelerationRate="fast"
//         bounces={false}
//       >
//         {services.map((service, index) => (
//           <ServiceCard
//             key={service.id}
//             service={service}
//             index={index}
//             activeIndex={activeIndex}
//             handlePress={handlePress}
//           />
//         ))}
//       </Animated.ScrollView>

//       {/* Pagination Dots */}
//       <View style={styles.paginationContainer}>
//         {services.map((_, index) => (
//           <View
//             key={index}
//             style={[
//               styles.paginationDot,
//               index === activeIndex ? styles.paginationDotActive : null,
//             ]}
//           />
//         ))}
//       </View>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   headerContainer: {
//     paddingHorizontal: 20,
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#555",
//     letterSpacing: 0.5,
//     marginBottom: 8,
//   },
//   sectionSubtitle: {
//     fontSize: 16,
//     color: "#666",
//     letterSpacing: 0.3,
//   },
//   scrollViewContent: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//   },
//   cardWrapper: {
//     width: CARD_WIDTH,
//     height: CARD_HEIGHT,
//     marginRight: 20,
//   },
//   cardPressable: {
//     borderRadius: 25,
//     overflow: "hidden",
//     ...Platform.select({
//       ios: {
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 8 },
//         shadowOpacity: 0.3,
//         shadowRadius: 12,
//       },
//       android: {
//         // elevation: 10,
//       },
//     }),
//   },
//   cardPressed: {
//     transform: [{ scale: 0.98 }],
//   },
//   card: {
//     width: "100%",
//     height: "100%",
//     padding: 20,
//     borderRadius: 25,
//     overflow: "hidden",
//   },
//   glow: {
//     position: "absolute",
//     top: -50,
//     left: -50,
//     right: -50,
//     bottom: -50,
//     borderRadius: 100,
//   },
//   topSection: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   iconContainer: {
//     marginRight: 15,
//   },
//   iconBlur: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "rgba(255, 255, 255, 0.15)",
//   },
//   headerContent: {
//     flex: 1,
//   },
//   cardTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#fff",
//     marginBottom: 4,
//   },
//   cardDescription: {
//     fontSize: 14,
//     color: "rgba(255, 255, 255, 0.9)",
//     lineHeight: 20,
//   },
//   featuresSection: {
//     marginBottom: 20,
//   },
//   featureItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   featureText: {
//     fontSize: 14,
//     color: "#fff",
//     marginLeft: 10,
//   },
//   bottomSection: {
//     marginTop: "auto",
//   },
//   selectButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "rgba(255, 255, 255, 0.2)",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//   },
//   selectButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//     marginRight: 8,
//   },
//   decorativeCircle1: {
//     position: "absolute",
//     top: -30,
//     right: -30,
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: "rgba(255, 255, 255, 0.1)",
//   },
//   decorativeCircle2: {
//     position: "absolute",
//     bottom: -40,
//     left: -40,
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: "rgba(255, 255, 255, 0.05)",
//   },
//   paginationContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   paginationDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "#ccc",
//     marginHorizontal: 5,
//   },
//   paginationDotActive: {
//     backgroundColor: "#af1f23",
//     width: 24,
//   },
// });

// export default Services;

//@ts-nocheck
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";

const ServiceItem = ({ title, icon, color, onPress }) => {
  return (
    <TouchableOpacity style={styles.serviceItem} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        {icon}
      </View>
      <Text style={styles.serviceTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const MoverTypeItem = ({ title, onPress, icon }) => {
  return (
    <TouchableOpacity
      style={styles.moverTypeItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon}
      <Text style={styles.moverTypeText}>{title}</Text>
    </TouchableOpacity>
  );
};

const Services = ({ fadeAnim, slideAnim }) => {
  // First row services data
  const servicesData = [
    {
      id: "1",
      title: "Cleaning",
      icon: <MaterialCommunityIcons name="broom" size={24} color="white" />,
      color: "#9c1b1f",
    },
    {
      id: "2",
      title: "Repairing",
      icon: <Ionicons name="construct" size={24} color="white" />,
      color: "#9c1b1f",
    },
    {
      id: "3",
      title: "Painting",
      icon: <FontAwesome5 name="paint-roller" size={24} color="white" />,
      color: "#9c1b1f",
    },
    {
      id: "4",
      title: "Laundry",
      icon: (
        <MaterialCommunityIcons
          name="washing-machine"
          size={24}
          color="white"
        />
      ),
      color: "#9c1b1f",
    },
    {
      id: "5",
      title: "Appliance",
      icon: (
        <MaterialCommunityIcons name="refrigerator" size={24} color="white" />
      ),
      color: "#9c1b1f",
    },
    {
      id: "6",
      title: "Plumbing",
      icon: <MaterialCommunityIcons name="pipe" size={24} color="white" />,
      color: "#9c1b1f",
    },
    {
      id: "7",
      title: "Shifting",
      icon: <FontAwesome5 name="truck-moving" size={24} color="white" />,
      color: "#9c1b1f",
    },
  ];

  // Second row - Mover types data with icons
  const moverTypesData = [
    {
      id: "1",
      title: "International Moves",
      icon: <MaterialCommunityIcons name="earth" size={24} color="#af1f23" />,
    },
    {
      id: "2",
      title: "Domestic Movers",
      icon: <FontAwesome5 name="home" size={24} color="#af1f23" />,
    },
    {
      id: "3",
      title: "Villa Movers",
      icon: (
        <MaterialCommunityIcons name="home-city" size={24} color="#af1f23" />
      ),
    },
    {
      id: "4",
      title: "Secure Storage",
      icon: <MaterialCommunityIcons name="lock" size={24} color="#af1f23" />,
    },
    {
      id: "5",
      title: "Office Movers",
      icon: (
        <MaterialCommunityIcons
          name="office-building"
          size={24}
          color="#af1f23"
        />
      ),
    },
    {
      id: "6",
      title: "Villa Movers in Dubai",
      icon: (
        <MaterialCommunityIcons
          name="package-variant-closed"
          size={24}
          color="#af1f23"
        />
      ),
    },
    {
      id: "7",
      title: "Furniture Movers",
      icon: <MaterialCommunityIcons name="sofa" size={24} color="#af1f23" />,
    },
  ];

  const handleServicePress = (title) => {
    console.log(`Service pressed: ${title}`);
    // Add your navigation or action logic here
  };

  const handleMoverTypePress = (title) => {
    console.log(`Mover type pressed: ${title}`);
    // Add your navigation or action logic here
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.servicesScrollContent}
        >
          {servicesData.map((service) => (
            <ServiceItem
              key={service.id}
              title={service.title}
              icon={service.icon}
              color={service.color}
              onPress={() => handleServicePress(service.title)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Moving Services</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moverTypesScrollContent}
        >
          <View style={styles.movingServicesRow}>
            {moverTypesData.map((moverType) => (
              <MoverTypeItem
                key={moverType.id}
                title={moverType.title}
                icon={moverType.icon}
                onPress={() => handleMoverTypePress(moverType.title)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  servicesScrollContent: {
    paddingRight: 15,
    paddingLeft: 20,
  },
  serviceItem: {
    alignItems: "center",
    marginRight: 15,
    width: 80,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  serviceTitle: {
    fontSize: 12,
    textAlign: "center",
    color: "#444",
    fontWeight: "500",
  },
  moverTypesScrollContent: {
    paddingHorizontal: 20,
  },
  movingServicesRow: {
    flexDirection: "row",
  },
  moverTypeItem: {
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    width: 130,
    marginRight: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  moverTypeText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});

export default Services;
