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
//@ts-nocheck
import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  ImageBackground,
  Platform,
} from "react-native";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.4;
const LOCATION_CARD_WIDTH = width * 0.75;
// import '../../assets/images/dubai.jpeg'

// Animated Card Component for Services
const AnimatedServiceCard = ({
  title,
  icon,
  description,
  onPress,
  index,
  scrollY,
}) => {
  const inputRange = [-1, 0, 100 * index, 100 * (index + 1)];

  const scale = scrollY.interpolate({
    inputRange,
    outputRange: [1, 1, 1, 0.9],
  });

  const opacity = scrollY.interpolate({
    inputRange,
    outputRange: [1, 1, 1, 0.7],
  });

  return (
    <Animated.View style={{ transform: [{ scale }], opacity }}>
      <TouchableOpacity
        style={styles.serviceCard}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#fff1f0", "#ffccc7"]}
          style={styles.serviceCardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.serviceIconContainer}>{icon}</View>
          <Text style={styles.serviceCardTitle}>{title}</Text>
          <Text style={styles.serviceCardDescription}>{description}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Location Card Component
const LocationCard = ({ name, onPress, img }) => {
  return (
    <TouchableOpacity
      style={styles.locationCard}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={img}
        // source={{ uri: `https://source.unsplash.com/random/?${name},city` }}
        style={styles.locationBackground}
        imageStyle={styles.locationBackgroundImage}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]}
          style={styles.locationGradient}
        >
          <View style={styles.locationContent}>
            <Text style={styles.locationName}>{name}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

// Section Header
const SectionHeader = ({ title, icon, description }) => {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleContainer}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {description && (
        <Text style={styles.sectionDescription}>{description}</Text>
      )}
    </View>
  );
};

const Services = ({ fadeAnim, slideAnim }) => {
  const scrollY = useRef(new Animated.Value(0)).current;

  // Moving Services Data
  const movingServices = [
    {
      id: "1",
      title: "International Moves",
      description: "Safe and reliable overseas relocation services",
      icon: <MaterialCommunityIcons name="earth" size={30} color="#820014" />,
    },
    {
      id: "2",
      title: "Domestic Movers",
      description: "Smooth transitions for local relocations",
      icon: <FontAwesome5 name="home" size={28} color="#820014" />,
    },
    {
      id: "3",
      title: "Villa Movers",
      description: "Specialized moving for villa properties",
      icon: (
        <MaterialCommunityIcons name="home-city" size={30} color="#820014" />
      ),
    },
    {
      id: "4",
      title: "Office Movers",
      description: "Business relocation with minimal disruption",
      icon: (
        <MaterialCommunityIcons
          name="office-building"
          size={30}
          color="#820014"
        />
      ),
    },
    {
      id: "5",
      title: "Furniture Movers",
      description: "Expert handling of valuable furniture items",
      icon: <MaterialCommunityIcons name="sofa" size={30} color="#820014" />,
    },
  ];

  // Location data for UAE States
  const locationData = [
    { id: "1", name: "Dubai", img: require("../../assets/images/dubai.jpg") },
    {
      id: "2",
      name: "Abu Dhabi",
      img: require("../../assets/images/abu-dhabi.jpg"),
    },
    { id: "3", name: "Ajman", img: require("../../assets/images/ajman.jpg") },
    { id: "4", name: "Al Ain", img: require("../../assets/images/al-ain.jpg") },
    {
      id: "5",
      name: "Fujairah",
      img: require("../../assets/images/fujairah.jpg"),
    },
    {
      id: "6",
      name: "Umm Ul Quwain",
      img: require("../../assets/images/ul-q.jpg"),
    },
    {
      id: "7",
      name: "Sharjah",
      img: require("../../assets/images/Sharjah.jpg"),
    },
    {
      id: "8",
      name: "Ras Al Khaimah",
      img: require("../../assets/images/khaimah.jpg"),
    },
  ];

  const handleServicePress = (title) => {
    console.log(`Service pressed: ${title}`);
    router.push("/Booking");
    // Add your navigation or action logic here
  };

  const handleLocationPress = (name) => {
    console.log(`Location pressed: ${name}`);
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
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Featured Services Section */}
        <View style={styles.featuredSection}>
          <SectionHeader
            title="Featured Services"
            icon={<AntDesign name="star" size={24} color="#9c1b1f" />}
            description="Our most popular professional moving solutions"
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScrollContent}
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + 15}
            snapToAlignment="start"
          >
            {movingServices.map((service, index) => (
              <AnimatedServiceCard
                key={service.id}
                title={service.title}
                icon={service.icon}
                description={service.description}
                onPress={() => handleServicePress(service.title)}
                index={index}
                scrollY={scrollY}
              />
            ))}
          </ScrollView>
        </View>

        {/* Locations Section */}
        <View style={styles.locationsSection}>
          <SectionHeader
            title="Service Locations"
            icon={
              <MaterialIcons name="location-on" size={24} color="#9c1b1f" />
            }
            description="Moving & storage services throughout the UAE"
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.locationsScrollContent}
            decelerationRate="fast"
            snapToInterval={LOCATION_CARD_WIDTH + 15}
            snapToAlignment="center"
          >
            {locationData.map((location) => (
              <LocationCard
                key={location.id}
                name={location.name}
                onPress={() => handleLocationPress(location.name)}
                img={location.img}
              />
            ))}
          </ScrollView>
        </View>
      </Animated.ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingBottom: 30,
    paddingTop: 15,
  },

  // Featured Section
  featuredSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  sectionDescription: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    marginLeft: 34,
  },
  featuredScrollContent: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  serviceCard: {
    width: CARD_WIDTH,
    height: 200,
    marginRight: 15,
    borderRadius: 16,
    overflow: "hidden",
    // ...Platform.select({
    //   ios: {
    //     shadowColor: "#000",
    //     shadowOffset: { width: 0, height: 5 },
    //     shadowOpacity: 0.2,
    //     shadowRadius: 6,
    //   },
    //   android: {
    //     elevation: 8,
    //   },
    // }),
  },
  serviceCardGradient: {
    flex: 1,
    padding: 15,
    justifyContent: "space-between",
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(201, 7, 7, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  serviceCardTitle: {
    color: "#5c0011",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  serviceCardDescription: {
    // color: "rgba(255, 255, 255, 0.9)",
    color: "#5c0011",
    fontSize: 13,
  },

  // Locations Section
  locationsSection: {
    marginVertical: 15,
  },
  locationsScrollContent: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 5,
  },
  locationCard: {
    width: LOCATION_CARD_WIDTH,
    height: 120,
    marginRight: 15,
    borderRadius: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  locationBackground: {
    flex: 1,
  },
  locationBackgroundImage: {
    borderRadius: 16,
  },
  locationGradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 15,
  },
  locationContent: {
    justifyContent: "flex-end",
  },
  locationName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default Services;
