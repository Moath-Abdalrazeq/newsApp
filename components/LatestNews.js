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
import moment from "moment";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
const firebaseConfig = {
  // your firebase config
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const HomeScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [news, setNews] = useState([]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
    const unsubscribe = db
      .collection("news")
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
      {news.map((item) => (
        <Pressable
          key={item.id}
          style={styles.container}
          onPress={toggleModal}
        >
          {/* image */}
          <Image source={{ uri: item.image }} style={styles.image} />

          <View style={{ padding: 20 }}>
            {/*    title */}
            <Text style={styles.title}>{item.title}</Text>

            {/*    description */}
            <Text style={styles.description} numberOfLines={3}>
              {item.description}
            </Text>

            <View style={styles.data}>
              <Text style={styles.heading}>
                by: <Text style={styles.author}>{item.author}</Text>
              </Text>
              <Text style={styles.date}>
                {moment(item.publishedAt).format("MMM Do YY")}
              </Text>
            </View>

            {/*     source */}
            <View style={{ marginTop: 10 }}>
              <Text>
                source: <Text style={styles.source}>{item.source}</Text>
              </Text>
            </View>
          </View>

          {/* Modal */}
          <Modal
            animationType="slide"
            visible={isModalVisible}
            onRequestClose={toggleModal}
          >
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{item.title}</Text>

              <Image source={{ uri: item.image }} style={styles.modalImage} />

              <Text style={styles.modalDescription}>{item.description}</Text>

              <Pressable style={styles.closeButton} onPress={toggleModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </Modal>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default HomeScreen;

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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#e63946",
    borderRadius: 5,
    alignSelf: "flex-end",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalDescription: {
    fontSize: 20,
    lineHeight: 24,
    textAlign: "center",
    color: "white",
  },
});
