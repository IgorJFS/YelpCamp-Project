import { Schema, model, Document } from 'mongoose';

// 1. Criar uma interface com os tipos das propriedades
export interface ICampground extends Document {
  title: string;
  image: string;
  price: number;
  description: string;
  location: string;
  reviews: Schema.Types.ObjectId[]; // Array de ObjectId que referenciam o modelo Review
}

// 2. Criar o schema baseado nos tipos da interface
const CampgroundSchema = new Schema<ICampground>({
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review"
  }]
});

// 3. Exportar o model
const Campground = model<ICampground>('Campground', CampgroundSchema);
export default Campground;
