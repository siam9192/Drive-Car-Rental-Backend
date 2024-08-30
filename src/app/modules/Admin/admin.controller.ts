import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AdminServices } from "./admin.service";
import sendResponse from "../../utils/sendResponse";

const getAllUserBookings = catchAsync(async (req: Request, res: Response) => {
   
    const result = await AdminServices.getOverViewDataFromBD()
      sendResponse(res, {
        statusCode: 200,
        status: false,
        message: 'Overview retrieved successfully',
        data: result,
      });
    } 
  );
  

  export const AdminControllers = {
  getAllUserBookings
  }