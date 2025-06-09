import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Type definitions
interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface SettingsState {
  notifications: boolean;
  caregiverNotifications: boolean;
  caregiverEmail: string;
  caregiverPhone: string;
  darkMode: boolean;
  fontSize: 'SMALL' | 'MEDIUM' | 'LARGE';
  emergencyContacts: EmergencyContact[];
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
    emergencyContacts: [
      {
        id: '1',
        name: 'John Doe',
        phone: '+1234567890',
        relationship: 'Son'
      },
      {
        id: '2',
        name: 'Jane Smith',
        phone: '+0987654321',
        relationship: 'Daughter'
      }
    ],
  });

  const [showCaregiverModal, setShowCaregiverModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

  // Form states for caregiver
  const [caregiverForm, setCaregiverForm] = useState({
    name: '',
    phone: settings.caregiverPhone,
    email: settings.caregiverEmail,
  });

  // Form states for emergency contact
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    relationship: '',
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

  // Caregiver functions
  const handleCaregiverSave = () => {
    if (!caregiverForm.phone.trim()) {
      Alert.alert('Error', 'Phone number is required');
      return;
    }

    updateSetting('caregiverPhone', caregiverForm.phone);
    updateSetting('caregiverEmail', caregiverForm.email);
    setShowCaregiverModal(false);
    Alert.alert('Success', 'Caregiver information updated successfully!');
  };

  const openCaregiverModal = () => {
    setCaregiverForm({
      name: '',
      phone: settings.caregiverPhone,
      email: settings.caregiverEmail,
    });
    setShowCaregiverModal(true);
  };

  // Emergency contact functions
  const handleAddContact = () => {
    if (!contactForm.name.trim() || !contactForm.phone.trim()) {
      Alert.alert('Error', 'Name and phone number are required');
      return;
    }

    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: contactForm.name,
      phone: contactForm.phone,
      relationship: contactForm.relationship || 'Other',
    };

    const updatedContacts = [...settings.emergencyContacts, newContact];
    updateSetting('emergencyContacts', updatedContacts);
    
    setContactForm({ name: '', phone: '', relationship: '' });
    setShowAddContactModal(false);
    Alert.alert('Success', 'Emergency contact added successfully!');
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setContactForm({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
    });
    setShowAddContactModal(true);
  };

  const handleUpdateContact = () => {
    if (!contactForm.name.trim() || !contactForm.phone.trim()) {
      Alert.alert('Error', 'Name and phone number are required');
      return;
    }

    if (!editingContact) return;

    const updatedContacts = settings.emergencyContacts.map(contact =>
      contact.id === editingContact.id
        ? {
            ...contact,
            name: contactForm.name,
            phone: contactForm.phone,
            relationship: contactForm.relationship || 'Other',
          }
        : contact
    );

    updateSetting('emergencyContacts', updatedContacts);
    setContactForm({ name: '', phone: '', relationship: '' });
    setEditingContact(null);
    setShowAddContactModal(false);
    Alert.alert('Success', 'Emergency contact updated successfully!');
  };

  const handleDeleteContact = (contactId: string) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this emergency contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedContacts = settings.emergencyContacts.filter(
              contact => contact.id !== contactId
            );
            updateSetting('emergencyContacts', updatedContacts);
            Alert.alert('Success', 'Emergency contact deleted successfully!');
          },
        },
      ]
    );
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
    modalBackground: {
      backgroundColor: settings.darkMode ? '#1E1E1E' : '#FFFFFF',
    },
    inputBackground: {
      backgroundColor: settings.darkMode ? '#333333' : '#F5F5F5',
    },
    inputText: {
      color: settings.darkMode ? '#FFFFFF' : '#333333',
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

  const renderEmergencyContact = (contact: EmergencyContact) => (
    <View key={contact.id} style={[styles.contactCard, dynamicStyles.cardBackground]}>
      <View style={styles.contactInfo}>
        <Text style={[styles.contactName, dynamicStyles.text]}>{contact.name}</Text>
        <Text style={[styles.contactPhone, dynamicStyles.subtitleText]}>{contact.phone}</Text>
        <Text style={[styles.contactRelation, dynamicStyles.subtitleText]}>
          {contact.relationship}
        </Text>
      </View>
      <View style={styles.contactActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditContact(contact)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteContact(contact.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
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
            'Set up primary caregiver contact',
            openCaregiverModal,
            <Text style={[styles.phoneNumber, dynamicStyles.subtitleText]}>
              {settings.caregiverPhone || 'Not set'}
            </Text>
          )}

          {renderSettingCard(
            '📋',
            'EMERGENCY CONTACT LIST',
            `Manage emergency contacts (${settings.emergencyContacts.length} contacts)`,
            () => setShowEmergencyModal(true)
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

        {/* Caregiver Modal */}
        <Modal
          visible={showCaregiverModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowCaregiverModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, dynamicStyles.modalBackground]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, dynamicStyles.text]}>
                  Caregiver Information
                </Text>
                <TouchableOpacity onPress={() => setShowCaregiverModal(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, dynamicStyles.text]}>Name (Optional)</Text>
                <TextInput
                  style={[styles.input, dynamicStyles.inputBackground, dynamicStyles.inputText]}
                  value={caregiverForm.name}
                  onChangeText={(text) => setCaregiverForm({...caregiverForm, name: text})}
                  placeholder="Enter caregiver name"
                  placeholderTextColor={settings.darkMode ? '#888' : '#999'}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, dynamicStyles.text]}>Phone Number *</Text>
                <TextInput
                  style={[styles.input, dynamicStyles.inputBackground, dynamicStyles.inputText]}
                  value={caregiverForm.phone}
                  onChangeText={(text) => setCaregiverForm({...caregiverForm, phone: text})}
                  placeholder="Enter phone number"
                  placeholderTextColor={settings.darkMode ? '#888' : '#999'}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, dynamicStyles.text]}>Email (Optional)</Text>
                <TextInput
                  style={[styles.input, dynamicStyles.inputBackground, dynamicStyles.inputText]}
                  value={caregiverForm.email}
                  onChangeText={(text) => setCaregiverForm({...caregiverForm, email: text})}
                  placeholder="Enter email address"
                  placeholderTextColor={settings.darkMode ? '#888' : '#999'}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowCaregiverModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleCaregiverSave}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Emergency Contacts Modal */}
        <Modal
          visible={showEmergencyModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowEmergencyModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, styles.emergencyModalContent, dynamicStyles.modalBackground]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, dynamicStyles.text]}>
                  Emergency Contacts
                </Text>
                <TouchableOpacity onPress={() => setShowEmergencyModal(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.contactsList}>
                {settings.emergencyContacts.map(renderEmergencyContact)}
              </ScrollView>

              <TouchableOpacity
                style={styles.addContactButton}
                onPress={() => {
                  setEditingContact(null);
                  setContactForm({ name: '', phone: '', relationship: '' });
                  setShowAddContactModal(true);
                }}
              >
                <Text style={styles.addContactButtonText}>+ Add New Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Add/Edit Contact Modal */}
        <Modal
          visible={showAddContactModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setShowAddContactModal(false);
            setEditingContact(null);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, dynamicStyles.modalBackground]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, dynamicStyles.text]}>
                  {editingContact ? 'Edit Contact' : 'Add New Contact'}
                </Text>
                <TouchableOpacity onPress={() => {
                  setShowAddContactModal(false);
                  setEditingContact(null);
                }}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, dynamicStyles.text]}>Name *</Text>
                <TextInput
                  style={[styles.input, dynamicStyles.inputBackground, dynamicStyles.inputText]}
                  value={contactForm.name}
                  onChangeText={(text) => setContactForm({...contactForm, name: text})}
                  placeholder="Enter contact name"
                  placeholderTextColor={settings.darkMode ? '#888' : '#999'}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, dynamicStyles.text]}>Phone Number *</Text>
                <TextInput
                  style={[styles.input, dynamicStyles.inputBackground, dynamicStyles.inputText]}
                  value={contactForm.phone}
                  onChangeText={(text) => setContactForm({...contactForm, phone: text})}
                  placeholder="Enter phone number"
                  placeholderTextColor={settings.darkMode ? '#888' : '#999'}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, dynamicStyles.text]}>Relationship</Text>
                <TextInput
                  style={[styles.input, dynamicStyles.inputBackground, dynamicStyles.inputText]}
                  value={contactForm.relationship}
                  onChangeText={(text) => setContactForm({...contactForm, relationship: text})}
                  placeholder="e.g., Son, Daughter, Friend"
                  placeholderTextColor={settings.darkMode ? '#888' : '#999'}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowAddContactModal(false);
                    setEditingContact(null);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={editingContact ? handleUpdateContact : handleAddContact}
                >
                  <Text style={styles.saveButtonText}>
                    {editingContact ? 'Update' : 'Add'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  badgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emergencyModalContent: {
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    padding: 5,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Emergency contacts styles
  contactsList: {
    maxHeight: 300,
  },
  contactCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    marginBottom: 2,
  },
  contactRelation: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  addContactButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  addContactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});