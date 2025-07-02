const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { default: chalk } = require('chalk');
const Campground = require('./models/campground');
const methodOverride = require('method-override');

//conexão com o banco de dados MongoDB
mongoose.connect('mongodb://localhost:27017/yelpcamp')
.then(() => {
  console.log(chalk.green('Conexão com o MongoDB estabelecida com sucesso yay :D!'));
}).catch(err => {
  console.error(chalk.red('Deu ruim com o MongoDB :( ) :', err));
});


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
  }});

  app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.post('/campgrounds', async (req, res) => {
  const campground = new Campground(req.body.campground);
  try {
    await campground.save();
    console.log(chalk.green('Campground criado com sucesso!'));
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (err) {
    console.error(chalk.red('Erro ao criar campground:', err));
    res.status(500).send('Erro ao criar campground');
  }
});

  app.get('/campgrounds/:id', async (req, res) => {
  try {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
  } catch (err) {
    console.error(chalk.red('Erro ao buscar campground:', err));
    res.status(500).send('Erro ao buscar campground');
  }
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

app.put('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndUpdate(id, req.body.campground, { new: true })
    .then(campground => {
      console.log(chalk.blue('Campground atualizado com sucesso!'));
      res.redirect(`/campgrounds/${campground._id}`);
    })
    .catch(err => {
      console.error(chalk.red('Erro ao atualizar campground:', err));
      res.status(500).send('Erro ao atualizar campground');
    });
})

app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id)
    .then(() => {
      console.log(chalk.blue(`Campground deletado com sucesso!`));
      res.redirect('/campgrounds');
    })
    .catch(err => {
      console.error(chalk.red('Erro ao deletar campground:', err));
      res.status(500).send('Erro ao deletar campground');
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});