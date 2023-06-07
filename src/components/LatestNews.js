import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Pressable, Image, Modal, ScrollView } from "react-native";
import moment from "moment";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyA4RQu33i_jcHvtzq50w9rrTSJ_ZncGE3Q",
  authDomain: "newsapp-32049.firebaseapp.com",
  projectId: "newsapp-32049",
  storageBucket: "newsapp-32049.appspot.com",
  messagingSenderId: "109848058571",
  appId: "1:109848058571:web:2e5322e2a1d8251017594e",
  measurementId: "G-KVL2B1SPCG"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const LatestNews = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState({});

  const toggleModal = (item) => {
    setSelectedNews(item);
    setIsModalVisible(true);
  };

  const [news, setNews] = useState([]);

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

  return (
    <ScrollView>
      {news.map((item) => {
        if (item.status !== "pending") {
          return (
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
                  {/* source */}
                  <Text>
                    source: <Text style={styles.source}>{item.source}</Text>
                  </Text>
                  <Text style={styles.date}>
                    {moment(item.publishedAt).format("MMM Do YY")}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        }
      })}

      {/* Modal */}
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>{selectedNews.title}</Text>
            <Image source={{ uri: selectedNews.mediaUri }} style={styles.Modalimage} />
            <ScrollView style={styles.modalContent}>
              <Text style={styles.cardDescription}>{selectedNews.description}</Text>
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

export default LatestNews;

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
