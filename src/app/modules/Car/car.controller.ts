import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { CarServices } from './car.service';
import sendResponse, {
  SendDataNotFoundResponse,
} from '../../utils/sendResponse';

const createCar = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await CarServices.createCarIntoDB(payload);
  sendResponse(res, {
    statusCode: 201,
    status: true,
    message: 'Car created successfully',
    data: result,
  });
});

const updateCar = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const { carId } = req.params;
  const result = await CarServices.updateCarIntoDB(carId, payload);
  sendResponse(res, {
    statusCode: 201,
    status: true,
    message: 'A Car updated successfully',
    data: result,
  });
});

const getCarById = catchAsync(async (req: Request, res: Response) => {
  const { carId } = req.params;
  const result = await CarServices.getCarByIdFromDB(carId);
  if (!result) {
    SendDataNotFoundResponse(res);
    return;
  }

  sendResponse(res, {
    statusCode: 200,
    status: true,
    message: 'Car  retrieved successfully',
    data: result,
  });
});
const getAllCars = catchAsync(async (req: Request, res: Response) => {
  const query = req.query
  const result = await CarServices.getAllCarsFromDB(query);

  sendResponse(res, {
    statusCode: 201,
    status: true,
    message: result.data.length ? 'Car  retrieved successfully' :'No results found',
    data: result,
  });
});

const deleteCar = catchAsync(async (req: Request, res: Response) => {
  const { carId } = req.params;
  const result = await CarServices.deleteCarIntoDB(carId);

  // if the result is empty

  sendResponse(res, {
    statusCode: 200,
    status: true,
    message: 'Car  deleted successfully',
    data: result,
  });
});
export const carControllers = {
  createCar,
  updateCar,
  getCarById,
  getAllCars,
  deleteCar,
};
