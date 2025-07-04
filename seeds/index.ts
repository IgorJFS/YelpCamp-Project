import mongoose from 'mongoose';
import chalk from 'chalk';
import {cities} from './cities';
import {descriptors, places} from './seedHelpers';
import Campground from '../models/campground';
import dotenv from 'dotenv';


dotenv.config();
// Função para pegar um elemento aleatório de um array
const sample = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

async function connectDb(): Promise<void> {
    try {
        await mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/yelpcamp');
        console.log(chalk.green('Conexão com o MongoDB estabelecida com sucesso yay :D!'));
    } catch (err) {
        console.error(chalk.red('Deu ruim com o MongoDB :( ) :', err));
    }
}

connectDb();




const seedDB = async (): Promise<void> => {
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

async function runSeed(): Promise<void> {
    try {
        await seedDB();
    } catch (err) {
        console.error(chalk.red('🛑 Erro ao popular o banco de dados:', err));
    } finally {
        // Garante que a conexão seja fechada, independente de erro ou sucesso
        mongoose.connection.close();
        console.log(chalk.blue('Conexão com o MongoDB encerrada.'));
    }
}

runSeed();
