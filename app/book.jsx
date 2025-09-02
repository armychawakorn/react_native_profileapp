import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from "react-native";
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { handleApiResponse, handleNetworkError, showBookAlerts } from '../utils/alertUtils';
import { getBooksUrl, CONFIG } from '../config/api';

const Book = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const { theme } = useTheme();
  const { authenticatedFetch } = useAuth();

  // function to fetch book data
  const bookData = async (pageNum = 1, isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      
      const booksUrl = `${getBooksUrl('list')}?page=${pageNum}&limit=${CONFIG.PAGINATION.DEFAULT_PAGE_SIZE}`;
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
        
        if (isRefresh || pageNum === 1) {
          setData(books);
        } else {
          setData(prevData => [...prevData, ...books]);
        }

        // แสดงข้อความเฉพาะเมื่อไม่มีข้อมูล
        if (books.length === 0 && pageNum === 1) {
          showBookAlerts.noBooksFound();
        }
      }
    } catch (error) {
      if (error.name === 'TypeError' || error.name === 'AbortError') {
        handleNetworkError(error, () => bookData(pageNum, isRefresh));
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
    bookData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    bookData(1, true);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    bookData(nextPage);
  };

  const renderBookItem = ({ item }) => (
    <View style={[styles.bookItem, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
      <Text style={[styles.author, { color: theme.textSecondary }]}>โดย: {item.author}</Text>
      {item.genre && (
        <Text style={[styles.genre, { color: theme.secondary }]}>หมวดหมู่: {item.genre}</Text>
      )}
      {item.description && (
        <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
      )}
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.secondary} />
      </View>
    );
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 20,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (loading && data.length === 0) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.secondary} />
        <Text style={[dynamicStyles.emptyText, { marginTop: 10 }]}>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.header}>📚 รายการหนังสือ</Text>
      
      {data.length === 0 ? (
        <View style={dynamicStyles.emptyContainer}>
          <Text style={dynamicStyles.emptyText}>ไม่พบข้อมูลหนังสือ</Text>
          <TouchableOpacity 
            style={[styles.refreshButton, { backgroundColor: theme.secondary }]} 
            onPress={onRefresh}
          >
            <Text style={styles.refreshButtonText}>รีเฟรช</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderBookItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.secondary]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};
export default Book;

const styles = StyleSheet.create({
  bookItem: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  author: {
    fontSize: 14,
    marginBottom: 5,
  },
  genre: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  refreshButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
