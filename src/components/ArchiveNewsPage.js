import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
  Modal,
  ScrollView,
  Share,
} from "react-native";
import moment from "moment";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const firebaseConfig = {
  apiKey: "AIzaSyA4RQu33i_jcHvtzq50w9rrTSJ_ZncGE3Q",
  authDomain: "newsapp-32049.firebaseapp.com",
  projectId: "newsapp-32049",
  storageBucket: "newsapp-32049.appspot.com",
  messagingSenderId: "109848058571",
  appId: "1:109848058571:web:2e5322e2a1d8251017594e",
  measurementId: "G-KVL2B1SPCG",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const ArchivePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filteredNews, setFilteredNews] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  const handleDateSelection = (event, date) => {
    setShowDatePicker(false);
    if (date !== undefined) {
      setSelectedDate(date);
      filterNews(date);
    }
  };

  const filterNews = async (selectedDate) => {
    try {
      const formattedDate = moment(selectedDate).format("D MMMM YYYY");

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

  const toggleModal = (news) => {
    setSelectedNews(news);
    setIsModalVisible(!isModalVisible);
  };

  const shareNews = async (news) => {
    try {
      await Share.share({
        message: `${news.title}\n\n${
          news.description
        }\n\nPublished on: ${moment(news.publishedAt).format(
          "MMM Do YY"
        )}\n\nRead more at: ${news.mediaUri}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    filterNews(selectedDate);
  }, []);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.datePickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.datePickerButtonText}>
          Select Date: {moment(selectedDate).format("MMM Do YY")}
        </Text>
      </Pressable>

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
            <Pressable
              key={news.id}
              style={styles.container}
              onPress={() => toggleModal(news)}
            >
              {/* image */}
              <Image source={{ uri: news.mediaUri }} style={styles.image} />

              <View style={{ padding: 20 }}>
                {/* title */}
                <Text style={styles.title}>{news.title}</Text>

                {/* description */}
                <Text style={styles.description} numberOfLines={3}>
                  {news.description}
                </Text>

                <View style={styles.data}>
                  {/* source */}
                  <Text>
                    <Text style={styles.city}>{news.source}</Text>
                  </Text>
                  <Text>
                    <Text style={styles.date}>{news.date}</Text>
                  </Text>
                </View>

                <Pressable
                  style={styles.shareButton}
                  onPress={() => shareNews(news)}
                >
                  <Ionicons name="share" size={35} color="black" />
                </Pressable>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noNewsText}>
          No news available for the selected date.
        </Text>
      )}

      <Modal visible={isModalVisible} animationType="slide">
        {selectedNews && (
          <View style={styles.modalContainer}>
            <View style={styles.cardContainer}>
              <Text style={styles.cardTitle}>{selectedNews.title}</Text>
              <Image
                source={{ uri: selectedNews.mediaUri }}
                style={styles.modalImage}
              />
              <ScrollView style={styles.modalContent}>
                <Text style={styles.cardDescription}>
                  {selectedNews.description}
                </Text>
              </ScrollView>
              <Pressable
                style={styles.closeButton}
                onPress={() => toggleModal(selectedNews)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Modal>
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
  data: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
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
    marginBottom: 20,
  },
  image: {
    height: 200,
    width: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    textAlign: "right",
  },
  description: {
    fontSize: 16,
    fontWeight: "400",
    marginTop: 10,
    textDecorationLine: "underline",
    textAlign: "right",
  },
  source: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  date: {
    fontWeight: "bold",
    color: "#e63946",
    fontSize: 15,
  },
  shareButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    marginTop: 10,
    alignSelf: "flex-end",
  },
  noNewsText: {
    fontSize: 20,
    fontStyle: "italic",
    color: "#666",
    alignSelf: "center",
    marginTop: 100,
  },
  modalContainer: {
    flex: 1,
    marginTop: 40,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  cardContainer: {
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
    borderRadius: 5,
    padding: 20,
  },
  cardTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "right",
  },
  modalImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 22,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: "right",
  },
  modalDate: {
    fontSize: 16,
    color: "#e63946",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "flex-end",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ArchivePage;
