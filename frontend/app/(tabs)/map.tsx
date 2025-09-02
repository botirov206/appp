import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

// Mock map background image - using a static map image
const MAP_IMAGE = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2088&q=80';

const mapProperties = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    price: '$2,500/mo',
    location: 'Downtown Manhattan',
    top: '25%',
    left: '60%',
  },
  {
    id: '2',
    title: 'Luxury Penthouse',
    price: '$5,000/mo',
    location: 'Upper East Side',
    top: '15%',
    left: '65%',
  },
  {
    id: '3',
    title: 'Cozy Family House',
    price: '$450,000',
    location: 'Brooklyn Heights',
    top: '45%',
    left: '70%',
  },
  {
    id: '4',
    title: 'Commercial Office Space',
    price: '$8,000/mo',
    location: 'Midtown Manhattan',
    top: '30%',
    left: '55%',
  },
];

export default function MapScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const filteredProperties = mapProperties.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPropertyPin = (property: any) => (
    <TouchableOpacity
      key={property.id}
      style={[
        styles.propertyPin,
        { top: property.top, left: property.left }
      ]}
      onPress={() => setSelectedProperty(property)}
    >
      <View style={styles.pinIcon}>
        <Ionicons name="location" size={20} color="#6B4EFF" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Map Background */}
      <View style={styles.mapContainer}>
        <Image source={{ uri: MAP_IMAGE }} style={styles.mapBackground} />
        
        {/* Property Pins */}
        {filteredProperties.map(renderPropertyPin)}
        
        {/* Search Overlay */}
        <View style={styles.searchOverlay}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search-outline" size={20} color="#6B7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search locations..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilterModal(true)}
            >
              <Ionicons name="filter-outline" size={20} color="#6B4EFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Properties List at Bottom */}
        <View style={styles.propertiesListContainer}>
          <Text style={styles.listTitle}>Properties in View ({filteredProperties.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filteredProperties.map(property => (
              <TouchableOpacity 
                key={property.id}
                style={styles.propertyCard}
                onPress={() => setSelectedProperty(property)}
              >
                <Text style={styles.cardTitle} numberOfLines={1}>{property.title}</Text>
                <Text style={styles.cardPrice}>{property.price}</Text>
                <Text style={styles.cardLocation} numberOfLines={1}>{property.location}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Property Detail Modal */}
      <Modal visible={!!selectedProperty} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Property Details</Text>
              <TouchableOpacity onPress={() => setSelectedProperty(null)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            {selectedProperty && (
              <View style={styles.propertyDetails}>
                <Text style={styles.detailTitle}>{selectedProperty.title}</Text>
                <Text style={styles.detailPrice}>{selectedProperty.price}</Text>
                <View style={styles.detailLocation}>
                  <Ionicons name="location-outline" size={16} color="#6B7280" />
                  <Text style={styles.detailLocationText}>{selectedProperty.location}</Text>
                </View>
                <TouchableOpacity style={styles.contactButton}>
                  <Text style={styles.contactButtonText}>Contact Agent</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal visible={showFilterModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Map Filters</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            <View style={styles.filterContent}>
              <Text style={styles.filterPlaceholder}>
                Map filters will be implemented here.{'\n'}
                Same filtering options as home screen.
              </Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapBackground: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  propertyPin: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinIcon: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  searchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertiesListContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingBottom: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  propertyCard: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginLeft: 16,
    width: 150,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B4EFF',
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 10,
    color: '#6B7280',
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
    maxHeight: '60%',
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
  propertyDetails: {
    padding: 16,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  detailPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B4EFF',
    marginBottom: 12,
  },
  detailLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  detailLocationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  contactButton: {
    backgroundColor: '#6B4EFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  filterContent: {
    padding: 16,
  },
  filterPlaceholder: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  applyButton: {
    backgroundColor: '#6B4EFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});