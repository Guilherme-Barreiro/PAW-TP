const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'RestGest API',
            version: '1.0.0',
            description: 'Documentação da API RESTful para o sistema de gestão de restaurantes.',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
            },
        ],
        tags: [
            {
                name: 'Restaurantes',
                description: 'Endpoints relacionados com os restaurantes',
            },
            {
                name: 'Categorias',
                description: 'Endpoints das categorias de pratos',
            },
            {
                name: 'Utilizadores',
                description: 'Endpoints de autenticação e gestão de utilizadores',
            },
            {
                name: 'Funcionários',
                description: 'Endpoints relacionados com os funcionários',
            },
            {
                name: 'Pedidos',
                description: 'Endpoints relacionados com os pedidos (orders)',
            }
        ],
    },
    apis: ['./routes/api/*.js'], // Onde estão as tuas rotas anotadas com Swagger
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
