import express, { Request, Response } from 'express';
import path from 'path';
import mongoose from 'mongoose';
import chalk from 'chalk';
import Campground from './models/campground'; 
import methodOverride from 'method-override';
const ejsMate = require('ejs-mate'); // Importando ejs-mate para suporte a layouts e partials

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

app.get('/', (req: Request, res: Response) => {
  res.render('home', { title: 'YelpCamp' });
});

app.get('/campgrounds', async (req: Request, res: Response) => {
  try {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  } catch (err) {
    console.error(chalk.red('Erro ao buscar campgrounds:', err));
    res.status(500).send('Erro ao buscar campgrounds');
  }});

  app.get('/campgrounds/new', (req: Request, res: Response) => {
  res.render('campgrounds/new');
});

app.post('/campgrounds', async (req: Request, res: Response) => {
  const campground = new Campground(req.body.campground);
  try {
    await campground.save();
    console.log(chalk.green('✅Campground criado com sucesso!'));
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (err) {
    console.error(chalk.red('Erro ao criar campground:', err));
    res.status(500).send('Erro ao criar campground');
  }
});

  app.get('/campgrounds/:id', async (req: Request, res: Response) => {
  try {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
  } catch (err) {
    console.error(chalk.red('Erro ao buscar campground:', err));
    res.status(500).send('Erro ao buscar campground');
  }
});

app.get('/campgrounds/:id/edit', async (req: Request, res: Response) => {
  try {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
  } catch (err) {
    console.error(chalk.red('Erro ao buscar campground para edição:', err));
    res.status(500).send('Erro ao buscar campground para edição');
  }
});

app.put('/campgrounds/:id', async (req: Request, res: Response) => {
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

app.delete('/campgrounds/:id', async (req: Request, res: Response) => {
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

app.listen(port, () => {
  console.log(chalk.green(`Servidor rodando na porta ${port} yay!`));
});