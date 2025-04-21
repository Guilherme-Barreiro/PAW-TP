const axios = require('axios');

const getNutritionalInfo = async (title) => {
  try {
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
