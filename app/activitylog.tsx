import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Type definitions
interface AlertItem {
  id: string;
  type: 'FLAME_NO_MOTION' | 'GAS_LEAK' | 'MOTION_DETECTED' | 'SYSTEM_STARTUP';
  message: string;
  timestamp: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  resolved: boolean;
}

type AlertType = 'FLAME_NO_MOTION' | 'GAS_LEAK' | 'MOTION_DETECTED' | 'SYSTEM_STARTUP';
type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export default function ActivityLog() {
  const router = useRouter();
  
  // Placeholder alert history - will be replaced with Firebase data
  const [alertHistory, setAlertHistory] = useState<AlertItem[]>([
    {
      id: '1',
      type: 'FLAME_NO_MOTION',
      message: 'Flame detected with no motion in kitchen',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
      severity: 'HIGH',
      resolved: false
    },
    {
      id: '2',
      type: 'GAS_LEAK',
      message: 'Gas leak detected in kitchen area',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      severity: 'CRITICAL',
      resolved: true
    },
    {
      id: '3',
      type: 'FLAME_NO_MOTION',
      message: 'Flame detected with no motion in kitchen',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      severity: 'HIGH',
      resolved: true
    },
    {
      id: '4',
      type: 'MOTION_DETECTED',
      message: 'Motion detected - Normal activity',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      severity: 'LOW',
      resolved: true
    },
    {
      id: '5',
      type: 'SYSTEM_STARTUP',
      message: 'Kitchen Sentinel system initialized',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      severity: 'INFO',
      resolved: true
    }
  ]);

  // TODO: Replace with Firebase real-time listener
  /*
  useEffect(() => {
    const database = getDatabase();
    const alertsRef = ref(database, 'alerts');
    
    const unsubscribe = onValue(alertsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const alertsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setAlertHistory(alertsArray);
      }
    });

    return () => unsubscribe();
  }, []);
  */

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const getSeverityColor = (severity: SeverityLevel): string => {
    switch (severity) {
      case 'CRITICAL': return '#D32F2F';
      case 'HIGH': return '#FF5722';
      case 'MEDIUM': return '#FF9800';
      case 'LOW': return '#4CAF50';
      case 'INFO': return '#2196F3';
      default: return '#666';
    }
  };

  const getSeverityIcon = (type: AlertType): string => {
    switch (type) {
      case 'FLAME_NO_MOTION': return '🔥';
      case 'GAS_LEAK': return '💨';
      case 'MOTION_DETECTED': return '👤';
      case 'SYSTEM_STARTUP': return '⚡';
      default: return '⚠️';
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all activity history? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAlertHistory([]);
            // TODO: Clear Firebase history
            /*
            const database = getDatabase();
            const alertsRef = ref(database, 'alerts');
            remove(alertsRef).then(() => {
              console.log('Alert history cleared from Firebase');
            }).catch((error) => {
              console.error('Error clearing history:', error);
            });
            */
          },
        },
      ],
    );
  };

  const handleBackPress = () => {
    try {
      router.back();
    } catch (error) {
      console.log('Error navigating back:', error);
      // Fallback navigation - you can customize this based on your app structure
      router.push('/'); // or router.replace('/dashboard') or whatever your main screen is
    }
  };

  const renderAlertItem = ({ item }: { item: AlertItem }) => (
    <View style={styles.alertItem}>
      <View style={styles.alertHeader}>
        <View style={styles.alertIconContainer}>
          <Text style={styles.alertIcon}>{getSeverityIcon(item.type)}</Text>
        </View>
        <View style={styles.alertContent}>
          <Text style={styles.alertMessage}>{item.message}</Text>
          <Text style={styles.alertTime}>{formatTimestamp(item.timestamp)}</Text>
        </View>
        <View style={styles.alertSeverity}>
          <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) }]}>
            <Text style={styles.severityText}>{item.severity}</Text>
          </View>
          {item.resolved && (
            <Text style={styles.resolvedText}>✓ Resolved</Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <View style={styles.backButtonContent}>
              <Text style={styles.backArrow}>‹</Text>
              <Text style={styles.backButtonText}>Back</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/kitchen-logo.jpg')} 
              style={styles.logoImage} 
            />
            <Text style={styles.headerTitle}>Activity Log</Text>
          </View>
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={handleClearHistory}
            activeOpacity={0.8}
          >
            <Text style={styles.clearButtonText}>Clear History</Text>
          </TouchableOpacity>
        </View>

        {/* Alert History List */}
        <View style={styles.content}>
          {alertHistory.length > 0 ? (
            <FlatList
              data={alertHistory}
              keyExtractor={(item) => item.id}
              renderItem={renderAlertItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>No Activity Yet</Text>
              <Text style={styles.emptyMessage}>
                Alert history will appear here when events are detected
              </Text>
            </View>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4FD',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#2196F3',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    minWidth: 60,
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 4,
    lineHeight: 24,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    justifyContent: 'center',
  },
  logoImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  alertItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertIcon: {
    fontSize: 20,
  },
  alertContent: {
    flex: 1,
    marginRight: 12,
  },
  alertMessage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
    color: '#666',
  },
  alertSeverity: {
    alignItems: 'flex-end',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  severityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  resolvedText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

// TODO: Firebase Integration Notes
/*
1. Alert Storage Structure:
{
  "alerts": {
    "alert_id_1": {
      "type": "FLAME_NO_MOTION",
      "message": "Flame detected with no motion in kitchen",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "severity": "HIGH",
      "resolved": false,
      "sensorData": {
        "gasLeak": false,
        "flamePresence": true,
        "motionDetected": false
      }
    }
  }
}

2. ESP32 Integration:
- When ESP32 detects an alert condition, it should push to Firebase alerts collection
- Include timestamp, sensor readings, and alert type
- Dashboard can mark alerts as resolved when conditions return to normal

3. Firebase Functions to Implement:
- fetchAlerts(): Get all alerts ordered by timestamp
- clearAllAlerts(): Remove all alert history
- markAlertResolved(alertId): Update alert status
- addAlert(alertData): Add new alert from ESP32

4. Real-time Updates:
- Use onValue() listener to get real-time updates
- Sort alerts by timestamp (newest first)
- Handle connection states and offline scenarios
*/