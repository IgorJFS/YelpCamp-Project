import express from 'express';
import catchAsync from '../utils/catchAsync';
import ExpressError from '../utils/expressError';
import Campground from '../models/campground';
import chalk from 'chalk';
import { validateCampground } from '../middlewares/validateCampground';
const router = express.Router();

router.get('/', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', (req, res) => {
  res.render('campgrounds/new');
});

router.post('/', validateCampground, catchAsync(async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  console.log(chalk.green('✅Campground criado com sucesso!'));
  // Aqui você pode adicionar uma mensagem flash para o sucesso
  req.flash('success', 'Campground successfully created!');
  res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews'); // Populando os reviews pro mongodb
    if (!campground) {
        req.flash('error', 'Campground not found!');
        return res.redirect('/campgrounds');
      }
      res.render('campgrounds/show', { campground });
  }));

router.get('/:id/edit', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
      req.flash('error', 'Campground not found!');
      return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
}));

//Método PUT
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground, { new: true });
    console.log(chalk.blue('Campground atualizado com sucesso!'));
    req.flash('success', 'Campground successfully updated!');
    res.redirect(`/campgrounds/${id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    console.log(chalk.blue(`Campground deletado com sucesso!`));
    req.flash('success', 'Campground successfully deleted!');
    res.redirect('/campgrounds');
}));


// Exportando o router para ser usado no app.ts
export default router;