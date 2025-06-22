import { useRouter } from 'expo-router';
import { onValue, ref, remove } from 'firebase/database';
import React, { useEffect, useState } from 'react';
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
import { database } from '../config/firebase';

// Type definitions
interface AlertItem {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  severity: string;
  resolved: boolean;
}

export default function ActivityLog() {
  const router = useRouter();
  const [alertHistory, setAlertHistory] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const alertsRef = ref(database, 'alerts');

    const unsubscribe = onValue(alertsRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Raw Firebase alerts data:', data);
      
      if (data) {
        const alertsArray = Object.keys(data).map(key => ({
          id: key,
          type: data[key].type || 'UNKNOWN',
          message: data[key].message || 'No message',
          timestamp: data[key].timestamp || new Date().toISOString(),
          severity: data[key].severity || 'MEDIUM',
          resolved: data[key].resolved || false
        })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        console.log('Processed alerts array:', alertsArray);
        setAlertHistory(alertsArray);
      } else {
        console.log('No alerts data found');
        setAlertHistory([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('Firebase error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInMinutes < 1) {
        return 'Just now';
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      } else {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      }
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Unknown time';
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL': return '#D32F2F';
      case 'HIGH': return '#FF5722';
      case 'MEDIUM': return '#FF9800';
      case 'LOW': return '#4CAF50';
      case 'INFO': return '#2196F3';
      default: return '#666';
    }
  };

  const getSeverityIcon = (type: string): string => {
    const alertType = type.toUpperCase();
    if (alertType.includes('FLAME')) return '🔥';
    if (alertType.includes('GAS')) return '💨';
    if (alertType.includes('MOTION')) return '👤';
    if (alertType.includes('SYSTEM') || alertType.includes('STARTUP')) return '⚡';
    return '⚠️';
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
          onPress: async () => {
            try {
              const alertsRef = ref(database, 'alerts');
              await remove(alertsRef);
              console.log('Alert history cleared from Firebase');
              setAlertHistory([]);
            } catch (error) {
              console.error('Error clearing history:', error);
              Alert.alert('Error', 'Failed to clear history. Please try again.');
            }
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
      router.push('/');
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

  if (loading) {
    return (
      <>
        <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
        <View style={styles.container}>
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
            <View style={styles.clearButton} />
          </View>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading alerts...</Text>
          </View>
        </View>
      </>
    );
  }

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

// CSS remains the same
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});