import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Type definitions
interface SettingsState {
  notifications: boolean;
  caregiverNotifications: boolean;
  caregiverEmail: string;
  caregiverPhone: string;
  darkMode: boolean;
  fontSize: 'SMALL' | 'MEDIUM' | 'LARGE';
}

export default function Settings() {
  const router = useRouter();

  const [settings, setSettings] = useState<SettingsState>({
    notifications: true,
    caregiverNotifications: true,
    caregiverEmail: 'caregiver@example.com',
    caregiverPhone: '+1234567890',
    darkMode: false,
    fontSize: 'MEDIUM',
  });

  const updateSetting = (key: keyof SettingsState, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
  };

  const handleFontSizeChange = () => {
    const options = ['SMALL', 'MEDIUM', 'LARGE'] as const;
    const next = (options.indexOf(settings.fontSize) + 1) % options.length;
    updateSetting('fontSize', options[next]);
  };

  const handleSensorTest = () => {
    Alert.alert('Sensor Test', 'Testing all sensors... Please wait.', [
      {
        text: 'OK',
        onPress: () => {
          setTimeout(() => {
            Alert.alert('Test Complete', 'All sensors are working properly!');
          }, 2000);
        },
      },
    ]);
  };

  const handleHelpCenter = () => {
    const helpContent = `1. What does Kitchen Sentinel do?
Kitchen Sentinel monitors flame, gas leaks, and motion to help prevent kitchen accidents.

2. What happens when a flame is detected with no motion?
An alert is sent to you and your registered caregiver to check for potential danger.

3. How do I add or update a caregiver contact?
Go to Settings > Caregiver Contact and input the new details.

4. Does Kitchen Sentinel work offline?
Basic monitoring works offline, but alerts and caregiver notifications require an internet connection.

5. How do I clear the activity log?
Go to Activity Log > Clear History and confirm when prompted.

For technical support:
Email: support@kitchensentinel.com
Phone: 1-800-KITCHEN`;

    Alert.alert('Help Center - FAQ', helpContent, [{ text: 'OK' }], {
      cancelable: true,
    });
  };

  const dynamicStyles = {
    container: {
      backgroundColor: settings.darkMode ? '#121212' : '#E8F4FD',
    },
    text: {
      color: settings.darkMode ? '#FFFFFF' : '#333333',
      fontSize:
        settings.fontSize === 'SMALL'
          ? 14
          : settings.fontSize === 'LARGE'
          ? 20
          : 16,
    },
    cardBackground: {
      backgroundColor: settings.darkMode ? '#1E1E1E' : '#FFFFFF',
    },
    subtitleText: {
      color: settings.darkMode ? '#CCCCCC' : '#666666',
      fontSize:
        settings.fontSize === 'SMALL'
          ? 12
          : settings.fontSize === 'LARGE'
          ? 16
          : 14,
    },
  };

  const renderSettingCard = (
    icon: string,
    title: string,
    subtitle: string,
    onPress: () => void,
    rightElement?: React.ReactNode
  ) => (
    <TouchableOpacity
      style={[styles.settingCard, dynamicStyles.cardBackground]}
      onPress={onPress}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.cardTitle, dynamicStyles.text]}>{title}</Text>
          <Text style={[styles.cardSubtitle, dynamicStyles.subtitleText]}>
            {subtitle}
          </Text>
        </View>
        {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
        <Text style={[styles.arrow, dynamicStyles.text]}>›</Text>
      </View>
    </TouchableOpacity>
  );

  const renderToggleCard = (
    icon: string,
    title: string,
    subtitle: string,
    value: boolean,
    onToggle: () => void
  ) => (
    <View style={[styles.settingCard, dynamicStyles.cardBackground]}>
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.cardTitle, dynamicStyles.text]}>{title}</Text>
          <Text style={[styles.cardSubtitle, dynamicStyles.subtitleText]}>
            {subtitle}
          </Text>
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#E0E0E0', true: '#2196F3' }}
          thumbColor={value ? '#FFFFFF' : '#F4F3F4'}
        />
      </View>
    </View>
  );

  return (
    <>
      <StatusBar
        backgroundColor={settings.darkMode ? '#1976D2' : '#2196F3'}
        barStyle="light-content"
      />
      <View style={[styles.container, dynamicStyles.container]}>
        <View
          style={[styles.header, { backgroundColor: settings.darkMode ? '#1976D2' : '#2196F3' }]}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <View style={styles.backButtonContent}>
              <Text style={styles.backArrow}>‹</Text>
              <Text style={styles.backText}>Back</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Image
              source={require('../assets/images/kitchen-logo.jpg')}
              style={styles.logoImage}
            />
            <Text style={[styles.headerTitle, dynamicStyles.text]}>SETTINGS</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderToggleCard('🔔', 'NOTIFICATIONS', 'Receive alerts and updates', settings.notifications, () =>
            updateSetting('notifications', !settings.notifications)
          )}

          {renderSettingCard('🧪', 'SENSOR TEST', 'Test all sensors functionality', handleSensorTest)}

          {renderSettingCard(
            '📞',
            'ADD CAREGIVER NUMBER',
            'Set up emergency contact',
            () => {
              Alert.prompt(
                'Caregiver Phone',
                'Enter caregiver phone number:',
                (text) => updateSetting('caregiverPhone', text),
                'plain-text',
                settings.caregiverPhone
              );
            },
            <Text style={[styles.phoneNumber, dynamicStyles.subtitleText]}>
              {settings.caregiverPhone || 'Not set'}
            </Text>
          )}

          {renderSettingCard('📋', 'EMERGENCY CONTACT LIST', 'Manage emergency contacts', () =>
            Alert.alert('Emergency Contacts', 'Feature coming soon!')
          )}

          {renderSettingCard(
            'Aa',
            'FONT SIZE',
            'Adjust text size for better readability',
            handleFontSizeChange,
            <View style={styles.fontSizeBadge}>
              <Text style={styles.badgeText}>{settings.fontSize}</Text>
            </View>
          )}

          {renderToggleCard(
            settings.darkMode ? '🌙' : '☀️',
            'LIGHT/DARK MODE',
            'Switch between light and dark themes',
            settings.darkMode,
            () => updateSetting('darkMode', !settings.darkMode)
          )}

          {renderSettingCard('❓', 'HELP CENTER', 'Get support and view user manual', handleHelpCenter)}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: { flex: 1 },
  backButtonContent: { flexDirection: 'row', alignItems: 'center' },
  backArrow: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginRight: 4 },
  backText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  headerCenter: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoImage: { width: 30, height: 30, borderRadius: 15 },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', letterSpacing: 1 },
  headerSpacer: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  settingCard: {
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardContent: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: { fontSize: 20 },
  textContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, letterSpacing: 0.5 },
  cardSubtitle: { fontSize: 14, lineHeight: 20 },
  rightElement: { marginRight: 12 },
  arrow: { fontSize: 24, fontWeight: 'bold' },
  phoneNumber: { fontSize: 12, fontWeight: '600' },
  fontSizeBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sensitivityBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  sectionSpacer: { marginTop: 24, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, paddingHorizontal: 4 },
  testButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  testButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  resetButton: {
    backgroundColor: '#FF9800',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  resetButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  infoBox: {
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    marginBottom: 30,
  },
  infoTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  infoText: { fontSize: 14, marginBottom: 6, lineHeight: 20 },
});