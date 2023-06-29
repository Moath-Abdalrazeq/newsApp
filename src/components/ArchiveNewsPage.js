import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
      const querySnapshot = await newsRef.where("date", "==", formattedDate).get();
      const filteredNews = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
        <View style={styles.newsContainer}>
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
        </View>
      ) : (
        <Text style={styles.noNewsText}>No news available for the selected date.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  datePickerButtonText: {
    fontSize: 16,
  },
  newsContainer: {
    marginTop: 16,
  },
  newsItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  newsDescription: {
    fontSize: 16,
    marginBottom: 4,
  },
  newsSource: {
    fontSize: 14,
    color: "#888",
  },
  noNewsText: {
    marginTop: 16,
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
  },
});

export default ArchivePage;
