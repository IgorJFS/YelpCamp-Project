import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import session from 'express-session';
import mongoose from 'mongoose';
import chalk from 'chalk';
import ExpressError from './utils/expressError';
import methodOverride from 'method-override';
import campgrounds from './routes/campgrounds'; // Importando as rotas de campgrounds
import reviews from './routes/reviews'; // Importando as rotas de reviews
import dotenv from 'dotenv';
import flash from 'connect-flash';
const ejsMate = require('ejs-mate');

dotenv.config();

//conexão com o banco de dados MongoDB
async function connectDb() {
    try {
        await mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/yelpcamp');
        console.log(chalk.green('Conexão com o MongoDB estabelecida com sucesso yay :D!'));
    } catch (err) {
        console.error(chalk.red('Deu ruim com o MongoDB :( ) :', err));
        process.exit(1); // isso aqui finaliza o processo se a conexão falhar
    }
}

connectDb();

const app = express();

app.engine('ejs', ejsMate); // usando ejs-mate para suporte a layouts e partials
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride('_method')); // isso aqui permite o uso de métodos HTTP como PUT e DELETE com EJS

const port = 3000;

app.get('/', (req, res) => {
  res.render('home', { title: 'YelpCamp' });
});


app.use(express.static(path.join(__dirname, 'public'))); // isso aqui serve arquivos estáticos como CSS e JS
const sessionConfig = {
  secret: 'sillysecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, // isso aqui impede que o cookie seja acessado via JavaScript
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}
app.use(session(sessionConfig)); 
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/campgrounds', campgrounds); 
app.use('/campgrounds/:id/reviews', reviews); 

app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});
// global error handler
app.use((err: ExpressError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message = 'Internal Server Error' } = err;
  res.status(statusCode).render('error', { err, title: 'Error' });
});

app.listen(port, () => {
  console.log(chalk.green(`Servidor rodando na porta ${port} yay!`));
});