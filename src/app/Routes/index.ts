import { Router } from 'express';
import { AuthRouter } from '../modules/Auth/auth.route';
import { CarRouter } from '../modules/Car/car.route';
import { BookingRouter } from '../modules/Booking/booking.route';
import { UserRouter } from '../modules/User/user.route';
import { AdminRouter } from '../modules/Admin/admin.route';
const router = Router();
const moduleRoutes: { path: string; route: any }[] = [
  {
    path: '/auth',
    route: AuthRouter,
  },
  {
    path: '/users',
    route: UserRouter,
  },
  {
    path: '/cars',
    route: CarRouter,
  },
  {
    path: '/bookings',
    route: BookingRouter,
  },
  {
    path: '/admin',
    route: AdminRouter,
  },
];

moduleRoutes.forEach((ele) => {
  router.use(ele.path, ele.route);
});

export default router;
