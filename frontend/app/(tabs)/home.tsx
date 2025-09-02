import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with margins

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  image: string;
  type: 'rent' | 'sale';
  propertyType: string;
  isVIP: boolean;
  isQualified: boolean;
  sqft: number;
  facilities: string[];
  description: string;
}

const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    price: '$2,500/mo',
    location: 'Downtown Manhattan',
    bedrooms: 2,
    bathrooms: 1,
    image: 'https://images.unsplash.com/photo-1641910177671-4c75efb5383c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwcm9wZXJ0eXxlbnwwfHx8fDE3NTY4NDQyNzl8MA&ixlib=rb-4.1.0&q=85',
    type: 'rent',
    propertyType: 'Apartment',
    isVIP: true,
    isQualified: true,
    sqft: 1200,
    facilities: ['Gym', 'Pool', 'Parking'],
    description: 'Beautiful modern apartment in downtown Manhattan with great amenities.'
  },
  {
    id: '2',
    title: 'Luxury Penthouse',
    price: '$5,000/mo',
    location: 'Upper East Side',
    bedrooms: 3,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwwfHx8fDE3NTY4NDQyODZ8MA&ixlib=rb-4.1.0&q=85',
    type: 'rent',
    propertyType: 'Penthouse',
    isVIP: true,
    isQualified: true,
    sqft: 2500,
    facilities: ['Garden', 'Pool', 'Gym', 'Concierge'],
    description: 'Luxurious penthouse with stunning city views and premium amenities.'
  },
  {
    id: '3',
    title: 'Cozy Family House',
    price: '$450,000',
    location: 'Brooklyn Heights',
    bedrooms: 4,
    bathrooms: 3,
    image: 'https://images.unsplash.com/photo-1639663742190-1b3dba2eebcf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBwcm9wZXJ0eXxlbnwwfHx8fDE3NTY4NDQyNzl8MA&ixlib=rb-4.1.0&q=85',
    type: 'sale',
    propertyType: 'House',
    isVIP: false,
    isQualified: true,
    sqft: 2000,
    facilities: ['Garden', 'Parking', 'Fireplace'],
    description: 'Perfect family home in quiet Brooklyn neighborhood with garden.'
  },
  {
    id: '4',
    title: 'Commercial Office Space',
    price: '$8,000/mo',
    location: 'Midtown Manhattan',
    bedrooms: 0,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1612637968894-660373e23b03?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwyfHxhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwwfHx8fDE3NTY4NDQyODZ8MA&ixlib=rb-4.1.0&q=85',
    type: 'rent',
    propertyType: 'Commercial',
    isVIP: false,
    isQualified: true,
    sqft: 1500,
    facilities: ['Elevator', 'Parking', 'Security'],
    description: 'Prime commercial space in the heart of Midtown Manhattan.'
  },
  {
    id: '5',
    title: 'Studio Apartment',
    price: '$1,800/mo',
    location: 'East Village',
    bedrooms: 1,
    bathrooms: 1,
    image: 'https://images.unsplash.com/photo-1627141234469-24711efb373c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBwcm9wZXJ0eXxlbnwwfHx8fDE3NTY4NDQyNzl8MA&ixlib=rb-4.1.0&q=85',
    type: 'rent',
    propertyType: 'Apartment',
    isVIP: false,
    isQualified: false,
    sqft: 600,
    facilities: ['Laundry'],
    description: 'Cozy studio apartment in trendy East Village neighborhood.'
  },
  {
    id: '6',
    title: 'Waterfront Condo',
    price: '$750,000',
    location: 'Queens Waterfront',
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1534655610770-dd69616f05ff?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwzfHxhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwwfHx8fDE3NTY4NDQyODZ8MA&ixlib=rb-4.1.0&q=85',
    type: 'sale',
    propertyType: 'Apartment',
    isVIP: true,
    isQualified: true,
    sqft: 1400,
    facilities: ['Pool', 'Gym', 'Waterfront'],
    description: 'Beautiful waterfront condo with amazing river views.'
  },
  {
    id: '7',
    title: 'Retail Store Space',
    price: '$12,000/mo',
    location: 'SoHo',
    bedrooms: 0,
    bathrooms: 1,
    image: 'https://images.unsplash.com/photo-1624204386084-dd8c05e32226?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHw0fHxhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwwfHx8fDE3NTY4NDQyODZ8MA&ixlib=rb-4.1.0&q=85',
    type: 'rent',
    propertyType: 'Store',
    isVIP: false,
    isQualified: true,
    sqft: 800,
    facilities: ['Street Access', 'Display Windows'],
    description: 'Prime retail space in the heart of SoHo shopping district.'
  },
  {
    id: '8',
    title: 'Garden Apartment',
    price: '$3,200/mo',
    location: 'Park Slope',
    bedrooms: 3,
    bathrooms: 2,
    image: 'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg',
    type: 'rent',
    propertyType: 'Apartment',
    isVIP: false,
    isQualified: true,
    sqft: 1600,
    facilities: ['Garden', 'Parking', 'Pet Friendly'],
    description: 'Spacious apartment with private garden access in Park Slope.'
  },
  {
    id: '9',
    title: 'Loft Space',
    price: '$4,500/mo',
    location: 'Williamsburg',
    bedrooms: 2,
    bathrooms: 1,
    image: 'https://images.pexels.com/photos/33719021/pexels-photo-33719021.jpeg',
    type: 'rent',
    propertyType: 'Apartment',
    isVIP: true,
    isQualified: false,
    sqft: 1800,
    facilities: ['High Ceilings', 'Exposed Brick'],
    description: 'Industrial loft with high ceilings and exposed brick walls.'
  },
  {
    id: '10',
    title: 'Suburban House',
    price: '$650,000',
    location: 'Staten Island',
    bedrooms: 5,
    bathrooms: 3,
    image: 'https://images.pexels.com/photos/33719837/pexels-photo-33719837.jpeg',
    type: 'sale',
    propertyType: 'House',
    isVIP: false,
    isQualified: true,
    sqft: 2800,
    facilities: ['Garden', 'Garage', 'Fireplace', 'Deck'],
    description: 'Large family home with spacious backyard and modern amenities.'
  },
];

const sortOptions = [
  { label: 'Relevance (VIP First)', value: 'relevance' },
  { label: 'Price (Low to High)', value: 'priceLow' },
  { label: 'Price (High to Low)', value: 'priceHigh' },
  { label: 'Name (A-Z)', value: 'nameAZ' },
  { label: 'Date (Newest First)', value: 'dateNew' },
];

const propertyTypes = ['All', 'Apartment', 'House', 'Penthouse', 'Commercial', 'Store'];
const listingTypes = ['All', 'For Rent', 'For Sale'];
const facilities = ['Garden', 'Pool', 'Gym', 'Parking', 'Elevator', 'Concierge', 'Security', 'Laundry', 'Fireplace', 'Pet Friendly', 'High Ceilings'];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [propertyType, setPropertyType] = useState('All');
  const [listingType, setListingType] = useState('All');
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [sqftRange, setSqftRange] = useState([0, 5000]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  const notifications = [
    { id: '1', type: 'info', title: 'New Message', message: 'You have a new inquiry for Downtown Apartment', time: '2 min ago' },
    { id: '2', type: 'info', title: 'Property Updated', message: 'Your Luxury Penthouse listing has been updated', time: '1 hour ago' },
    { id: '3', type: 'warning', title: 'Low Balance', message: 'Your account balance is running low. Top up now.', time: '3 hours ago' },
  ];

  const filteredAndSortedProperties = useMemo(() => {
    let filtered = sampleProperties.filter(property => {
      // Search filter
      const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Property type filter
      const matchesPropertyType = propertyType === 'All' || property.propertyType === propertyType;
      
      // Listing type filter
      const matchesListingType = listingType === 'All' || 
                                 (listingType === 'For Rent' && property.type === 'rent') ||
                                 (listingType === 'For Sale' && property.type === 'sale');
      
      // Bedrooms filter (0 means any)
      const matchesBedrooms = bedrooms === 0 || property.bedrooms >= bedrooms;
      
      // Bathrooms filter (0 means any)
      const matchesBathrooms = bathrooms === 0 || property.bathrooms >= bathrooms;
      
      // Square feet filter
      const matchesSqft = property.sqft >= sqftRange[0] && property.sqft <= sqftRange[1];
      
      // Facilities filter
      const matchesFacilities = selectedFacilities.length === 0 || 
                               selectedFacilities.some(facility => property.facilities.includes(facility));
      
      return matchesSearch && matchesPropertyType && matchesListingType && 
             matchesBedrooms && matchesBathrooms && matchesSqft && matchesFacilities;
    });

    // Sort properties
    switch (sortBy) {
      case 'relevance':
        return filtered.sort((a, b) => {
          if (a.isVIP && !b.isVIP) return -1;
          if (!a.isVIP && b.isVIP) return 1;
          if (a.isQualified && !b.isQualified) return -1;
          if (!a.isQualified && b.isQualified) return 1;
          return 0;
        });
      case 'priceLow':
        return filtered.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[$,/mo]/g, ''));
          const priceB = parseInt(b.price.replace(/[$,/mo]/g, ''));
          return priceA - priceB;
        });
      case 'priceHigh':
        return filtered.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[$,/mo]/g, ''));
          const priceB = parseInt(b.price.replace(/[$,/mo]/g, ''));
          return priceB - priceA;
        });
      case 'nameAZ':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case 'dateNew':
        return filtered.reverse(); // Simulate newest first
      default:
        return filtered;
    }
  }, [searchQuery, sortBy, propertyType, listingType, bedrooms, bathrooms, sqftRange, selectedFacilities, priceRange]);

  const resetFilters = () => {
    setPriceRange([0, 10000]);
    setPropertyType('All');
    setListingType('All');
    setBedrooms(0);
    setBathrooms(0);
    setSqftRange([0, 5000]);
    setSelectedFacilities([]);
  };

  const toggleFacility = (facility: string) => {
    setSelectedFacilities(prev => 
      prev.includes(facility) 
        ? prev.filter(f => f !== facility)
        : [...prev, facility]
    );
  };

  const renderPropertyCard = ({ item }: { item: Property }) => (
    <TouchableOpacity style={styles.propertyCard}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.propertyImage} />
        <View style={styles.badges}>
          {item.isVIP && <View style={styles.vipBadge}><Text style={styles.badgeText}>VIP</Text></View>}
          {item.isQualified && <View style={styles.qualifiedBadge}><Ionicons name="checkmark" size={12} color="#FFFFFF" /></View>}
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.propertyTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.propertyPrice}>{item.price}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#6B7280" />
          <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
        </View>
        {(item.bedrooms > 0 || item.bathrooms > 0) && (
          <View style={styles.detailsRow}>
            {item.bedrooms > 0 && (
              <View style={styles.detailItem}>
                <Ionicons name="bed-outline" size={14} color="#6B7280" />
                <Text style={styles.detailText}>{item.bedrooms}</Text>
              </View>
            )}
            {item.bathrooms > 0 && (
              <View style={styles.detailItem}>
                <Ionicons name="water-outline" size={14} color="#6B7280" />
                <Text style={styles.detailText}>{item.bathrooms}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PropertyHub</Text>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => setShowNotifications(true)}
        >
          <Ionicons name="notifications-outline" size={24} color="#374151" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Search and Controls */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search properties..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View style={styles.controlsRow}>
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => setShowSortModal(true)}
          >
            <Text style={styles.sortText}>Sort</Text>
            <Ionicons name="chevron-down-outline" size={16} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons name="filter-outline" size={20} color="#6B4EFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Property Gallery */}
      <FlatList
        data={filteredAndSortedProperties}
        renderItem={renderPropertyCard}
        keyExtractor={item => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.galleryContainer}
        columnWrapperStyle={styles.row}
      />

      {/* Sort Modal */}
      <Modal visible={showSortModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort by</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            {sortOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                style={styles.sortOption}
                onPress={() => {
                  setSortBy(option.value);
                  setShowSortModal(false);
                }}
              >
                <Text style={[styles.sortOptionText, sortBy === option.value && styles.selectedSortText]}>
                  {option.label}
                </Text>
                {sortBy === option.value && <Ionicons name="checkmark" size={20} color="#6B4EFF" />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal visible={showFilterModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.filterModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.filterScrollView}>
              {/* Price Range */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Price Range</Text>
                <View style={styles.rangeContainer}>
                  <Text style={styles.rangeText}>${priceRange[0]} - ${priceRange[1]}</Text>
                </View>
              </View>

              {/* Property Type */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Property Type</Text>
                <View style={styles.optionsGrid}>
                  {propertyTypes.map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.optionButton, propertyType === type && styles.selectedOption]}
                      onPress={() => setPropertyType(type)}
                    >
                      <Text style={[styles.optionText, propertyType === type && styles.selectedOptionText]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Listing Type */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Listing Type</Text>
                <View style={styles.optionsGrid}>
                  {listingTypes.map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.optionButton, listingType === type && styles.selectedOption]}
                      onPress={() => setListingType(type)}
                    >
                      <Text style={[styles.optionText, listingType === type && styles.selectedOptionText]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Bedrooms & Bathrooms */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Bedrooms</Text>
                <View style={styles.stepperContainer}>
                  <TouchableOpacity 
                    style={styles.stepperButton}
                    onPress={() => setBedrooms(Math.max(0, bedrooms - 1))}
                  >
                    <Ionicons name="remove" size={20} color="#6B4EFF" />
                  </TouchableOpacity>
                  <Text style={styles.stepperValue}>{bedrooms || 'Any'}</Text>
                  <TouchableOpacity 
                    style={styles.stepperButton}
                    onPress={() => setBedrooms(bedrooms + 1)}
                  >
                    <Ionicons name="add" size={20} color="#6B4EFF" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Bathrooms</Text>
                <View style={styles.stepperContainer}>
                  <TouchableOpacity 
                    style={styles.stepperButton}
                    onPress={() => setBathrooms(Math.max(0, bathrooms - 1))}
                  >
                    <Ionicons name="remove" size={20} color="#6B4EFF" />
                  </TouchableOpacity>
                  <Text style={styles.stepperValue}>{bathrooms || 'Any'}</Text>
                  <TouchableOpacity 
                    style={styles.stepperButton}
                    onPress={() => setBathrooms(bathrooms + 1)}
                  >
                    <Ionicons name="add" size={20} color="#6B4EFF" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Facilities */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Facilities</Text>
                <View style={styles.facilitiesGrid}>
                  {facilities.map(facility => (
                    <TouchableOpacity
                      key={facility}
                      style={[
                        styles.facilityButton,
                        selectedFacilities.includes(facility) && styles.selectedFacility
                      ]}
                      onPress={() => toggleFacility(facility)}
                    >
                      <Text style={[
                        styles.facilityText,
                        selectedFacilities.includes(facility) && styles.selectedFacilityText
                      ]}>
                        {facility}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Filter Actions */}
            <View style={styles.filterActions}>
              <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyButton} 
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal visible={showNotifications} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            {notifications.map(notification => (
              <View key={notification.id} style={styles.notificationItem}>
                <View style={[
                  styles.notificationIcon,
                  { backgroundColor: notification.type === 'warning' ? '#F59E0B' : '#6B4EFF' }
                ]}>
                  <Ionicons 
                    name={notification.type === 'warning' ? 'warning' : 'information-circle'} 
                    size={16} 
                    color="#FFFFFF" 
                  />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
              </View>
            ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#111827',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sortText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 4,
  },
  filterButton: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 8,
  },
  galleryContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  propertyCard: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  propertyImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  badges: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
  },
  vipBadge: {
    backgroundColor: '#6B4EFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  qualifiedBadge: {
    backgroundColor: '#10B981',
    padding: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 12,
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B4EFF',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
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
  filterModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
    maxHeight: '90%',
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
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedSortText: {
    color: '#6B4EFF',
    fontWeight: '600',
  },
  filterScrollView: {
    flex: 1,
  },
  filterSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  rangeContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  rangeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#6B4EFF',
  },
  optionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButton: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 8,
  },
  stepperValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginHorizontal: 24,
    minWidth: 40,
    textAlign: 'center',
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  facilityButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  selectedFacility: {
    backgroundColor: '#6B4EFF',
  },
  facilityText: {
    fontSize: 12,
    color: '#6B7280',
  },
  selectedFacilityText: {
    color: '#FFFFFF',
  },
  filterActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#6B4EFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 10,
    color: '#9CA3AF',
  },
});