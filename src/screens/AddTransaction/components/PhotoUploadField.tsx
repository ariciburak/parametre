import React, { useState } from 'react'
import { View, StyleSheet, Pressable, TextInput, Modal, Alert, Image, Platform } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { colors, spacing } from '../../../theme'
import { Text } from '../../../components/common/Text'

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

const styles = StyleSheet.create({
  dateField: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    ...Platform.select({
      ios: {
        shadowColor: colors.grey[500],
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  fieldContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 20,
    minHeight: 56,
  },
  fieldLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fieldRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    minWidth: 40,
  },
  fieldLabel: {
    fontSize: 15,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  photoThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.grey[200],
    left: -8,
  },
  photoInputLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  photoDescriptionInput: {
    fontSize: 15,
    color: colors.text.primary,
    padding: spacing.xs,
    minWidth: 150,
    maxWidth: '70%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.common.white,
    borderRadius: 16,
    width: '85%',
    padding: spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  modalCloseButton: {
    padding: 4,
  },
  photoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  photoOptionText: {
    fontSize: 16,
    color: colors.text.primary,
  },
}) 