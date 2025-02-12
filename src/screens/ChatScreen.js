import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { askChatbot } from "../services/chatbotService";
import { useUser } from "../context/UserContext";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const ChatScreen = () => {
  const { user, setUser } = useUser();
  const [userInput, setUserInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const firestoreDb = getFirestore();
  const scrollViewRef = useRef();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.userId) {
        try {
          const userRef = doc(firestoreDb, "users", user.userId);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              ...user,
              name: userData.name || "Usuario",
              edad: userData.edad || "?",
              peso: userData.peso || "?",
              estatura: userData.estatura || "?",
            });
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
        }
      }
    };

    fetchUserData();
  }, [user?.userId]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    if (!user || !user.userId) {
      alert("No se encontraron datos del usuario.");
      return;
    }

    // Agregar mensaje del usuario al chat antes de enviar la solicitud al bot
    const newUserMessage = { sender: "user", text: userInput };
    setChatLog((prevChatLog) => [...prevChatLog, newUserMessage]);

    setUserInput("");
    setLoading(true);

    try {
      const botResponse = await askChatbot(userInput, {
        userId: user.userId,
        name: user.name,
        edad: user.edad,
        peso: user.peso,
        estatura: user.estatura,
      });

      // Agregar la respuesta del bot al chat
      const newBotMessage = { sender: "bot", text: botResponse };
      setChatLog((prevChatLog) => [...prevChatLog, newBotMessage]);
    } catch {
      alert("Error al obtener respuesta del chatbot.");
    } finally {
      setLoading(false);
    }

    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeContainer}>
          {/* Título */}
          <View style={styles.header}>
            <Text style={styles.title}>Chatea con Nutri</Text>
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={styles.chatContainer}
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            {chatLog.map((log, index) => (
              <View key={index} style={log.sender === "bot" ? styles.botBubble : styles.userBubble}>
                <Text style={log.sender === "bot" ? styles.botText : styles.userText}>
                  {log.sender === "bot" ? `Nutri: ${log.text}` : log.text}
                </Text>
              </View>
            ))}
            {loading && (
              <View style={styles.botBubble}>
                <ActivityIndicator size="small" color="#fff" />
              </View>
            )}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={userInput}
              onChangeText={setUserInput}
              placeholder="Escribe tu mensaje..."
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading}>
              <Text style={styles.sendButtonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  safeContainer: {
    flex: 1,
  },
  header: {
    paddingVertical: 15,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#4cae4f",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    paddingVertical: 17,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#66c83b",
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: "70%",
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#4cae4f",
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: "70%",
  },
  userText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  botText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderTopWidth: 1,
    borderColor: "#ddd",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  input: {
    flex: 1,
    backgroundColor: "#ffff",
    color: "#10372f",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#66c83b",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
