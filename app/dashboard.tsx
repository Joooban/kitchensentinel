import { useRouter } from 'expo-router';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { database } from '../config/firebase';
import { NotificationService } from '../services/notificationService';

export default function Dashboard() {
  const router = useRouter();

  const [sensorData, setSensorData] = useState({
    gasLeak: false,
    flamePresence: false,
    motionDetected: false,
    lastUpdated: new Date().toLocaleTimeString(),
  });

  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [notificationDismissed, setNotificationDismissed] = useState(false);

  useEffect(() => {
    const sensorRef = ref(database, 'sensors/latest');

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Sensor data from Firebase:", data);
      
      if (data) {
        const newSensorData = {
          gasLeak: data.gasLeak === true || data.gasLeak === "true",
          flamePresence: data.flamePresence === true || data.flamePresence === "true", 
          motionDetected: data.motionDetected === true || data.motionDetected === "true",
          lastUpdated: new Date().toLocaleTimeString(),
        };
        
        setSensorData(newSensorData);
        setConnectionStatus('Connected');
        
        // Check if system was reset - if so, clear any dismissed notifications
        if (data.systemReset === true) {
          setNotificationDismissed(false);
          console.log("System was reset - clearing notification dismissal");
        }
        
        // Reset notification dismissed state when new alert occurs
        const hasNewAlert = (newSensorData.flamePresence && !newSensorData.motionDetected) || 
                          newSensorData.gasLeak;
        if (hasNewAlert) {
          setNotificationDismissed(false);
        }
      } else {
        setConnectionStatus('No data');
      }
    }, (error) => {
      console.error("Firebase error:", error);
      setConnectionStatus('Connection error');
    });

    return () => unsubscribe();
  }, []);

  // Determine alert status
  const hasAlert = sensorData.flamePresence && !sensorData.motionDetected;
  const hasGasAlert = sensorData.gasLeak;
  const hasCriticalAlert = hasGasAlert && sensorData.flamePresence;

  const getAlertLevel = () => {
    if (hasCriticalAlert) return 'CRITICAL';
    if (hasGasAlert) return 'HIGH';
    if (hasAlert) return 'HIGH';
    return 'NORMAL';
  };

  const getAlertMessage = () => {
    if (hasCriticalAlert) {
      return 'CRITICAL: GAS LEAK AND FLAME DETECTED!';
    }
    if (hasGasAlert) {
      return 'WARNING: GAS LEAK DETECTED!';
    }
    if (hasAlert) {
      return 'ALERT: FLAME DETECTED WITH NO MOTION!';
    }
    return null;
  };

  const handleDismissNotification = () => {
    setNotificationDismissed(true);
  };

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

  const alertLevel = getAlertLevel();
  const alertMessage = getAlertMessage();
  const showAlert = alertMessage && !notificationDismissed;

  return (
    <>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      <NotificationService />
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
            <View style={styles.connectionStatus}>
              <View style={[styles.statusDot, { 
                backgroundColor: connectionStatus === 'Connected' ? '#4CAF50' : 
                                connectionStatus === 'Connecting...' ? '#FF9800' : '#F44336' 
              }]} />
              <Text style={styles.connectionText}>{connectionStatus}</Text>
            </View>
          </View>

          {/* Critical Alert Banner */}
          {alertLevel === 'CRITICAL' && !notificationDismissed && (
            <View style={styles.criticalAlertBanner}>
              <Text style={styles.criticalAlertText}>🚨 EMERGENCY 🚨</Text>
              <Text style={styles.criticalAlertSubtext}>EVACUATE IMMEDIATELY</Text>
            </View>
          )}

          {/* Status Cards */}
          <View style={styles.statusContainer}>
            {renderStatusItem(
              "💨", 
              "GAS LEAK", 
              sensorData.gasLeak ? "LEAK DETECTED!" : "NO LEAKS DETECTED!", 
              !sensorData.gasLeak
            )}
            {renderStatusItem(
              "🔥", 
              "FLAME PRESENCE", 
              sensorData.flamePresence ? "FLAME DETECTED!" : "NO FLAME DETECTED!", 
              !sensorData.flamePresence
            )}
            {renderStatusItem(
              "👤", 
              "MOTION DETECTOR", 
              sensorData.motionDetected ? "MOTION DETECTED!" : "NO MOTION DETECTED!", 
              sensorData.motionDetected || !sensorData.flamePresence
            )}
          </View>

          {/* Alert Box */}
          {showAlert && (
            <View style={styles.alertContainer}>
              <View style={[styles.alertBox, {
                backgroundColor: alertLevel === 'CRITICAL' ? '#B71C1C' : '#F44336'
              }]}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertLabel}>
                    {alertLevel === 'CRITICAL' ? 'EMERGENCY:' : 'ALERT:'}
                  </Text>
                  <TouchableOpacity 
                    style={styles.dismissButton}
                    onPress={handleDismissNotification}
                  >
                    <Text style={styles.dismissButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.alertText}>{alertMessage}</Text>
                {alertLevel === 'CRITICAL' && (
                  <Text style={styles.emergencyText}>⚠️ CALL EMERGENCY SERVICES ⚠️</Text>
                )}
              </View>
              <View style={styles.caregiverAlert}>
                <Text style={styles.caregiverText}>
                  📱 CAREGIVER ALERT: NOTIFICATIONS SENT
                </Text>
              </View>
            </View>
          )}

          {/* System Status */}
          <View style={styles.systemStatus}>
            <Text style={styles.systemStatusTitle}>System Status</Text>
            <Text style={styles.systemStatusText}>
              Alert Level: <Text style={[styles.alertLevelText, {
                color: alertLevel === 'CRITICAL' ? '#B71C1C' : 
                       alertLevel === 'HIGH' ? '#F44336' : '#4CAF50'
              }]}>{alertLevel}</Text>
            </Text>
            <Text style={styles.lastUpdated}>Last updated: {sensorData.lastUpdated}</Text>
          </View>
        </ScrollView>

        {/* Fixed Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={() => router.push('./activitylog')}
          >
            <Text style={styles.buttonText}>📋 ACTIVITY LOG</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={() => router.push('/settings')}
          >
            <Text style={styles.buttonText}>⚙️ SETTINGS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

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
    marginBottom: 20,
    paddingTop: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  connectionText: {
    fontSize: 12,
    color: '#666',
  },
  criticalAlertBanner: {
    backgroundColor: '#B71C1C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFEB3B',
  },
  criticalAlertText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  criticalAlertSubtext: {
    color: '#FFEB3B',
    fontSize: 16,
    fontWeight: 'bold',
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
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  alertLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  dismissButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  alertText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  emergencyText: {
    color: '#FFEB3B',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  caregiverAlert: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  caregiverText: {
    color: '#fff',
    fontSize: 14,
  },
  systemStatus: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  systemStatusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  systemStatusText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  alertLevelText: {
    fontWeight: 'bold',
  },
  lastUpdated: {
    fontSize: 14,
    color: '#999',
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