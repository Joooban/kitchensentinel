import { useRouter } from 'expo-router';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { database } from '../config/firebase'; // Adjust the import path as needed


export default function Dashboard() {
  const router = useRouter();

  const [sensorData, setSensorData] = useState({
    gasLeak: false,
    flamePresence: true,
    motionDetected: false,
    lastUpdated: new Date().toLocaleTimeString(),
  });

  useEffect(() => {
  const sensorRef = ref(database, 'sensors/latest'); // Match ESP32 path 

  const unsubscribe = onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      setSensorData({
      gasLeak: data.gasLeak,
      flamePresence: data.flameDetected, // Use flameDetected instead
      motionDetected: data.motionDetected,
      lastUpdated: new Date().toLocaleTimeString(),
    });
    }
  });

  return () => unsubscribe();
}, []);

  const hasAlert = sensorData.flamePresence && !sensorData.motionDetected;

  const renderStatusItem = (icon: string, label: string, status: string, isGood: boolean) => (
    <View style={styles.statusItem}>
      <View style={styles.statusIcon}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.statusContent}>
        <Text style={styles.statusLabel}>{label}</Text>
        <Text style={[styles.statusValue, isGood ? styles.statusGood : styles.statusBad]}>
          {status}
        </Text>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/images/kitchen-logo.jpg')} 
                style={styles.logoImage} 
              />
              <Text style={styles.logoText}>
                <Text style={styles.kitchenText}>KITCHEN </Text>
                <Text style={styles.sentinelText}>SENTINEL</Text>
              </Text>
            </View>
          </View>

          {/* Status Cards */}
          <View style={styles.statusContainer}>
            {renderStatusItem("💨", "GAS LEAK", sensorData.gasLeak ? "LEAK DETECTED!" : "NO LEAKS DETECTED!", !sensorData.gasLeak)}
            {renderStatusItem("🔥", "FLAME PRESENCE", sensorData.flamePresence ? "FLAME DETECTED!" : "NO FLAME DETECTED!", sensorData.flamePresence)}
            {renderStatusItem("👤", "MOTION DETECTOR", sensorData.motionDetected ? "MOTION DETECTED!" : "NO MOTION DETECTED!", sensorData.motionDetected || !sensorData.flamePresence)}
          </View>

          {/* Alert Box */}
          {hasAlert && (
            <View style={styles.alertContainer}>
              <View style={styles.alertBox}>
                <Text style={styles.alertLabel}>ALERT:</Text>
                <Text style={styles.alertText}>FLAME DETECTED WITH NO MOTION! PLEASE CHECK YOUR KITCHEN.</Text>
              </View>
              <View style={styles.caregiverAlert}>
                <Text style={styles.caregiverText}>CAREGIVER ALERT: NOTIFICATIONS SENT TO CAREGIVER</Text>
              </View>
            </View>
          )}

          {/* Last Updated */}
          <Text style={styles.lastUpdated}>Last updated: {sensorData.lastUpdated}</Text>
        </ScrollView>

        {/* Fixed Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={() => router.push('./activitylog')}>
            <Text style={styles.buttonText}>📋 ACTIVITY LOG</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => router.push('/settings')}>
            <Text style={styles.buttonText}>⚙️ SETTINGS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

// CSS
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#E8F4FD',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  kitchenText: {
    color: '#000',
  },
  sentinelText: {
    color: '#2196F3',
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
  },
  statusIcon: {
    marginRight: 16,
  },
  iconText: {
    fontSize: 28,
  },
  statusContent: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusGood: {
    color: '#4CAF50',
  },
  statusBad: {
    color: '#F44336',
  },
  alertContainer: {
    marginBottom: 20,
  },
  alertBox: {
    backgroundColor: '#F44336',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  alertLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  alertText: {
    color: '#fff',
    fontSize: 16,
  },
  caregiverAlert: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  caregiverText: {
    color: '#fff',
    fontSize: 16,
  },
  lastUpdated: {
    textAlign: 'center',
    color: '#555',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
  },
  secondaryButton: {
    backgroundColor: '#FF5722',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});