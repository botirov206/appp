import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

interface UserListing {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  isVIP: boolean;
}

const userListings: UserListing[] = [
  {
    id: '1',
    title: 'My Cozy Studio',
    price: '$1,800/mo',
    location: 'Brooklyn',
    image: 'https://images.unsplash.com/photo-1627141234469-24711efb373c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBwcm9wZXJ0eXxlbnwwfHx8fDE3NTY4NDQyNzl8MA&ixlib=rb-4.1.0&q=85',
    isVIP: false,
  },
  {
    id: '2',
    title: 'Downtown Loft',
    price: '$3,200/mo',
    location: 'Manhattan',
    image: 'https://images.pexels.com/photos/33719021/pexels-photo-33719021.jpeg',
    isVIP: true,
  },
];

const topUpAmounts = [25, 50, 100, 200];

export default function ProfileScreen() {
  const [accountBalance, setAccountBalance] = useState(85);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showEditListingModal, setShowEditListingModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<UserListing | null>(null);
  const [listings, setListings] = useState(userListings);

  // Settings states
  const [language, setLanguage] = useState('English');
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleTopUp = (amount: number) => {
    setAccountBalance(prev => prev + amount);
    setShowTopUpModal(false);
    Alert.alert('Success', `$${amount} has been added to your account!`);
  };

  const handleSponsorToggle = (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;

    if (!listing.isVIP && accountBalance < 25) {
      Alert.alert('Insufficient Balance', 'You need at least $25 to sponsor a listing.');
      return;
    }

    if (!listing.isVIP) {
      // Activate VIP
      setAccountBalance(prev => prev - 25);
      setListings(prev => prev.map(l => 
        l.id === listingId ? { ...l, isVIP: true } : l
      ));
      Alert.alert('Success', 'Your listing is now sponsored!');
    } else {
      // Deactivate VIP
      setListings(prev => prev.map(l => 
        l.id === listingId ? { ...l, isVIP: false } : l
      ));
      Alert.alert('Success', 'VIP sponsorship removed.');
    }
  };

  const handleEditListing = (listing: UserListing) => {
    setSelectedListing(listing);
    setShowEditListingModal(true);
  };

  const renderListingCard = (listing: UserListing) => (
    <View key={listing.id} style={styles.listingCard}>
      <Image source={{ uri: listing.image }} style={styles.listingImage} />
      <View style={styles.listingContent}>
        <View style={styles.listingHeader}>
          <View style={styles.listingInfo}>
            <Text style={styles.listingTitle}>{listing.title}</Text>
            <Text style={styles.listingPrice}>{listing.price}</Text>
            <View style={styles.listingLocation}>
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <Text style={styles.locationText}>{listing.location}</Text>
            </View>
          </View>
          {listing.isVIP && (
            <View style={styles.vipBadge}>
              <Text style={styles.vipBadgeText}>VIP</Text>
            </View>
          )}
        </View>
        <View style={styles.listingActions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEditListing(listing)}
          >
            <Ionicons name="pencil-outline" size={16} color="#6B4EFF" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sponsorButton, listing.isVIP && styles.sponsorButtonActive]}
            onPress={() => handleSponsorToggle(listing.id)}
          >
            <Text style={[styles.sponsorButtonText, listing.isVIP && styles.sponsorButtonTextActive]}>
              {listing.isVIP ? 'VIP Active' : 'Sponsor ($25)'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.userInfo}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>John Doe</Text>
              <Text style={styles.userEmail}>john.doe@email.com</Text>
              <Text style={styles.memberSince}>Member since Jan 2024</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editProfileButton}>
            <Ionicons name="pencil-outline" size={20} color="#6B4EFF" />
          </TouchableOpacity>
        </View>

        {/* Account Balance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Balance</Text>
          <View style={styles.balanceCard}>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceAmount}>${accountBalance}</Text>
              <Text style={styles.balanceLabel}>Available Credits</Text>
            </View>
            <TouchableOpacity 
              style={styles.topUpButton}
              onPress={() => setShowTopUpModal(true)}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.topUpButtonText}>Top Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* My Listings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Listings ({listings.length})</Text>
          {listings.map(renderListingCard)}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => setShowSettingsModal(true)}
          >
            <Ionicons name="settings-outline" size={24} color="#6B4EFF" />
            <Text style={styles.settingsButtonText}>Settings</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Top Up Modal */}
      <Modal visible={showTopUpModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Top Up Account</Text>
              <TouchableOpacity onPress={() => setShowTopUpModal(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            <View style={styles.topUpOptions}>
              {topUpAmounts.map(amount => (
                <TouchableOpacity
                  key={amount}
                  style={styles.topUpOption}
                  onPress={() => handleTopUp(amount)}
                >
                  <Text style={styles.topUpOptionText}>${amount}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal visible={showSettingsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.settingsModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Settings</Text>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.settingsContent}>
              {/* Language */}
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Language</Text>
                <View style={styles.languageButtons}>
                  <TouchableOpacity
                    style={[styles.languageButton, language === 'English' && styles.activeLanguageButton]}
                    onPress={() => setLanguage('English')}
                  >
                    <Text style={[styles.languageButtonText, language === 'English' && styles.activeLanguageButtonText]}>
                      English
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.languageButton, language === 'Spanish' && styles.activeLanguageButton]}
                    onPress={() => setLanguage('Spanish')}
                  >
                    <Text style={[styles.languageButtonText, language === 'Spanish' && styles.activeLanguageButtonText]}>
                      Español
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Dark Mode */}
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: '#E5E7EB', true: '#6B4EFF' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* Push Notifications */}
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Switch
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                  trackColor={{ false: '#E5E7EB', true: '#6B4EFF' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* Email Alerts */}
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Email Alerts</Text>
                <Switch
                  value={emailAlerts}
                  onValueChange={setEmailAlerts}
                  trackColor={{ false: '#E5E7EB', true: '#6B4EFF' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Listing Modal */}
      <Modal visible={showEditListingModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Listing</Text>
              <TouchableOpacity onPress={() => setShowEditListingModal(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            <View style={styles.editContent}>
              <Text style={styles.editPlaceholder}>
                Edit form will be implemented here.{'\n'}
                Currently editing: {selectedListing?.title}
              </Text>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={() => {
                  setShowEditListingModal(false);
                  Alert.alert('Success', 'Listing updated successfully!');
                }}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  memberSince: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  editProfileButton: {
    padding: 8,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  balanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  balanceInfo: {
    flex: 1,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  topUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6B4EFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  topUpButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  listingCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  listingImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  listingContent: {
    flex: 1,
    padding: 12,
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  listingInfo: {
    flex: 1,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B4EFF',
    marginBottom: 4,
  },
  listingLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  vipBadge: {
    backgroundColor: '#6B4EFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  vipBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  listingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#6B4EFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  sponsorButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  sponsorButtonActive: {
    backgroundColor: '#6B4EFF',
  },
  sponsorButtonText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
  },
  sponsorButtonTextActive: {
    color: '#FFFFFF',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingsButtonText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  settingsModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  topUpOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  topUpOption: {
    backgroundColor: '#6B4EFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  topUpOptionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  settingsContent: {
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLabel: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeLanguageButton: {
    backgroundColor: '#6B4EFF',
  },
  languageButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeLanguageButtonText: {
    color: '#FFFFFF',
  },
  editContent: {
    padding: 16,
  },
  editPlaceholder: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  saveButton: {
    backgroundColor: '#6B4EFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});