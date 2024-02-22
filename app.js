const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const usersDao = require('./models/usersDao');
const app = express();

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie:{secure:false}
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    usersDao.getUserById(id).then(user => {
        done(null, user);
    });
});

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, done) => {
  usersDao.getUser(email,password)
      .then(({user, check}) => {
        if (!user) {
          console.log('Incorrect username');
          return done(null, false, {message: 'Incorrect username.'});
        }
        if (!check) {
          console.log('Incorrect password');
          return done(null, false, {message: 'Incorrect password.'});
        }
        return done(null, user);
      })
      .catch(err => {
        return done(err);
      })
}));

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const carsRouter = require('./routes/cars');
const userRouter = require('./routes/user');
const cardsRouter = require('./routes/cards');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/cars', carsRouter);
app.use('/user', userRouter);
app.use('/cards', cardsRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
