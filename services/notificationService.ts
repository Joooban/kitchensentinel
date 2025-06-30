import * as Notifications from 'expo-notifications';
import { onValue, ref } from 'firebase/database';
import { useEffect, useRef } from 'react';
import { database } from '../config/firebase';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface AlertData {
  type: string;
  message: string;
  timestamp: string;
  severity: string;
}

export const useNotificationService = () => {
  const lastAlertRef = useRef<string>('');

  // Request notification permissions
  const requestPermissions = async (): Promise<boolean> => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permission denied');
      return false;
    }

    console.log('Notification permissions granted');
    return true;
  };

  // Send local notification
  const sendNotification = async (alert: AlertData) => {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: getNotificationTitle(alert.type, alert.severity),
          body: alert.message,
          sound: alert.severity === 'CRITICAL' || alert.severity === 'HIGH' ? 'default' : undefined,
          priority: alert.severity === 'CRITICAL' ? 'high' : 'normal',
          data: {
            alertType: alert.type,
            severity: alert.severity,
            timestamp: alert.timestamp,
          },
        },
        trigger: null, // Send immediately
      });

      console.log('Notification sent:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error sending notification:', error);
      return null;
    }
  };

  // Generate title for the alert
  const getNotificationTitle = (type: string, severity: string): string => {
    const isUrgent = severity === 'CRITICAL' || severity === 'HIGH';

    if (type.includes('GAS') && type.includes('FLAME')) {
      return isUrgent ? '🚨 URGENT: Gas & Flame Alert!' : '⚠️ Kitchen Alert';
    }
    if (type.includes('GAS')) {
      return isUrgent ? '🚨 URGENT: Gas Detected!' : '⚠️ Gas Alert';
    }
    if (type.includes('FLAME') && type.includes('NO_MOTION')) {
      return isUrgent ? '🚨 URGENT: Unattended Flame!' : '⚠️ Flame Alert';
    }
    if (type.includes('FLAME')) {
      return isUrgent ? '🚨 URGENT: Flame Detected!' : '⚠️ Flame Alert';
    }

    return isUrgent ? '🚨 URGENT: Kitchen Alert!' : '⚠️ Kitchen Sentinel Alert';
  };

  // Watch Firebase for new alerts and notify
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    requestPermissions().then((granted) => {
      if (!granted) return;

      const alertsRef = ref(database, 'alerts');

      unsubscribe = onValue(alertsRef, (snapshot) => {
        const data = snapshot.val();

        if (data) {
          const alertKeys = Object.keys(data);
          const mostRecentKey = alertKeys.sort((a, b) =>
            new Date(data[b].timestamp).getTime() - new Date(data[a].timestamp).getTime()
          )[0];

          const mostRecentAlert = data[mostRecentKey];

          if (mostRecentKey !== lastAlertRef.current && mostRecentAlert) {
            const alertTime = new Date(mostRecentAlert.timestamp).getTime();
            const now = new Date().getTime();
            const fiveMinutesAgo = now - 5 * 60 * 1000;

            if (alertTime > fiveMinutesAgo) {
              console.log('Sending notification for new alert:', mostRecentAlert);
              sendNotification({
                type: mostRecentAlert.type,
                message: mostRecentAlert.message,
                timestamp: mostRecentAlert.timestamp,
                severity: mostRecentAlert.severity,
              });
            }

            lastAlertRef.current = mostRecentKey;
          }
        }
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return {
    requestPermissions,
    sendNotification,
  };
};

export const NotificationService = () => {
  useNotificationService();
  return null; // No UI
};
