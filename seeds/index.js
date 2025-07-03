const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const { default: chalk } = require('chalk');
const Campground = require('../models/campground');

mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/yelpcamp')
.then(() => {
  console.log(chalk.green('Conexão com o MongoDB estabelecida com sucesso yay :D!'));
}).catch(err => {
  console.error(chalk.red('Deu ruim com o MongoDB :( ) :', err));
});


const sample = array => array[Math.floor(Math.random() * array.length)]; // Função para pegar um elemento aleatório de um array


const seedDB = async () => {
  await Campground.deleteMany({});
  console.log(chalk.yellow('⚠️ Todos os campgrounds foram removidos!'));
    for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        image: `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/400/400`,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        price: price,

    })
    await camp.save();
    }
}

seedDB().then(() => {
  console.log(chalk.green('Banco de dados populado com sucesso!'));
  mongoose.connection.close();
}).catch(err => {
  console.error(chalk.red('🛑Erro ao popular o banco de dados:', err));
  mongoose.connection.close();
});


//image: `https://picsum.photos/400?random=${Math.random()}`,