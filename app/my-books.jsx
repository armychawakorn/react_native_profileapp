import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  RefreshControl,
  Alert,
  Dimensions
} from "react-native";
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useRouter, useFocusEffect } from 'expo-router';
import { handleApiResponse, handleNetworkError, showBookAlerts } from '../utils/alertUtils';
import { getBooksUrl, CONFIG } from '../config/api';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MyBooks = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { theme } = useTheme();
  const { authenticatedFetch, user } = useAuth();
  const router = useRouter();

  // ใช้ useFocusEffect เพื่อ refresh ข้อมูลเมื่อกลับมาหน้านี้
  useFocusEffect(
    React.useCallback(() => {
      console.log("MyBooks screen focused - refreshing data");
      onRefresh();
    }, [])
  );

  // function to fetch user's books
  const fetchMyBooks = async (pageNum = 1, isRefresh = false) => {
    try {
      if (!isRefresh && pageNum === 1) setLoading(true);
      
      const booksUrl = `${getBooksUrl('MY_BOOKS')}?page=${pageNum}&limit=${CONFIG.PAGINATION.DEFAULT_PAGE_SIZE}`;
      const response = await authenticatedFetch(booksUrl);
      
      const data = await response.json();
      
      const result = handleApiResponse(response, data, {
        successTitle: "โหลดข้อมูลสำเร็จ",
        errorTitle: "โหลดข้อมูลไม่สำเร็จ",
        showSuccessMessage: false
      });

      if (result.success) {
        console.log("My books data fetched successfully:", data);
        
        const books = data.books || [];
        const pagination = data.pagination || {};
        
        if (isRefresh || pageNum === 1) {
          setData(books);
        } else {
          setData(prevData => [...prevData, ...books]);
        }

        // Check if there are more pages
        setHasMore(pagination.page < pagination.pages);

        // แสดงข้อความเฉพาะเมื่อไม่มีข้อมูล
        if (books.length === 0 && pageNum === 1) {
          showBookAlerts.noBooksFound();
        }
      }
    } catch (error) {
      if (error.name === 'TypeError' || error.name === 'AbortError') {
        handleNetworkError(error, () => fetchMyBooks(pageNum, isRefresh));
      } else {
        console.error("Error fetching my books:", error);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log("MyBooks component mounted");
    // ลบการ fetch ออกจาก useEffect เพราะใช้ useFocusEffect แทน
    // fetchMyBooks();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    fetchMyBooks(1, true);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMyBooks(nextPage);
    }
  };

  const handleBookPress = (book) => {
    router.push({
      pathname: '/book-detail',
      params: { id: book._id }
    });
  };

  const handleEditBook = (book) => {
    router.push({
      pathname: '/book-form',
      params: { mode: 'edit', bookId: book._id }
    });
  };

  const handleDeleteBook = (book) => {
    Alert.alert(
      "ยืนยันการลบ",
      `คุณต้องการลบหนังสือ "${book.title}" หรือไม่?`,
      [
        {
          text: "ยกเลิก",
          style: "cancel"
        },
        {
          text: "ลบ",
          style: "destructive",
          onPress: () => deleteBook(book)
        }
      ]
    );
  };

  const deleteBook = async (book) => {
    try {
      const response = await authenticatedFetch(
        getBooksUrl('DELETE', book._id),
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
        onRefresh(); // Refresh the list
      }
    } catch (error) {
      if (error.name === 'TypeError' || error.name === 'AbortError') {
        handleNetworkError(error, () => deleteBook(book));
      } else {
        console.error("Error deleting book:", error);
      }
    }
  };

  const renderBookItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.bookCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
      onPress={() => handleBookPress(item)}
      activeOpacity={0.7}
    >
      {/* Header with actions */}
      <View style={styles.cardHeader}>
        <View style={styles.bookMeta}>
          {item.genre && (
            <View style={[styles.genreTag, { backgroundColor: theme.secondary }]}>
              <Text style={styles.genreText}>{item.genre}</Text>
            </View>
          )}
          <View style={[
            styles.availableTag, 
            { backgroundColor: item.available ? '#2ecc71' : '#e74c3c' }
          ]}>
            <Text style={styles.availableText}>
              {item.available ? 'มีสินค้า' : 'หมด'}
            </Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.secondary }]}
            onPress={(e) => {
              e.stopPropagation();
              handleEditBook(item);
            }}
          >
            <Ionicons name="pencil" size={14} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#e74c3c' }]}
            onPress={(e) => {
              e.stopPropagation();
              handleDeleteBook(item);
            }}
          >
            <Ionicons name="trash" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main content */}
      <View style={styles.cardContent}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        
        <View style={styles.authorRow}>
          <Ionicons name="person" size={14} color={theme.secondary} />
          <Text style={[styles.author, { color: theme.textSecondary }]}>
            {item.author}
          </Text>
        </View>

        {item.year && (
          <View style={styles.yearRow}>
            <Ionicons name="calendar" size={14} color={theme.secondary} />
            <Text style={[styles.year, { color: theme.textSecondary }]}>
              ปี {item.year}
            </Text>
          </View>
        )}

        {item.description && (
          <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        {/* Price and Stats */}
        <View style={styles.cardFooter}>
          {item.price !== undefined && item.price !== null && (
            <Text style={[styles.price, { color: theme.secondary }]}>
              {item.price === 0 ? 'ฟรี' : `${item.price.toLocaleString()} บาท`}
            </Text>
          )}
          
          <Text style={[styles.addedDate, { color: theme.textSecondary }]}>
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('th-TH', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }) : 'ไม่ระบุ'}
          </Text>
        </View>
      </View>

      {/* Card indicator */}
      <View style={styles.cardIndicator}>
        <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loading || data.length === 0) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.secondary} />
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          กำลังโหลดเพิ่มเติม...
        </Text>
      </View>
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
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      flex: 1,
    },
    addButton: {
      backgroundColor: theme.secondary,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    statsContainer: {
      backgroundColor: theme.cardBackground,
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    statsText: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyIcon: {
      marginBottom: 20,
    },
    emptyText: {
      fontSize: 18,
      color: theme.text,
      textAlign: 'center',
      marginBottom: 10,
      fontWeight: '600',
    },
    emptySubText: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 30,
      lineHeight: 20,
    },
    emptyActions: {
      flexDirection: 'row',
      gap: 15,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: theme.textSecondary,
    },
  });

  if (loading && data.length === 0) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.secondary} />
        <Text style={dynamicStyles.loadingText}>กำลังโหลดหนังสือของคุณ...</Text>
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>📚 หนังสือของฉัน</Text>
        <TouchableOpacity 
          style={dynamicStyles.addButton}
          onPress={() => router.push({
            pathname: '/book-form',
            params: { mode: 'create' }
          })}
        >
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={dynamicStyles.addButtonText}>เพิ่ม</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      {data.length > 0 && (
        <View style={dynamicStyles.statsContainer}>
          <Text style={dynamicStyles.statsText}>
            คุณมีหนังสือทั้งหมด {data.length} เล่ม
          </Text>
        </View>
      )}

      {data.length === 0 && !loading ? (
        <View style={dynamicStyles.emptyContainer}>
          <Ionicons name="book-outline" size={80} color={theme.textSecondary} style={dynamicStyles.emptyIcon} />
          <Text style={dynamicStyles.emptyText}>คุณยังไม่มีหนังสือ</Text>
          <Text style={dynamicStyles.emptySubText}>
            เริ่มต้นสร้างห้องสมุดส่วนตัวของคุณด้วยการเพิ่มหนังสือเล่มแรก
          </Text>
          <View style={dynamicStyles.emptyActions}>
            <TouchableOpacity 
              style={[styles.refreshButton, { backgroundColor: theme.secondary }]} 
              onPress={onRefresh}
            >
              <Ionicons name="refresh" size={16} color="#fff" />
              <Text style={styles.refreshButtonText}>รีเฟรช</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.addBookButton, { backgroundColor: theme.secondary }]} 
              onPress={() => router.push({
                pathname: '/book-form',
                params: { mode: 'create' }
              })}
            >
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.refreshButtonText}>เพิ่มหนังสือ</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
          renderItem={renderBookItem}
          ListFooterComponent={renderFooter}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.secondary]}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

export default MyBooks;

const styles = StyleSheet.create({
  listContainer: {
    padding: 15,
  },
  bookCard: {
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 15,
    paddingBottom: 10,
  },
  bookMeta: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  genreTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  genreText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  availableTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  availableText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 5,
  },
  actionButton: {
    padding: 6,
    borderRadius: 15,
  },
  cardContent: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    gap: 6,
  },
  author: {
    fontSize: 14,
    flex: 1,
  },
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  year: {
    fontSize: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addedDate: {
    fontSize: 12,
  },
  cardIndicator: {
    position: 'absolute',
    right: 15,
    bottom: 15,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 12,
  },
  refreshButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addBookButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
