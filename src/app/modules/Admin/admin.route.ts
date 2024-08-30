import { Router } from "express";
import { AdminControllers } from "./admin.controller";
import { Auth } from "../../middlewares/auth";

const router = Router()

router.get('/overview',Auth('admin'),AdminControllers.getAllUserBookings)


export const AdminRouter = router