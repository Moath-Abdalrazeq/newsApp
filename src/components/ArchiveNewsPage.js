import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const ArchivePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filteredNews, setFilteredNews] = useState([]);

  const handleDateSelection = (event, date) => {
    setShowDatePicker(false);
    if (date !== undefined) {
      setSelectedDate(date);
      filterNews(date);
    }
  };

  const filterNews = async (selectedDate) => {
    try {
      const formattedDate = selectedDate.toLocaleString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const newsRef = firebase.firestore().collection("news");
      const querySnapshot = await newsRef
        .where("date", "==", formattedDate)
        .get();
      const filteredNews = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFilteredNews(filteredNews);
    } catch (error) {
      console.log("Error filtering news:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.datePickerButtonText}>
          Select Date: {selectedDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateSelection}
        />
      )}

      {filteredNews.length > 0 ? (
        <ScrollView style={styles.newsContainer}>
          {filteredNews.map((news) => (
            <TouchableOpacity
              key={news.id}
              style={styles.newsItem}
              onPress={() => {
                // Handle news item click
              }}
            >
              <Text style={styles.newsTitle}>{news.title}</Text>
              <Text style={styles.newsDescription}>{news.description}</Text>
              <Text style={styles.newsSource}>{news.source}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noNewsText}>
          No news available for the selected date.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  datePickerButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e63946",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  datePickerButtonText: {
    color: "#e63946",
    fontSize: 20,
    fontWeight: "bold",
  },
  newsContainer: {
    flex: 1,
    marginTop: 20,
  },
  newsItem: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  newsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  newsDescription: {
    fontSize: 18,
    marginBottom: 10,
  },
  newsSource: {
    fontSize: 16,
    color: "#666",
  },
  noNewsText: {
    fontSize: 20,
    fontStyle: "italic",
    color: "#666",
    alignSelf: "center",
    marginTop: 100,
  },
});

export default ArchivePage;