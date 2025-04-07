require('dotenv').config();
const mongoose = require('mongoose');

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session'); // <-- importação do express-session

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const restaurantsRouter = require('./routes/restaurants');
const authRoutes = require('./routes/auth'); // <-- rota de login
app.use('/', authRoutes);

const app = express();

// Conexão à base de dados MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Ligado ao MongoDB Atlas!'))
  .catch(err => console.error('❌ Erro ao ligar ao MongoDB:', err));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Sessão
app.use(session({
  secret: 'segredo-super-segurissimo-hihihihi', // ⚠️ troca isto por uma env var no futuro
  resave: false,
  saveUninitialized: false
}));
app.use((req, res, next) => { // permite aceder a session.user e outras variáveis globais em qualquer EJS
  res.locals.session = req.session;
  next();
});

// Rotas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/restaurants', restaurantsRouter);
app.use('/', authRoutes); // login, registo, etc.

// 404 handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
