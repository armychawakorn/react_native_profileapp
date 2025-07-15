import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const Book = () => {
  const [data, setData] = useState([]);
  // function to fetch book data
  const bookData = async () => {
    try {
      fetch("http://10.0.15.16:3000/api/books?page=1&limit=10")
        .then((response) => response.json())
        .then((data) => {
          console.log("Book data fetched successfully:", data.books);
          setData(data.books);
        })
        .catch((error) => {
          console.error("Error fetching book data:", error);
        });
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
  };
  useEffect(() => {
    console.log("Book component mounted");
    bookData();
  }, []);
  return (
    <View style={style.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={(item) => {
          return (
            <View>
              <Text style={style.title}>{item.item.title}</Text>
              <Text style={style.text}>{item.item.author}</Text>
            </View>
          );
        }}
      ></FlatList>
    </View>
  );
};
export default Book;
const style = StyleSheet.create({
  container: {
    marginVertical: 14,
    marginHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 34,
  },
  text: {},
});
