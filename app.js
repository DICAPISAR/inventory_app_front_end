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
const userRouter = require('./routes/user');
const searchRouter = require('./routes/search');

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
app.use('/user', userRouter);
app.use('/search', searchRouter);

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

hbs.registerHelper('adminOptionUserManager', (infoProfile) => {
  if (infoProfile.rolName === "ADMIN") {
    return '' +
        '<li class="mega-menu mega-menu-sm">\n' +
        '<a class="has-arrow" href="javascript:void()" aria-expanded="false">\n' +
        '<i class="icon-user menu-icon"></i><span class="nav-text">Gestion de Usuarios</span>\n' +
        '</a>\n' +
        '<ul aria-expanded="false">\n' +
        '<li><a href="/user/create"><i class="icon-plus menu-icon"></i>Crear</a></li>\n' +
        '<li><a href="/user/consult"><i class="icon-list menu-icon"></i>Consultar</a></li>\n' +
        '</ul>\n' +
        '</li>';
  }
})

hbs.registerHelper('generateResult', (result, resourceType) => {

  if ( result === undefined || result.length === 0) {
    return `
      <div class="card col-lg-11 container-fluid">
          <div class="row">
              <div class="col-lg-11">
                <h5>Sin resultados</h5>
              </div>
          </div>
      </div>
    `;
  }

  let results = '';

  result.forEach(item => {
    results = results + '' + `
    <div class="card col-lg-11 container-fluid" style="cursor: pointer" onclick="window.location.href='/${resourceType}/${item.id}'">
        <div class="row">
            <div class="col-lg-11">
                <p><b>Id: </b> ${item.id} &nbsp;&nbsp;&nbsp; <b>Nombre: </b> ${item.name} &nbsp;&nbsp;&nbsp; <b>Creado: </b> ${item.creationDate} &nbsp;&nbsp;&nbsp; <b>Actualizado: </b> ${item.updateDate} </p>
            </div>
        </div>
    </div>
    `
  });

  return results;
})

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
