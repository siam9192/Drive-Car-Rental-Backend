import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { BookingServices } from './booking.service';
import sendResponse, {
  SendDataNotFoundResponse,
} from '../../utils/sendResponse';
import httpStatus from 'http-status';
import config from '../../config';

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  payload.email = req.user.email;
  const result = await BookingServices.createBookingIntoDB(payload);
  sendResponse(res, {
    status: true,
    statusCode: 201,
    message: 'Car booked successfully',
    data: result,
  });
});
const updateBooking = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await BookingServices.updateBookingIntoDB(id, payload);
  sendResponse(res, {
    status: true,
    statusCode: 200,
    message: 'Booking updated successfully',
    data: result,
  });
});
const returnTheCar = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await BookingServices.returnTheCar(payload);
  sendResponse(res, {
    status: true,
    statusCode: 200,
    message: 'Car returned successfully',
    data: result,
  });
});

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await BookingServices.getAllBookingsFromDB(query);
  if (result && result.length) {
    sendResponse(res, {
      status: true,
      statusCode: 200,
      message: 'Bookings retrieved successfully',
      data: result,
    });
  } else {
    SendDataNotFoundResponse(res);
  }
});
const getBooking = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await BookingServices.getBookingFromDB(id)
    sendResponse(res, {
      status: true,
      statusCode: 200,
      message: 'Booking retrieved successfully',
      data: result,
    });
  } 
);
const confirmBooking = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await BookingServices.confirmBookingIntoDB(id);

    sendResponse(res, {
      status: true,
      statusCode: 200,
      message: '',
      data: result,
    });
  
});
const getReturnableBookings =  catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await BookingServices.getReturnableBookingsFromDB(query);
  
    sendResponse(res, {
      status: true,
      statusCode: httpStatus.OK,
      message: 'Bookings retrieved successfully',
      data: result,
    });

});

const getAllUserBookings = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.user;
  const result = await BookingServices.getAllUserBookingsFromDB(email);
  if (result && result.length) {
    sendResponse(res, {
      statusCode: 200,
      status: false,
      message: 'My Bookings retrieved successfully',
      data: result,
    });
  } else {
    SendDataNotFoundResponse(res);
  }
});
const getYetToPaymentBookings = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.user;

  const result = await BookingServices.getYetToPaymentBookingsFromDB(email);
  if (result && result.length) {
    sendResponse(res, {
      statusCode: 200,
      status: false,
      message: 'Bookings retrieved successfully',
      data: result,
    });
  } else {
    SendDataNotFoundResponse(res);
  }
});

const handelBookingPaymentRequest = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
   const result = await BookingServices.HandelBookingPaymentRequest(res,payload)
   
  sendResponse(res, {
       statusCode: 200,
       status: false,
       message: 'Request accepted',
       data: result,
     });
   
});
const manageBookingAfterSuccessPayment = catchAsync(async (req: Request, res: Response) => {
  const id = req.query.id;
 const result = await BookingServices.manageBookingAfterSuccessPayment(res,id as string)
 sendResponse(res, {
  statusCode: httpStatus.OK,
  status: false,
  message: 'success',
  data: result,
});

});
const cancelBooking = catchAsync(async (req: Request, res: Response) => {
   const bookingId = req.params.id
   const result = await BookingServices.cancelBookingIntoDB(bookingId)
   
  sendResponse(res, {
       statusCode: 200,
       status: false,
       message: 'Booking canceled successfully',
       data: result,
     });
   
});

export const BookingController = {
  createBooking,
  updateBooking,
  returnTheCar,
  getAllBookings,
  getAllUserBookings,
  getReturnableBookings,
  getYetToPaymentBookings,
  handelBookingPaymentRequest,
  manageBookingAfterSuccessPayment,
  confirmBooking,
  getBooking,
  cancelBooking
};
