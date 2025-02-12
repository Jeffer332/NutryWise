// src/services/chatbotService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCkXZNDIA_AF9Ruk3aM2SCz4qMIgT5-3mQ");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const askChatbot = async (message, userData) => {
  try {
    if (!userData || !userData.userId || !userData.name) {
      throw new Error("No se recibió un usuario válido.");
    }

    const context = `
      Eres un asistente especializado en Nutrición, Salud y Ejercicio. 
      Debes proporcionar recomendaciones personalizadas basadas en los datos del usuario.

      Datos del usuario:
      - Nombre: ${userData.name}  // Se usa "name" en lugar de "nombre"
      - Edad: ${userData.edad} años
      - Peso: ${userData.peso} kg
      - Estatura: ${userData.estatura} cm

      Tu función es ayudar al usuario con:
      - Consejos sobre alimentación saludable
      - Recetas adecuadas a su perfil
      - Rutinas de ejercicio recomendadas según su peso y estatura
      - Consejos para mejorar su bienestar general
      
      Solo responde preguntas relacionadas con estos temas y proporciona información confiable y útil.
      NO uses formato con asteriscos (*), solo texto plano.
      
      Pregunta del usuario: ${message}
    `;

    const result = await model.generateContent(context);
    return result?.response?.candidates?.[0]?.content?.parts?.[0]?.text.trim() || "No se pudo obtener respuesta.";
  } catch (error) {
    console.error("Error en el chatbot:", error);
    return "Error en la respuesta del chatbot.";
  }
};
