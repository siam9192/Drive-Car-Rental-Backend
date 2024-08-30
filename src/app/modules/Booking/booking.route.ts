import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BookingValidations } from './booking.validation';
import { BookingController } from './booking.controller';
import { Auth } from '../../middlewares/auth';

const router = Router();

router.post(
  '/',
  Auth('user', 'admin'),
  validateRequest(BookingValidations.createBookingValidationSchema),
  BookingController.createBooking,
);

router.put(
  '/return',
  Auth('admin'),
  validateRequest(BookingValidations.updateReturnTheCarValidationSchema),
  BookingController.returnTheCar,
);

router.put(
  '/:id',
  Auth('admin'),
  validateRequest(BookingValidations.updateBookingValidationSchema),
  BookingController.updateBooking,
);


router.get('/my-bookings', Auth('user'), BookingController.getAllUserBookings);
router.get('/returnable',Auth('admin'),BookingController.getReturnableBookings)
router.get('/', Auth('admin'), BookingController.getAllBookings);
router.get('/yet-to-payment',Auth('user'),BookingController.getYetToPaymentBookings)
router.get('/:id', Auth('user'), BookingController.getBooking);
router.post('/payment-request',BookingController.handelBookingPaymentRequest)
router.post('/payment-success',BookingController.manageBookingAfterSuccessPayment)
router.post('/confirm/:id',BookingController.confirmBooking)
router.post('/cancel-booking/:id',Auth('user','admin'),BookingController.cancelBooking)
export const BookingRouter = router;
