import React, { useState } from 'react'
import { View, Pressable, TextInput, Modal, Alert, Image, Platform } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { colors } from '../../../theme'
import { Text } from '../../../components/common/Text'
import { styles } from './PhotoUploadField.styles'

interface PhotoUploadFieldProps {
  photo?: {
    uri: string
    type: string
    name: string
  }
  photoDescription?: string
  onPhotoChange: (photo?: { uri: string; type: string; name: string }) => void
  onPhotoDescriptionChange: (description: string) => void
}

export const PhotoUploadField = ({
  photo,
  photoDescription = '',
  onPhotoChange,
  onPhotoDescriptionChange,
}: PhotoUploadFieldProps) => {
  const [showPhotoModal, setShowPhotoModal] = useState(false)

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      
      if (status !== 'granted') {
        Alert.alert(
          'İzin Gerekli',
          'Kamerayı kullanabilmek için izin vermeniz gerekiyor.'
        )
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      })

      if (!result.canceled) {
        const asset = result.assets[0]
        onPhotoChange({
          uri: asset.uri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        })
      }
    } catch (error) {
      Alert.alert('Hata', 'Fotoğraf çekilirken bir hata oluştu.')
    }
    setShowPhotoModal(false)
  }

  const handleChoosePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      
      if (status !== 'granted') {
        Alert.alert(
          'İzin Gerekli',
          'Galeriyi kullanabilmek için izin vermeniz gerekiyor.'
        )
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      })

      if (!result.canceled) {
        const asset = result.assets[0]
        const filename = asset.uri.split('/').pop() || 'photo.jpg'
        onPhotoChange({
          uri: asset.uri,
          type: 'image/jpeg',
          name: filename,
        })
      }
    } catch (error) {
      Alert.alert('Hata', 'Fotoğraf seçilirken bir hata oluştu.')
    }
    setShowPhotoModal(false)
  }

  return (
    <>
      <Pressable 
        style={styles.dateField}
        onPress={() => setShowPhotoModal(true)}
        android_ripple={{ color: colors.grey[200] }}
      >
        <View style={styles.fieldContent}>
          <View style={styles.fieldLeft}>
            {photo ? (
              <>
                <Image 
                  source={{ uri: photo.uri }}
                  style={styles.photoThumbnail}
                />
                <View>
                  <Text style={styles.photoInputLabel}>Fotoğraf Açıklaması</Text>
                  <TextInput
                    style={styles.photoDescriptionInput}
                    value={photoDescription}
                    onChangeText={onPhotoDescriptionChange}
                    placeholder="Ne fotoğrafı?"
                    placeholderTextColor={colors.grey[400]}
                    onPressIn={(e) => e.stopPropagation()}
                  />
                </View>
              </>
            ) : (
              <>
                <MaterialCommunityIcons 
                  name="camera-outline" 
                  size={22} 
                  color={colors.text.secondary} 
                />
                <Text style={styles.fieldLabel}>Fotoğraf</Text>
              </>
            )}
          </View>
          <View style={styles.fieldRight}>
            {photo ? (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation()
                  onPhotoChange(undefined)
                  onPhotoDescriptionChange('')
                }}
                hitSlop={8}
              >
                <MaterialCommunityIcons 
                  name="close" 
                  size={20} 
                  color={colors.text.secondary} 
                />
              </Pressable>
            ) : (
              <Text style={[styles.fieldLabel, { color: colors.grey[400] }]}>
                Fotoğraf Ekle
              </Text>
            )}
          </View>
        </View>
      </Pressable>

      <Modal
        visible={showPhotoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowPhotoModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Fotoğraf Seç</Text>
              <Pressable 
                style={styles.modalCloseButton}
                onPress={() => setShowPhotoModal(false)}
              >
                <MaterialCommunityIcons 
                  name="close" 
                  size={24} 
                  color={colors.text.primary} 
                />
              </Pressable>
            </View>

            <Pressable 
              style={styles.photoOption}
              onPress={handleTakePhoto}
            >
              <MaterialCommunityIcons 
                name="camera" 
                size={24} 
                color={colors.text.primary} 
              />
              <Text style={styles.photoOptionText}>Fotoğraf Çek</Text>
            </Pressable>

            <Pressable 
              style={styles.photoOption}
              onPress={handleChoosePhoto}
            >
              <MaterialCommunityIcons 
                name="image" 
                size={24} 
                color={colors.text.primary} 
              />
              <Text style={styles.photoOptionText}>Galeriden Seç</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  )
} 