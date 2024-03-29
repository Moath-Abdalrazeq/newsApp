import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const db = firebase.firestore();

const CityNews = ({ city }) => {
  const [news, setNews] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState({});

  useEffect(() => {
    const unsubscribe = db
      .collection("news")
      .where("status", "==", "accepted")
      .onSnapshot((querySnapshot) => {
        const news = [];
        querySnapshot.forEach((doc) => {
          news.push({ id: doc.id, ...doc.data() });
        });
        setNews(news);
      });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      const newsRef = firebase.firestore().collection("news");
      const query = newsRef.where("city", "==", city);

      try {
        const snapshot = await query.get();
        const newsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNews(newsData);
      } catch (error) {
        console.log("Error fetching news:", error);
      }
    };

    fetchNews();
  }, [city]);

  const toggleModal = (item) => {
    setSelectedNews(item);
    setIsModalVisible(true);
  };

  return (
    <ScrollView>
      {news.map((item) => (
        <Pressable
          key={item.id}
          style={styles.container}
          onPress={() => toggleModal(item)}
        >
          {/* image */}
          <Image source={{ uri: item.mediaUri }} style={styles.image} />

          <View style={{ padding: 20 }}>
            {/* title */}
            <Text style={styles.title}>{item.title}</Text>

            {/* description */}
            <Text style={styles.description} numberOfLines={3}>
              {item.description}
            </Text>

            <View style={styles.data}>
              {/* city */}
              <Text>
                <Text style={styles.source}>{item.source}</Text>
              </Text>
              <Text>
                <Text style={styles.date}>{item.date}</Text>
              </Text>
            </View>
          </View>
        </Pressable>
      ))}
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>{selectedNews.title}</Text>
            <Image
              source={{ uri: selectedNews.mediaUri }}
              style={styles.Modalimage}
            />
            <ScrollView style={styles.modalContent}>
              <Text style={styles.cardDescription}>
                {selectedNews.description}
              </Text>
            </ScrollView>
            <Pressable
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default CityNews;

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    borderRadius: 40,
    shadowOpacity: 0.5,
    shadowColor: "#000",
    shadowOffset: {
      height: 5,
      width: 5,
    },
    backgroundColor: "#fff",
    marginTop: 20,
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
  },
  description: {
    fontSize: 16,
    fontWeight: "400",
    marginTop: 10,
    textDecorationLine: "underline",
  },
  data: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  heading: {},
  author: {
    fontWeight: "bold",
    fontSize: 15,
  },
  date: {
    fontWeight: "bold",
    color: "#e63946",
    fontSize: 15,
  },
  source: {
    color: "#e63946",
    fontWeight: "bold",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 50,
  },
  Modalimage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 22,
    lineHeight: 24,
    marginBottom: 20,
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
