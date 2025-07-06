import { Schema, model, Document, Mongoose } from 'mongoose';
import Review from './review';

//Isso aqui é apenas extra para o TypeScript entender que estamos usando o Mongoose
export interface ICampground extends Document {
  title: string;
  image: string;
  price: number;
  description: string;
  location: string;
  reviews: Schema.Types.ObjectId[]; // Array de ObjectId que referenciam o modelo Review
}

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

CampgroundSchema.post('findOneAndDelete', async function (doc){
  if (doc) {
    await Review.deleteMany({
      _id: { $in: doc.reviews }
    })
  }    
})

const Campground = model<ICampground>('Campground', CampgroundSchema);
export default Campground;
