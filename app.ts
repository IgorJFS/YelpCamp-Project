import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import mongoose from 'mongoose';
import chalk from 'chalk';
import ExpressError from './utils/expressError';
import catchAsync from './utils/catchAsync';
import Campground from './models/campground'; 
import methodOverride from 'method-override';
import { validateCampground } from './middlewares/validateCampground';
import { validateReview } from './middlewares/validateReview';
import Review from './models/review'; // Importando o modelo de Review
const ejsMate = require('ejs-mate');

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
app.use(methodOverride('_method')); // isso aqui permite o uso de métodos HTTP como PUT e DELETE com a porra do EJS

const port = 3000;

app.get('/', (req, res) => {
  res.render('home', { title: 'YelpCamp' });
});

app.get('/campgrounds', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
}));

 app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  console.log(chalk.green('✅Campground criado com sucesso!'));
  res.redirect(`/campgrounds/${campground._id}`);
}));

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        throw new ExpressError('Campground not found', 404);
      }
      res.render('campgrounds/show', { campground });
  }));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', { campground });
}));


app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground, { new: true });
    console.log(chalk.blue('Campground atualizado com sucesso!'));
    res.redirect(`/campgrounds/${id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    console.log(chalk.blue(`Campground deletado com sucesso!`));
    res.redirect('/campgrounds');
}));

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    throw new ExpressError('Campground not found', 404);
  }
  const review = new Review(req.body.review);
  campground.reviews.push(review as any); 
  await review.save();
  await campground.save();
  console.log(chalk.green('Review successfully added!'));
  res.redirect(`/campgrounds/${campground._id}`);
}));

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