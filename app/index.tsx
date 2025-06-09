import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace('./dashboard');
    }, 2000);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Image source={require('../assets/images/kitchen-logo.jpg')} style={{ width: 200, height: 200 }} />
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20 }}>Kitchen Sentinel</Text>
    </View>
  );
}
