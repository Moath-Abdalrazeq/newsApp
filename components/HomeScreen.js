import React, { useState } from "react";
import { View, StyleSheet, Text, Pressable, Image, Modal } from "react-native";
import moment from "moment";

const HomeScreen = (props) => {

    const [isModalVisible, setIsModalVisible] = useState(false);

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    }
    return (
        <View>
     
            <Pressable style={styles.container} onPress={toggleModal}>
                {/* image */}
                <Image source={require("../images/1.jpg")}

                    style={styles.image}
                />

                <View style={{ padding: 20 }}>
                    {/*    title */}
                    <Text style={styles.title}> {props.title} </Text>

                    {/*    description */}
                    <Text style={styles.description} numberOfLines={3}>{props.description}</Text>

                    <View style={styles.data}>
                        <Text style={styles.heading}>by: <Text style={styles.author}>{props.author}</Text></Text>
                        <Text style={styles.date}>{moment(props.publishedAt).format("MMM Do YY")}</Text>
                    </View>

                    {/*     source */}
                    <View style={{ marginTop: 10 }}>
                        <Text>source: <Text style={styles.source}>{props.sourceName}</Text></Text>
                    </View>
                </View>
            </Pressable>

            {/* Modal */}
            <Modal
                animationType="slide"
                visible={isModalVisible}
                onRequestClose={toggleModal}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{props.title}</Text>

                    <Image source={{
                        uri: props.urlToImage
                    }}
                        style={styles.modalImage}
                    />

    

                    <Text style={styles.modalDescription}>{props.description}</Text>

                    <Pressable style={styles.closeButton} onPress={toggleModal}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </Pressable>
                </View>
            </Modal>
        </View>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container:{
        width: "90%",
        alignSelf: "center",
        borderRadius: 40,
        shadowOpacity: 0.5,
        shadowColor: "#000",
        shadowOffset: {
            height: 5,
            width: 5
        },
        backgroundColor: "#fff",
        marginTop: 20
    },
    image:{
        height: 200,
        width: "100%",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40
    },
    title:{
        fontSize: 18,
        fontWeight: "600",
        marginTop: 10
    },
    description:{
        fontSize: 16,
        fontWeight: "400",
        marginTop: 10,
        textDecorationLine: "underline"

    },
    data:{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10
    },
    heading:{

    },
    author:{
        fontWeight: "bold",
        fontSize: 15
    },
    date:{
        fontWeight: "bold",
        color: "#e63946",
        fontSize: 15
    },
    source:{
        color: "#e63946",
        fontWeight: "bold",
        fontSize: 18
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center"
    },
    cardContainer: {
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 10,
      width: "80%"
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 10
    },
    cardDescription: {
      fontSize: 16,
      fontWeight: "400",
      lineHeight: 24
    },
    closeButton: {
      marginTop: 10,
      padding: 10,
      backgroundColor: "#e63946",
      borderRadius: 5,
      alignSelf: "flex-end"
    },
    closeButtonText: {
      color: "#fff",
      fontWeight: "bold"
    }
})