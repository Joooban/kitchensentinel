import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

export default function IndexScreen() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);

  // Auto-navigate after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigateToDashboard();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const navigateToDashboard = () => {
    if (visible) {
      setVisible(false);
      router.replace('/dashboard'); // Replace history to prevent going back to splash
    }
  };

  if (!visible) return null;

  return (
    <TouchableWithoutFeedback onPress={navigateToDashboard}>
      <View style={styles.container}>
        <Image
          source={require('../assets/images/kitchen-logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
