import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';

const propertyTypes = ['Apartment', 'House', 'Penthouse', 'Commercial', 'Store', 'Land'];
const facilities = ['Garden', 'Pool', 'Gym', 'Parking', 'Elevator', 'Concierge', 'Security', 'Laundry', 'Fireplace', 'Pet Friendly', 'High Ceilings', 'Balcony'];

interface FormData {
  listingType: 'rent' | 'sale' | '';
  propertyType: string;
  title: string;
  description: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  sqft: string;
  facilities: string[];
  images: string[];
  isQualified: boolean;
  sponsor: boolean;
}

export default function AddListingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    listingType: '',
    propertyType: '',
    title: '',
    description: '',
    location: '',
    price: '',
    bedrooms: 0,
    bathrooms: 0,
    sqft: '',
    facilities: [],
    images: [],
    isQualified: false,
    sponsor: false,
  });

  const steps = [
    'Listing Type',
    'Property Type',
    'Details',
    'Photos',
    'Options'
  ];

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to upload images!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => 
        asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri
      );
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
    setShowImageOptions(false);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera permissions to take photos!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const newImage = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage]
      }));
    }
    setShowImageOptions(false);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const toggleFacility = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        return formData.listingType !== '';
      case 1:
        return formData.propertyType !== '';
      case 2:
        return formData.title && formData.description && formData.location && formData.price;
      case 3:
        return formData.images.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        submitListing();
      }
    } else {
      Alert.alert('Incomplete', 'Please fill in all required fields before proceeding.');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitListing = () => {
    Alert.alert(
      'Success!',
      'Your property listing has been created successfully and will be reviewed before going live.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setFormData({
              listingType: '',
              propertyType: '',
              title: '',
              description: '',
              location: '',
              price: '',
              bedrooms: 0,
              bathrooms: 0,
              sqft: '',
              facilities: [],
              images: [],
              isQualified: false,
              sponsor: false,
            });
            setCurrentStep(0);
          }
        }
      ]
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What type of listing is this?</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[styles.optionCard, formData.listingType === 'rent' && styles.selectedOption]}
                onPress={() => setFormData(prev => ({ ...prev, listingType: 'rent' }))}
              >
                <Ionicons name="home-outline" size={32} color={formData.listingType === 'rent' ? '#FFFFFF' : '#6B4EFF'} />
                <Text style={[styles.optionTitle, formData.listingType === 'rent' && styles.selectedOptionText]}>
                  For Rent
                </Text>
                <Text style={[styles.optionSubtitle, formData.listingType === 'rent' && styles.selectedOptionText]}>
                  Monthly rental property
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionCard, formData.listingType === 'sale' && styles.selectedOption]}
                onPress={() => setFormData(prev => ({ ...prev, listingType: 'sale' }))}
              >
                <Ionicons name="pricetag-outline" size={32} color={formData.listingType === 'sale' ? '#FFFFFF' : '#6B4EFF'} />
                <Text style={[styles.optionTitle, formData.listingType === 'sale' && styles.selectedOptionText]}>
                  For Sale
                </Text>
                <Text style={[styles.optionSubtitle, formData.listingType === 'sale' && styles.selectedOptionText]}>
                  Property for purchase
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What type of property is this?</Text>
            <View style={styles.propertyTypesGrid}>
              {propertyTypes.map(type => (
                <TouchableOpacity
                  key={type}
                  style={[styles.propertyTypeButton, formData.propertyType === type && styles.selectedPropertyType]}
                  onPress={() => setFormData(prev => ({ ...prev, propertyType: type }))}
                >
                  <Text style={[styles.propertyTypeText, formData.propertyType === type && styles.selectedPropertyTypeText]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Property Details</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Property Title *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., Modern Downtown Apartment"
                  value={formData.title}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description *</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  placeholder="Describe your property..."
                  value={formData.description}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Location *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., Downtown Manhattan, NYC"
                  value={formData.location}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Price * {formData.listingType === 'rent' ? '(per month)' : ''}
                </Text>
                <TextInput
                  style={styles.formInput}
                  placeholder={formData.listingType === 'rent' ? '$2,500' : '$450,000'}
                  value={formData.price}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formRow}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Bedrooms</Text>
                  <View style={styles.stepperContainer}>
                    <TouchableOpacity 
                      style={styles.stepperButton}
                      onPress={() => setFormData(prev => ({ ...prev, bedrooms: Math.max(0, prev.bedrooms - 1) }))}
                    >
                      <Ionicons name="remove" size={20} color="#6B4EFF" />
                    </TouchableOpacity>
                    <Text style={styles.stepperValue}>{formData.bedrooms}</Text>
                    <TouchableOpacity 
                      style={styles.stepperButton}
                      onPress={() => setFormData(prev => ({ ...prev, bedrooms: prev.bedrooms + 1 }))}
                    >
                      <Ionicons name="add" size={20} color="#6B4EFF" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Bathrooms</Text>
                  <View style={styles.stepperContainer}>
                    <TouchableOpacity 
                      style={styles.stepperButton}
                      onPress={() => setFormData(prev => ({ ...prev, bathrooms: Math.max(0, prev.bathrooms - 1) }))}
                    >
                      <Ionicons name="remove" size={20} color="#6B4EFF" />
                    </TouchableOpacity>
                    <Text style={styles.stepperValue}>{formData.bathrooms}</Text>
                    <TouchableOpacity 
                      style={styles.stepperButton}
                      onPress={() => setFormData(prev => ({ ...prev, bathrooms: prev.bathrooms + 1 }))}
                    >
                      <Ionicons name="add" size={20} color="#6B4EFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Square Feet</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., 1200"
                  value={formData.sqft}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, sqft: text }))}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Facilities</Text>
                <View style={styles.facilitiesGrid}>
                  {facilities.map(facility => (
                    <TouchableOpacity
                      key={facility}
                      style={[
                        styles.facilityChip,
                        formData.facilities.includes(facility) && styles.selectedFacility
                      ]}
                      onPress={() => toggleFacility(facility)}
                    >
                      <Text style={[
                        styles.facilityText,
                        formData.facilities.includes(facility) && styles.selectedFacilityText
                      ]}>
                        {facility}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Add Photos</Text>
            <Text style={styles.stepSubtitle}>Add at least one photo of your property</Text>
            
            <TouchableOpacity 
              style={styles.addPhotoButton}
              onPress={() => setShowImageOptions(true)}
            >
              <Ionicons name="camera-outline" size={32} color="#6B4EFF" />
              <Text style={styles.addPhotoText}>Add Photos</Text>
            </TouchableOpacity>

            {formData.images.length > 0 && (
              <View style={styles.imageGrid}>
                {formData.images.map((image, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.previewImage} />
                    <TouchableOpacity 
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Ionicons name="close" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Listing Options</Text>
            
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setFormData(prev => ({ ...prev, isQualified: !prev.isQualified }))}
            >
              <View style={[styles.checkbox, formData.isQualified && styles.checkedCheckbox]}>
                {formData.isQualified && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </View>
              <View style={styles.checkboxContent}>
                <Text style={styles.checkboxTitle}>Qualified Listing</Text>
                <Text style={styles.checkboxSubtitle}>Add a verified badge to your listing</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setFormData(prev => ({ ...prev, sponsor: !prev.sponsor }))}
            >
              <View style={[styles.checkbox, formData.sponsor && styles.checkedCheckbox]}>
                {formData.sponsor && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </View>
              <View style={styles.checkboxContent}>
                <Text style={styles.checkboxTitle}>Sponsor Listing ($25)</Text>
                <Text style={styles.checkboxSubtitle}>Get VIP placement and higher visibility</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Listing Summary</Text>
              <Text style={styles.summaryText}>Type: {formData.listingType} • {formData.propertyType}</Text>
              <Text style={styles.summaryText}>Title: {formData.title}</Text>
              <Text style={styles.summaryText}>Price: {formData.price}</Text>
              <Text style={styles.summaryText}>Location: {formData.location}</Text>
              <Text style={styles.summaryText}>Photos: {formData.images.length}</Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Listing</Text>
        </View>

        {/* Progress Steps */}
        <View style={styles.progressContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.progressStep}>
              <View style={[
                styles.progressCircle,
                index <= currentStep && styles.activeProgressCircle
              ]}>
                <Text style={[
                  styles.progressNumber,
                  index <= currentStep && styles.activeProgressNumber
                ]}>
                  {index + 1}
                </Text>
              </View>
              <Text style={[
                styles.progressLabel,
                index === currentStep && styles.activeProgressLabel
              ]}>
                {step}
              </Text>
            </View>
          ))}
        </View>

        {/* Step Content */}
        <View style={styles.contentContainer}>
          {renderStepContent()}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentStep > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={prevStep}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.nextButton, currentStep === 0 && styles.fullWidthButton]}
            onPress={nextStep}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === steps.length - 1 ? 'Submit Listing' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Image Options Modal */}
        <Modal visible={showImageOptions} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.imageOptionsModal}>
              <Text style={styles.imageOptionsTitle}>Add Photo</Text>
              <TouchableOpacity style={styles.imageOptionButton} onPress={takePhoto}>
                <Ionicons name="camera-outline" size={24} color="#6B4EFF" />
                <Text style={styles.imageOptionText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageOptionButton} onPress={pickImageFromGallery}>
                <Ionicons name="images-outline" size={24} color="#6B4EFF" />
                <Text style={styles.imageOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowImageOptions(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
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
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#F8FAFC',
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  progressCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeProgressCircle: {
    backgroundColor: '#6B4EFF',
  },
  progressNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeProgressNumber: {
    color: '#FFFFFF',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  activeProgressLabel: {
    color: '#6B4EFF',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  stepContent: {
    flex: 1,
    paddingVertical: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#F8FAFC',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    backgroundColor: '#6B4EFF',
    borderColor: '#6B4EFF',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 12,
    marginBottom: 4,
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  propertyTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  propertyTypeButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    minWidth: '45%',
    alignItems: 'center',
  },
  selectedPropertyType: {
    backgroundColor: '#6B4EFF',
  },
  propertyTypeText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedPropertyTypeText: {
    color: '#FFFFFF',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButton: {
    backgroundColor: '#E5E7EB',
    padding: 8,
    borderRadius: 8,
  },
  stepperValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginHorizontal: 20,
    minWidth: 40,
    textAlign: 'center',
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  facilityChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
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
  addPhotoButton: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  addPhotoText: {
    fontSize: 16,
    color: '#6B4EFF',
    fontWeight: '600',
    marginTop: 8,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkedCheckbox: {
    backgroundColor: '#6B4EFF',
    borderColor: '#6B4EFF',
  },
  checkboxContent: {
    flex: 1,
  },
  checkboxTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  checkboxSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  navigationContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  backButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#6B4EFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  fullWidthButton: {
    flex: 1,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  imageOptionsModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  imageOptionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  imageOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  imageOptionText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
});