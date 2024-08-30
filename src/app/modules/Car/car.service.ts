import AppError from '../../Errors/AppError';
import QueryBuilder from '../../QueryBuilder/QueryBuilder';
import { TCar } from './car.interface';
import { Car } from './car.model';

const createCarIntoDB = async (payload: TCar) => {
  const result = await Car.create(payload);
  return result;
};
const updateCarIntoDB = async (carId: string, payload: Partial<TCar>) => {
  // Check is the car available in the database
  const isCarExists = await Car.findById(carId);
  if (!isCarExists) {
    throw new AppError(400, 'Car  not found');
  }

  // Updating the car
  const result = await Car.findByIdAndUpdate(
    carId,
    { ...payload },
    { new: true, runValidators: true },
  );
  return result;
};

const getCarByIdFromDB = async (carId: string) => {
  const result = await Car.findById(carId);
  return result;
};
const getAllCarsFromDB = async (query:any) => {
  const location = query.location
  const type = query.type
  const brand = query.brand
  const price = query?.price?.split('-')
  
  let minPrice:number
  let  maxPrice:number;
  
  
  if(query.location){
    query.locations = query.location
   
  }
   if(price?.length){
   minPrice = Number(price[0])
   maxPrice = Number(price[1])
   if(minPrice || maxPrice){
    query.pricePerHour = {}
    if(minPrice){
      query.pricePerHour.$gt = minPrice
    }  
    if(maxPrice){
      query.pricePerHour.$lt = maxPrice
    }
  
  }
   }
 
   delete query.location
   delete query.price
  
  const data = await new QueryBuilder(Car.find(),query).search(['name','brand','description']).find().sort().paginate().get()
  const total = await new QueryBuilder(Car.find(),query).search(['name','brand','description']).find().sort().paginate().totalDocuments()
  const limit = Number(query.limit)
  const page = Number(query.page)
  return {
    meta:{
      limit,
      page,
      total
    },
    data
  }

};
const deleteCarIntoDB = async (carId: string) => {
  // Check is the car available in the database
  const isCarExists = await Car.findById(carId);

  if (!isCarExists) {
    throw new AppError(400, 'Car not found');
  }

  const result = await Car.findByIdAndUpdate(
    carId,
    { isDeleted: true },
    { new: true },
  );

  return result;
};
export const CarServices = {
  createCarIntoDB,
  updateCarIntoDB,
  getCarByIdFromDB,
  getAllCarsFromDB,
  deleteCarIntoDB,
};
