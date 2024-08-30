import { Model, Types } from 'mongoose';

export type TCar = {
  name: string;
  description: string;
  images: Array<string>;
  color: string;
  isElectric: boolean;
  seats: number;
  brand: string;
  status?: 'available' | 'unavailable';
  type:string
  features: Array<string>;
  insurances: Array<string>;
  locations: Array<string>;
  pricePerHour: number;
  rating: number;
  reviews: number;
  isDeleted?: boolean;
};

export interface TCarStaticMethods extends Model<TCar> {
  isCarExists(carId: string): Promise<TCar & { _id: Types.ObjectId }>;
}
