const axios = require('axios');

// Função que obtém informação nutricional para um prato através da API Spoonacular
const getNutritionalInfo = async (title) => {
  try {
    // Através do titulo do prato, ele vai responder com a informação nutricional desse prato caso exista na API
    const response = await axios.get('https://api.spoonacular.com/recipes/guessNutrition', {
      params: {
        title, 
        apiKey: process.env.SPOONACULAR_API_KEY, 
      },
    });

    return response.data; 
  } catch (error) {

    console.error('Erro ao obter dados nutricionais:', error.message);
    return null;
  }
};

module.exports = { getNutritionalInfo };
