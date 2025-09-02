import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { handleApiResponse, handleNetworkError, showBookAlerts } from '../utils/alertUtils';
import { getBooksUrl } from '../config/api';
import { Ionicons } from '@expo/vector-icons';

const BookForm = () => {
  const { mode, bookId } = useLocalSearchParams(); // mode: 'create' or 'edit'
  const router = useRouter();
  const { theme } = useTheme();
  const { authenticatedFetch } = useAuth();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    year: '',
    price: '',
    available: true
  });

  const [errors, setErrors] = useState({});
  const [genres, setGenres] = useState([]);

  const isEditMode = mode === 'edit';

  useEffect(() => {
    fetchGenres();
    if (isEditMode && bookId) {
      fetchBookData();
    }
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await authenticatedFetch(getBooksUrl('GENRES'));
      const data = await response.json();
      if (response.ok) {
        setGenres(data.genres || []);
      }
    } catch (error) {
      console.log('Error fetching genres:', error);
    }
  };

  const fetchBookData = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch(getBooksUrl('GET_BY_ID', bookId));
      const data = await response.json();
      
      const result = handleApiResponse(response, data, {
        successTitle: "โหลดข้อมูลสำเร็จ",
        errorTitle: "โหลดข้อมูลไม่สำเร็จ",
        showSuccessMessage: false
      });

      if (result.success && data.book) {
        const book = data.book;
        setFormData({
          title: book.title || '',
          author: book.author || '',
          description: book.description || '',
          genre: book.genre || '',
          year: book.year ? book.year.toString() : '',
          price: book.price !== undefined && book.price !== null ? book.price.toString() : '',
          available: book.available !== undefined ? book.available : true
        });
      }
    } catch (error) {
      if (error.name === 'TypeError' || error.name === 'AbortError') {
        handleNetworkError(error, fetchBookData);
      } else {
        console.error("Error fetching book data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'กรุณาใส่ชื่อหนังสือ';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'กรุณาใส่ชื่อผู้แต่ง';
    }

    if (formData.year && (isNaN(formData.year) || parseInt(formData.year) < 1000 || parseInt(formData.year) > new Date().getFullYear())) {
      newErrors.year = 'กรุณาใส่ปีที่ถูกต้อง';
    }

    if (formData.price && (isNaN(formData.price) || parseFloat(formData.price) < 0)) {
      newErrors.price = 'กรุณาใส่ราคาที่ถูกต้อง';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      // Prepare data for API
      const bookData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        description: formData.description.trim(),
        genre: formData.genre.trim(),
        available: formData.available
      };

      if (formData.year) {
        bookData.year = parseInt(formData.year);
      }

      if (formData.price) {
        bookData.price = parseFloat(formData.price);
      }

      const url = isEditMode 
        ? getBooksUrl('UPDATE', bookId)
        : getBooksUrl('CREATE');

      const options = {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData)
      };

      const response = await authenticatedFetch(url, options);
      const data = await response.json();

      const result = handleApiResponse(response, data, {
        successTitle: isEditMode ? "แก้ไขหนังสือสำเร็จ" : "สร้างหนังสือสำเร็จ",
        errorTitle: isEditMode ? "แก้ไขหนังสือไม่สำเร็จ" : "สร้างหนังสือไม่สำเร็จ",
        showSuccessMessage: true
      });

      if (result.success) {
        if (isEditMode) {
          showBookAlerts.updateSuccess(formData.title);
        } else {
          showBookAlerts.createSuccess(formData.title);
        }
        router.back();
      }
    } catch (error) {
      if (error.name === 'TypeError' || error.name === 'AbortError') {
        handleNetworkError(error, handleSave);
      } else {
        console.error("Error saving book:", error);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "ยกเลิกการแก้ไข",
      "คุณต้องการยกเลิกการแก้ไขหรือไม่? ข้อมูลที่แก้ไขจะหายไป",
      [
        {
          text: "ยกเลิก",
          style: "cancel"
        },
        {
          text: "ตกลง",
          onPress: () => router.back()
        }
      ]
    );
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: theme.cardBackground,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    backButton: {
      padding: 5,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      flex: 1,
      textAlign: 'center',
      marginHorizontal: 10,
    },
    saveButton: {
      backgroundColor: theme.secondary,
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    saveButtonDisabled: {
      backgroundColor: theme.textSecondary,
      opacity: 0.5,
    },
    saveButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    formContainer: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
    },
    formGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    requiredLabel: {
      color: '#e74c3c',
    },
    input: {
      backgroundColor: theme.cardBackground,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 12,
      fontSize: 16,
      color: theme.text,
      minHeight: 48,
    },
    inputError: {
      borderColor: '#e74c3c',
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    errorText: {
      color: '#e74c3c',
      fontSize: 12,
      marginTop: 5,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.cardBackground,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 12,
    },
    switchLabel: {
      fontSize: 16,
      color: theme.text,
      flex: 1,
    },
    switchSubLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
    genreContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 8,
    },
    genreChip: {
      backgroundColor: theme.border,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: theme.border,
    },
    genreChipSelected: {
      backgroundColor: theme.secondary,
      borderColor: theme.secondary,
    },
    genreChipText: {
      fontSize: 12,
      color: theme.text,
    },
    genreChipTextSelected: {
      color: '#fff',
      fontWeight: 'bold',
    },
    bottomActions: {
      padding: 20,
      backgroundColor: theme.cardBackground,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 15,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: theme.textSecondary,
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
    },
    saveButtonBottom: {
      flex: 1,
      backgroundColor: theme.secondary,
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  if (loading) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.secondary} />
        <Text style={[dynamicStyles.switchLabel, { marginTop: 10, textAlign: 'center' }]}>
          กำลังโหลดข้อมูล...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={dynamicStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={dynamicStyles.header}>
        <TouchableOpacity 
          style={dynamicStyles.backButton}
          onPress={handleCancel}
        >
          <Ionicons name="close" size={24} color={theme.text} />
        </TouchableOpacity>
        
        <Text style={dynamicStyles.headerTitle}>
          {isEditMode ? 'แก้ไขหนังสือ' : 'เพิ่มหนังสือใหม่'}
        </Text>

        <TouchableOpacity 
          style={[
            dynamicStyles.saveButton, 
            saving && dynamicStyles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="checkmark" size={16} color="#fff" />
          )}
          <Text style={dynamicStyles.saveButtonText}>
            {saving ? 'กำลังบันทึก...' : 'บันทึก'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={dynamicStyles.formContainer}>
        <ScrollView style={dynamicStyles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Title */}
          <View style={dynamicStyles.formGroup}>
            <Text style={dynamicStyles.label}>
              ชื่อหนังสือ <Text style={dynamicStyles.requiredLabel}>*</Text>
            </Text>
            <TextInput
              style={[
                dynamicStyles.input,
                errors.title && dynamicStyles.inputError
              ]}
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              placeholder="ใส่ชื่อหนังสือ"
              placeholderTextColor={theme.textSecondary}
              maxLength={200}
            />
            {errors.title && <Text style={dynamicStyles.errorText}>{errors.title}</Text>}
          </View>

          {/* Author */}
          <View style={dynamicStyles.formGroup}>
            <Text style={dynamicStyles.label}>
              ชื่อผู้แต่ง <Text style={dynamicStyles.requiredLabel}>*</Text>
            </Text>
            <TextInput
              style={[
                dynamicStyles.input,
                errors.author && dynamicStyles.inputError
              ]}
              value={formData.author}
              onChangeText={(text) => setFormData(prev => ({ ...prev, author: text }))}
              placeholder="ใส่ชื่อผู้แต่ง"
              placeholderTextColor={theme.textSecondary}
              maxLength={100}
            />
            {errors.author && <Text style={dynamicStyles.errorText}>{errors.author}</Text>}
          </View>

          {/* Description */}
          <View style={dynamicStyles.formGroup}>
            <Text style={dynamicStyles.label}>รายละเอียด</Text>
            <TextInput
              style={[dynamicStyles.input, dynamicStyles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="ใส่รายละเอียดหนังสือ"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
              maxLength={1000}
            />
          </View>

          {/* Genre */}
          <View style={dynamicStyles.formGroup}>
            <Text style={dynamicStyles.label}>หมวดหมู่</Text>
            <TextInput
              style={dynamicStyles.input}
              value={formData.genre}
              onChangeText={(text) => setFormData(prev => ({ ...prev, genre: text }))}
              placeholder="ใส่หมวดหมู่หนังสือ"
              placeholderTextColor={theme.textSecondary}
              maxLength={50}
            />
            {genres.length > 0 && (
              <View style={dynamicStyles.genreContainer}>
                {genres.map((genre, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      dynamicStyles.genreChip,
                      formData.genre === genre && dynamicStyles.genreChipSelected
                    ]}
                    onPress={() => setFormData(prev => ({ 
                      ...prev, 
                      genre: prev.genre === genre ? '' : genre 
                    }))}
                  >
                    <Text style={[
                      dynamicStyles.genreChipText,
                      formData.genre === genre && dynamicStyles.genreChipTextSelected
                    ]}>
                      {genre}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Year */}
          <View style={dynamicStyles.formGroup}>
            <Text style={dynamicStyles.label}>ปีที่ตีพิมพ์</Text>
            <TextInput
              style={[
                dynamicStyles.input,
                errors.year && dynamicStyles.inputError
              ]}
              value={formData.year}
              onChangeText={(text) => setFormData(prev => ({ ...prev, year: text }))}
              placeholder="เช่น 2024"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
              maxLength={4}
            />
            {errors.year && <Text style={dynamicStyles.errorText}>{errors.year}</Text>}
          </View>

          {/* Price */}
          <View style={dynamicStyles.formGroup}>
            <Text style={dynamicStyles.label}>ราคา (บาท)</Text>
            <TextInput
              style={[
                dynamicStyles.input,
                errors.price && dynamicStyles.inputError
              ]}
              value={formData.price}
              onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
              placeholder="ใส่ราคา หรือใส่ 0 สำหรับฟรี"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
            />
            {errors.price && <Text style={dynamicStyles.errorText}>{errors.price}</Text>}
          </View>

          {/* Available */}
          <View style={dynamicStyles.formGroup}>
            <View style={dynamicStyles.switchContainer}>
              <View style={{ flex: 1 }}>
                <Text style={dynamicStyles.switchLabel}>สถานะสินค้า</Text>
                <Text style={dynamicStyles.switchSubLabel}>
                  {formData.available ? 'มีสินค้า' : 'หมดสินค้า'}
                </Text>
              </View>
              <Switch
                value={formData.available}
                onValueChange={(value) => setFormData(prev => ({ ...prev, available: value }))}
                trackColor={{ false: '#767577', true: theme.secondary }}
                thumbColor={formData.available ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={dynamicStyles.bottomActions}>
          <View style={dynamicStyles.actionButtons}>
            <TouchableOpacity 
              style={dynamicStyles.cancelButton}
              onPress={handleCancel}
            >
              <Ionicons name="close" size={20} color="#fff" />
              <Text style={dynamicStyles.buttonText}>ยกเลิก</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                dynamicStyles.saveButtonBottom,
                saving && dynamicStyles.saveButtonDisabled
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="save" size={20} color="#fff" />
              )}
              <Text style={dynamicStyles.buttonText}>
                {isEditMode ? 'บันทึกการแก้ไข' : 'สร้างหนังสือ'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default BookForm;
