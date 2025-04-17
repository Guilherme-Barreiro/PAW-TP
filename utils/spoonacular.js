const axios = require('axios');
const API_KEY = process.env.SPOONACULAR_API_KEY; // define no .env

exports.getNutritionalInfo = async (nomeDoPrato) => {
  try {
    const response = await axios.get(`https://api.spoonacular.com/recipes/guessNutrition`, {
      params: {
        title: nomeDoPrato,
        apiKey: API_KEY
      }
    });

    return response.data;
  } catch (err) {
    console.error('Erro ao buscar info nutricional:', err.message);
    return null;
  }
};
