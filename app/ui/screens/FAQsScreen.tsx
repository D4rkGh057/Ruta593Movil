import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FAQsScreen = () => {
  const faqs = [
    {
      question: "¿Cómo puedo reservar un boleto?",
      answer:
        "Para reservar un boleto, simplemente ingresa a la sección de Boletos, selecciona tu origen, destino y fecha, y sigue las instrucciones para completar la reserva.",
    },
    {
      question: "¿Qué métodos de pago están disponibles?",
      answer: "Aceptamos pagos con tarjeta de crédito, débito y transferencias bancarias.",
    },
    {
      question: "¿Puedo cancelar mi reserva?",
      answer:
        "Sí, puedes cancelar tu reserva desde la sección de Perfil, en el apartado de Reservas. Las políticas de cancelación pueden variar según el operador.",
    },
    {
      question: "¿Cómo puedo contactar al soporte técnico?",
      answer: "Puedes contactar al soporte técnico desde la sección de Ayuda o enviando un correo a soporte@ruta593.com.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <SafeAreaView className="bg-yellow-300" style={styles.container}>
      <Text style={styles.title}>Preguntas Frecuentes</Text>
      {faqs.map((faq, index) => (
        <View key={faq.question} style={styles.faqItem}>
          <TouchableOpacity  style={styles.questionContainer} onPress={() => toggleAnswer(index)}>
            <Text style={styles.question}>{faq.question}</Text>
            <Ionicons name="chevron-down" size={24} color="#333" />
          </TouchableOpacity>
          {activeIndex === index && <Text style={styles.answer}>{faq.answer}</Text>}
        </View>
      ))}
      <View style={styles.footer}>
        <Image
          source={require("../../../assets/images/ruta593.png")}
          style={styles.footerImage}
        />
        <Image
          source={require("../../../assets/images/mountain.png")}
          style={styles.footerImage}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter",
    marginBottom: 16,
    textAlign: "center",
    color: "#2C3E50",
  },
  faqItem: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderBottomColor: "#000000",
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: {
    fontSize: 14,
    fontFamily: "Inter",
    color: "#333",
  },
  answer: {
    marginTop: 10,
    fontSize: 13,
    fontFamily: "Inter",
    color: "#666",
    lineHeight: 22,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    paddingVertical: 16,
  },
  footerImage: {
    width: 100,
    height: 50,
    marginHorizontal: 8,
    resizeMode: "contain",
  },
});

export default FAQsScreen;
