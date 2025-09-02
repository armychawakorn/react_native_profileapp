import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { handleApiResponse, handleNetworkError, showBookAlerts } from '../utils/alertUtils';
import { getBooksUrl } from '../config/api';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const BookDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const { authenticatedFetch, user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchBookDetail();
    }
  }, [id]);

  const fetchBookDetail = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch(getBooksUrl('GET_BY_ID', id));
      const data = await response.json();
      
      const result = handleApiResponse(response, data, {
        successTitle: "โหลดข้อมูลสำเร็จ",
        errorTitle: "โหลดข้อมูลไม่สำเร็จ",
        showSuccessMessage: false
      });

      if (result.success) {
        setBook(data.book);
      }
    } catch (error) {
      if (error.name === 'TypeError' || error.name === 'AbortError') {
        handleNetworkError(error, fetchBookDetail);
      } else {
        console.error("Error fetching book detail:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = () => {
    Alert.alert(
      "ยืนยันการลบ",
      `คุณต้องการลบหนังสือ "${book?.title}" หรือไม่?`,
      [
        {
          text: "ยกเลิก",
          style: "cancel"
        },
        {
          text: "ลบ",
          style: "destructive",
          onPress: deleteBook
        }
      ]
    );
  };

  const deleteBook = async () => {
    try {
      const response = await authenticatedFetch(
        getBooksUrl('DELETE', id),
        { method: 'DELETE' }
      );
      
      const data = await response.json();
      
      const result = handleApiResponse(response, data, {
        successTitle: "ลบหนังสือสำเร็จ",
        errorTitle: "ลบหนังสือไม่สำเร็จ",
        showSuccessMessage: true
      });

      if (result.success) {
        showBookAlerts.deleteSuccess(book.title);
        router.back();
      }
    } catch (error) {
      if (error.name === 'TypeError' || error.name === 'AbortError') {
        handleNetworkError(error, deleteBook);
      } else {
        console.error("Error deleting book:", error);
      }
    }
  };

  const canModifyBook = book && user && (
    book.addedBy._id === user._id || user.role === 'admin'
  );

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
    actionButtons: {
      flexDirection: 'row',
      gap: 10,
    },
    actionButton: {
      padding: 8,
      borderRadius: 20,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    bookCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: 15,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 10,
      lineHeight: 32,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      flexWrap: 'wrap',
    },
    infoIcon: {
      marginRight: 8,
      width: 20,
    },
    infoLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,
      marginRight: 8,
    },
    infoValue: {
      fontSize: 14,
      color: theme.text,
      flex: 1,
    },
    description: {
      fontSize: 16,
      color: theme.text,
      lineHeight: 24,
      marginTop: 10,
    },
    metaInfo: {
      backgroundColor: theme.background,
      borderRadius: 10,
      padding: 15,
      marginTop: 15,
      borderWidth: 1,
      borderColor: theme.border,
    },
    metaTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 10,
    },
    availableChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
      alignSelf: 'flex-start',
    },
    availableText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#fff',
    },
    priceText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.secondary,
    },
    bottomActions: {
      padding: 20,
      backgroundColor: theme.cardBackground,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    actionButtonsBottom: {
      flexDirection: 'row',
      gap: 15,
    },
    editButton: {
      flex: 1,
      backgroundColor: theme.secondary,
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
    },
    deleteButton: {
      flex: 1,
      backgroundColor: '#ff4757',
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
        <Text style={[dynamicStyles.infoValue, { marginTop: 10 }]}>
          กำลังโหลดข้อมูล...
        </Text>
      </View>
    );
  }

  if (!book) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <Ionicons name="book-outline" size={64} color={theme.textSecondary} />
        <Text style={[dynamicStyles.infoValue, { marginTop: 10, textAlign: 'center' }]}>
          ไม่พบข้อมูลหนังสือ
        </Text>
        <TouchableOpacity 
          style={[dynamicStyles.editButton, { marginTop: 20, width: 120 }]}
          onPress={() => router.back()}
        >
          <Text style={dynamicStyles.buttonText}>กลับ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        <TouchableOpacity 
          style={dynamicStyles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        
        <Text style={dynamicStyles.headerTitle} numberOfLines={1}>
          รายละเอียดหนังสือ
        </Text>

        <View style={dynamicStyles.actionButtons}>
          {canModifyBook && (
            <>
              <TouchableOpacity 
                style={[dynamicStyles.actionButton, { backgroundColor: theme.secondary }]}
                onPress={() => router.push({
                  pathname: '/book-form',
                  params: { mode: 'edit', bookId: book._id }
                })}
              >
                <Ionicons name="pencil" size={18} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[dynamicStyles.actionButton, { backgroundColor: '#ff4757' }]}
                onPress={handleDeleteBook}
              >
                <Ionicons name="trash" size={18} color="#fff" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        {/* Main Book Info */}
        <View style={dynamicStyles.bookCard}>
          <Text style={dynamicStyles.title}>{book.title}</Text>
          
          <View style={dynamicStyles.infoRow}>
            <Ionicons name="person" size={16} color={theme.secondary} style={dynamicStyles.infoIcon} />
            <Text style={dynamicStyles.infoLabel}>ผู้แต่ง:</Text>
            <Text style={dynamicStyles.infoValue}>{book.author}</Text>
          </View>

          {book.genre && (
            <View style={dynamicStyles.infoRow}>
              <Ionicons name="library" size={16} color={theme.secondary} style={dynamicStyles.infoIcon} />
              <Text style={dynamicStyles.infoLabel}>หมวดหมู่:</Text>
              <Text style={dynamicStyles.infoValue}>{book.genre}</Text>
            </View>
          )}

          {book.year && (
            <View style={dynamicStyles.infoRow}>
              <Ionicons name="calendar" size={16} color={theme.secondary} style={dynamicStyles.infoIcon} />
              <Text style={dynamicStyles.infoLabel}>ปีที่ตีพิมพ์:</Text>
              <Text style={dynamicStyles.infoValue}>{book.year}</Text>
            </View>
          )}

          {book.price !== undefined && book.price !== null && (
            <View style={dynamicStyles.infoRow}>
              <Ionicons name="pricetag" size={16} color={theme.secondary} style={dynamicStyles.infoIcon} />
              <Text style={dynamicStyles.infoLabel}>ราคา:</Text>
              <Text style={dynamicStyles.priceText}>
                {book.price === 0 ? 'ฟรี' : `${book.price.toLocaleString()} บาท`}
              </Text>
            </View>
          )}

          <View style={dynamicStyles.infoRow}>
            <Ionicons name="checkmark-circle" size={16} color={theme.secondary} style={dynamicStyles.infoIcon} />
            <Text style={dynamicStyles.infoLabel}>สถานะ:</Text>
            <View style={[
              dynamicStyles.availableChip, 
              { backgroundColor: book.available ? '#2ecc71' : '#e74c3c' }
            ]}>
              <Text style={dynamicStyles.availableText}>
                {book.available ? 'มีสินค้า' : 'หมด'}
              </Text>
            </View>
          </View>

          {book.description && (
            <>
              <View style={[dynamicStyles.infoRow, { marginTop: 15, marginBottom: 5 }]}>
                <Ionicons name="document-text" size={16} color={theme.secondary} style={dynamicStyles.infoIcon} />
                <Text style={dynamicStyles.infoLabel}>รายละเอียด:</Text>
              </View>
              <Text style={dynamicStyles.description}>{book.description}</Text>
            </>
          )}
        </View>

        {/* Meta Information */}
        <View style={dynamicStyles.metaInfo}>
          <Text style={dynamicStyles.metaTitle}>ข้อมูลเพิ่มเติม</Text>
          
          <View style={dynamicStyles.infoRow}>
            <Ionicons name="person-add" size={16} color={theme.secondary} style={dynamicStyles.infoIcon} />
            <Text style={dynamicStyles.infoLabel}>เพิ่มโดย:</Text>
            <Text style={dynamicStyles.infoValue}>
              {book.addedBy?.username || 'ไม่ระบุ'} ({book.addedBy?.email || 'ไม่ระบุ'})
            </Text>
          </View>

          <View style={dynamicStyles.infoRow}>
            <Ionicons name="time" size={16} color={theme.secondary} style={dynamicStyles.infoIcon} />
            <Text style={dynamicStyles.infoLabel}>วันที่เพิ่ม:</Text>
            <Text style={dynamicStyles.infoValue}>
              {book.createdAt ? new Date(book.createdAt).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'ไม่ระบุ'}
            </Text>
          </View>

          {book.updatedAt && book.updatedAt !== book.createdAt && (
            <View style={dynamicStyles.infoRow}>
              <Ionicons name="refresh" size={16} color={theme.secondary} style={dynamicStyles.infoIcon} />
              <Text style={dynamicStyles.infoLabel}>แก้ไขล่าสุด:</Text>
              <Text style={dynamicStyles.infoValue}>
                {new Date(book.updatedAt).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      {canModifyBook && (
        <View style={dynamicStyles.bottomActions}>
          <View style={dynamicStyles.actionButtonsBottom}>
            <TouchableOpacity 
              style={dynamicStyles.editButton}
              onPress={() => router.push({
                pathname: '/book-form',
                params: { mode: 'edit', bookId: book._id }
              })}
            >
              <Ionicons name="pencil" size={20} color="#fff" />
              <Text style={dynamicStyles.buttonText}>แก้ไข</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={dynamicStyles.deleteButton}
              onPress={handleDeleteBook}
            >
              <Ionicons name="trash" size={20} color="#fff" />
              <Text style={dynamicStyles.buttonText}>ลบ</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default BookDetail;
