import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  RefreshControl,
} from "react-native";
import { firebase } from "../../../config";

const AdminDashboard = () => {
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPendingRegistrations();
  }, []);

  const fetchPendingRegistrations = async () => {
    try {
      const registrationsSnapshot = await firebase
        .firestore()
        .collection("users")
        .where("role", "==", "journalist")
        .where("status", "==", "pending")
        .get();

      const registrations = registrationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPendingRegistrations(registrations);
    } catch (error) {
      alert(error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPendingRegistrations();
  };

  const acceptRegistration = async (registrationId) => {
    try {
      await firebase
        .firestore()
        .collection("users")
        .doc(registrationId)
        .update({
          status: "active",
        });

      // Send acceptance email to the journalist
      const registration = pendingRegistrations.find(
        (registration) => registration.id === registrationId
      );

      await firebase.auth().sendPasswordResetEmail(registration.email);

      // Remove the accepted registration from the pending registrations list
      setPendingRegistrations((prevState) =>
        prevState.filter((registration) => registration.id !== registrationId)
      );

      alert("Registration accepted successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  const rejectRegistration = async (registrationId) => {
    try {
      await firebase
        .firestore()
        .collection("users")
        .doc(registrationId)
        .update({
          status: "rejected",
        });

      // Send rejection email to the journalist
      const registration = pendingRegistrations.find(
        (registration) => registration.id === registrationId
      );

      // Add your logic here to send a rejection email to the journalist

      // Remove the rejected registration from the pending registrations list
      setPendingRegistrations((prevState) =>
        prevState.filter((registration) => registration.id !== registrationId)
      );

      alert("Registration rejected successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  const renderRegistrationItem = (registration) => {
    const viewCV = async () => {
      try {
        const userDoc = await firebase.firestore().collection("users").doc(registration.id).get();
        const user = userDoc.data();
    
        // Ensure that the user.cv property contains the correct file URL
        const cvUrl = user.cv;
    
        // Check if the URL is valid before opening
        if (cvUrl) {
          await Linking.openURL(cvUrl);
        } else {
          alert("CV not available");
        }
      } catch (error) {
        alert(error.message);
      }
    };
    

    return (
      <View style={styles.registrationItem} key={registration.id}>
        <Text
          style={styles.name}
        >{`${registration.firstName} ${registration.lastName}`}</Text>
        <TouchableOpacity style={styles.viewCVButton} onPress={viewCV}>
          <Text style={styles.viewCVButtonText}>View CV</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => acceptRegistration(registration.id)}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => rejectRegistration(registration.id)}
        >
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Pending Registrations</Text>
      {pendingRegistrations.length > 0 ? (
        pendingRegistrations.map(renderRegistrationItem)
      ) : (
        <Text style={styles.noRegistrationsText}>
          No pending registrations.
        </Text>
      )}
    </ScrollView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  registrationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
  },
  name: {
    flex: 1,
    marginRight: 4,
    fontSize: 16,
    fontWeight: "bold",
  },
  viewCVButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 6,
  },
  acceptButton: {
    backgroundColor: "#026efd",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  rejectButton: {
    backgroundColor: "#ff0000",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  viewCVButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  acceptButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  rejectButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  noRegistrationsText: {
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 32,
    fontSize: 16,
    color: "#666",
  },
});
