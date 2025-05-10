require('dotenv').config();
const mongoose = require('mongoose');

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const app = express();

// Importa as routes necessárias

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const restaurantsRouter = require('./routes/restaurants');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const adminRoutes = require('./routes/admin');
const employeeRoutes = require('./routes/employee');
const restaurantApiRoutes = require('./routes/api/restaurants_api');

// Liga à base de dados do MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Ligado ao MongoDB Atlas!'))
  .catch(err => console.error('❌ Erro ao ligar ao MongoDB:', err));

// Configura as views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares default
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Sessão
app.use(session({
  secret: 'segredo-super-segurissimo-hihihihi',
  resave: false,
  saveUninitialized: false
}));

// Disponibilizar sessão e título em todas as views
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.title = 'RestGest';
  next();
});

// Rotas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/restaurants', restaurantsRouter);
app.use('/user', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/admin', adminRoutes);
app.use('/employee', employeeRoutes);
app.use('/api/restaurants', restaurantApiRoutes);

// Erro 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Tratamento de erros
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
