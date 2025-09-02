import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  RefreshControl, 
  TextInput,
  Alert,
  Dimensions
} from "react-native";
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { handleApiResponse, handleNetworkError, showBookAlerts } from '../utils/alertUtils';
import { getBooksUrl, CONFIG } from '../config/api';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Book = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const { theme } = useTheme();
  const { authenticatedFetch, user } = useAuth();
  const router = useRouter();

  // function to fetch book data
  const bookData = async (pageNum = 1, isRefresh = false, search = '', genre = '') => {
    try {
      if (!isRefresh && pageNum === 1) setLoading(true);
      
      let booksUrl = `${getBooksUrl('list')}?page=${pageNum}&limit=${CONFIG.PAGINATION.DEFAULT_PAGE_SIZE}`;
      
      if (search) {
        booksUrl += `&search=${encodeURIComponent(search)}`;
      }
      
      if (genre) {
        booksUrl += `&genre=${encodeURIComponent(genre)}`;
      }
      
      const response = await authenticatedFetch(booksUrl);
      
      const data = await response.json();
      
      const result = handleApiResponse(response, data, {
        successTitle: "โหลดข้อมูลสำเร็จ",
        errorTitle: "โหลดข้อมูลไม่สำเร็จ",
        showSuccessMessage: false // ไม่แสดงข้อความสำเร็จเพราะจะรำคาญ
      });

      if (result.success) {
        console.log("Book data fetched successfully:", data);
        
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
        handleNetworkError(error, () => bookData(pageNum, isRefresh, search, genre));
      } else {
        console.error("Error fetching book data:", error);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log("Book component mounted");
    fetchGenres();
    bookData();
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

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    bookData(1, true, searchQuery, selectedGenre);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      bookData(nextPage, false, searchQuery, selectedGenre);
    }
  };

  const handleSearch = () => {
    setPage(1);
    setHasMore(true);
    bookData(1, false, searchQuery, selectedGenre);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setPage(1);
    setHasMore(true);
    bookData(1, false, '', '');
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

  const renderBookItem = ({ item }) => {
    const canModify = user && (item.addedBy?._id === user._id || user.role === 'admin');
    
    return (
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
          
          {canModify && (
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
          )}
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

          {/* Price and Added by */}
          <View style={styles.cardFooter}>
            {item.price !== undefined && item.price !== null && (
              <Text style={[styles.price, { color: theme.secondary }]}>
                {item.price === 0 ? 'ฟรี' : `${item.price.toLocaleString()} บาท`}
              </Text>
            )}
            
            <Text style={[styles.addedBy, { color: theme.textSecondary }]}>
              โดย {item.addedBy?.username || 'ไม่ระบุ'}
            </Text>
          </View>
        </View>

        {/* Card indicator */}
        <View style={styles.cardIndicator}>
          <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
        </View>
      </TouchableOpacity>
    );
  };

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

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <Ionicons name="search" size={20} color={theme.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="ค้นหาหนังสือ..."
          placeholderTextColor={theme.textSecondary}
          onSubmitEditing={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Button */}
      <TouchableOpacity 
        style={[styles.filterButton, { backgroundColor: theme.secondary }]}
        onPress={() => setShowFilters(!showFilters)}
      >
        <Ionicons name="options" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Filters */}
      {showFilters && (
        <View style={[styles.filtersContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <Text style={[styles.filterTitle, { color: theme.text }]}>หมวดหมู่</Text>
          <View style={styles.genresContainer}>
            <TouchableOpacity
              style={[
                styles.genreChip,
                { backgroundColor: selectedGenre === '' ? theme.secondary : theme.border }
              ]}
              onPress={() => setSelectedGenre('')}
            >
              <Text style={[
                styles.genreChipText,
                { color: selectedGenre === '' ? '#fff' : theme.text }
              ]}>
                ทั้งหมด
              </Text>
            </TouchableOpacity>
            
            {genres.map((genre, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.genreChip,
                  { backgroundColor: selectedGenre === genre ? theme.secondary : theme.border }
                ]}
                onPress={() => setSelectedGenre(selectedGenre === genre ? '' : genre)}
              >
                <Text style={[
                  styles.genreChipText,
                  { color: selectedGenre === genre ? '#fff' : theme.text }
                ]}>
                  {genre}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.filterActions}>
            <TouchableOpacity style={[styles.applyButton, { backgroundColor: theme.secondary }]} onPress={handleSearch}>
              <Text style={styles.applyButtonText}>ค้นหา</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.clearButton, { backgroundColor: theme.textSecondary }]} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>ล้างทั้งหมด</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

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
        <Text style={dynamicStyles.loadingText}>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>📚 รายการหนังสือ</Text>
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

      {data.length === 0 && !loading ? (
        <View style={dynamicStyles.emptyContainer}>
          <Ionicons name="library-outline" size={80} color={theme.textSecondary} style={dynamicStyles.emptyIcon} />
          <Text style={dynamicStyles.emptyText}>ยังไม่มีหนังสือ</Text>
          <Text style={dynamicStyles.emptySubText}>
            เริ่มต้นสร้างห้องสมุดของคุณด้วยการเพิ่มหนังสือเล่มแรก
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
          ListHeaderComponent={renderHeader}
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
export default Book;

const styles = StyleSheet.create({
  listContainer: {
    padding: 15,
  },
  headerContainer: {
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterButton: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 15,
  },
  filtersContainer: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  genreChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  genreChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  filterActions: {
    flexDirection: 'row',
    gap: 10,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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
  addedBy: {
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
