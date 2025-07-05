import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import mongoose from 'mongoose';
import chalk from 'chalk';
import ExpressError from './utils/expressError';
import catchAsync from './utils/catchAsync';
import Campground from './models/campground'; 
import methodOverride from 'method-override';
import { validateCampground } from './middlewares/validateCampground';
const ejsMate = require('ejs-mate');

//conexão com o banco de dados MongoDB
async function connectDb() {
    try {
        await mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/yelpcamp');
        console.log(chalk.green('Conexão com o MongoDB estabelecida com sucesso yay :D!'));
    } catch (err) {
        console.error(chalk.red('Deu ruim com o MongoDB :( ) :', err));
    }
}

connectDb();

const app = express();

app.engine('ejs', ejsMate); // usando ejs-mate para suporte a layouts e partials
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride('_method')); // isso aqui permite o uso de métodos HTTP como PUT e DELETE com a porra do EJS

const port = 3000;

app.get('/', (req, res) => {
  res.render('home', { title: 'YelpCamp' });
});

app.get('/campgrounds', async (req, res) => {
  try {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  } catch (err) {
    console.error(chalk.red('Erro ao buscar campgrounds:', err));
    res.status(500).send('Erro ao buscar campgrounds');
  }
});

  app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.post('/campgrounds', validateCampground, async (req, res) => {
  try {
    const campground = new Campground(req.body.campground);
    await campground.save();
    console.log(chalk.green('✅Campground criado com sucesso!'));
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (err) {
    console.error(chalk.red('Erro ao criar campground:', err));
    res.status(500).send('Erro ao criar campground');
  }
});

  app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
  });

app.get('/campgrounds/:id/edit', async (req, res) => {
  try {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
  } catch (err) {
    console.error(chalk.red('Erro ao buscar campground para edição:', err));
    res.status(500).send('Erro ao buscar campground para edição');
  }
});

app.put('/campgrounds/:id', validateCampground, async (req, res) => {
  const { id } = req.params;
  try {
    await Campground.findByIdAndUpdate(id, req.body.campground, { new: true });
    console.log(chalk.blue('Campground atualizado com sucesso!'));
    res.redirect(`/campgrounds/${id}`);
  } catch (err) {
    console.error(chalk.red('Erro ao atualizar campground:', err));
    res.status(500).send('Erro ao atualizar campground');
  }
});

app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Campground.findByIdAndDelete(id);
    console.log(chalk.blue(`Campground deletado com sucesso!`));
    res.redirect('/campgrounds');
  } catch (err) {
    console.error(chalk.red('Erro ao deletar campground:', err));
    res.status(500).send('Erro ao deletar campground');
  }
});
app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err: ExpressError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message = 'Internal Server Error' } = err;
  res.status(statusCode).render('error', { err, title: 'Error' });
});

app.listen(port, () => {
  console.log(chalk.green(`Servidor rodando na porta ${port} yay!`));
});