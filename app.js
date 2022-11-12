const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');

const indexRouter = require('./routes/index');
const errorRouter = require('./routes/error');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const brandRouter = require('./routes/brand');
const typeItemRouter = require('./routes/type_item');
const providerRouter = require('./routes/provider');
const profileRouter = require('./routes/profile');
const itemRouter = require('./routes/item');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/error', errorRouter)
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/brand', brandRouter);
app.use('/type_item', typeItemRouter);
app.use('/provider', providerRouter);
app.use('/profile', profileRouter);
app.use('/item', itemRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) =>  {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// handlebar register helpers
/* handler by status error message */
hbs.registerHelper('ifStatus', (status) => {
  let title = '';
  let message = '';
  let statusError = status;

  if (status >= 400 && status <= 499) {
    title = 'Recurso No Encontrado';
    message = 'El Recurso Solicitado No Fue Encontrado';
  }

  if (status >= 500 && status <= 599) {
    title = 'Error Interno';
    message = 'Estamos presentando errores en los servicios, por favor volver a intentar más tarde.';
  }

  return `
   <h1 class="error-text text-primary">${statusError}</h1>
   <h4 class="mt-4"><i class="fa fa-thumbs-down text-danger"></i>${title}</h4>
   <p>${message}</p>
  `
});

/* handler by status error message */
hbs.registerHelper('generateSelect', (entityList, indexOptionSelected) => {

  let options = '';

  if (indexOptionSelected === undefined) {
    options = "<option value=\"\">Por favor seleccionar una opción</option>";

    if (entityList !== undefined) {
      entityList.forEach(entity => {
        let name = entity.name;
        let index = entity.id;
        options = options + '\n' + generateOption(name, index);
      })
    }
  } else {
    if (entityList !== undefined) {
      entityList.forEach(entity => {
        let name = entity.name;
        let index = entity.id;
        if (index !== indexOptionSelected) {
          options = options + '\n' + generateOption(name, index);
        } else {
          options = generateOption(name, index) + '\n' + options;
        }
      })
    }
  }

  return options

});

function generateOption(name, value) {
  return `<option value="${value}">${name}</option>`
}

module.exports = app;
