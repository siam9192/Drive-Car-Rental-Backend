import { Booking } from "../Booking/Booking.model"
import { Car } from "../Car/car.model";
import { User } from "../User/user.model"

const getOverViewDataFromBD = async()=>{
const users = await User.find().countDocuments()
const booking = await Booking.find().countDocuments();
let revenue = await Booking.aggregate([
    {
        $match:{
            isPaid:true
        }
    },
    {
        $group:{
            _id:null,
            total:{$sum:'$totalCost'}
        }
    }
])
revenue = revenue[0]?.total.toFixed(2) || 0

const availableCars = await Car.find({status:'available'}).countDocuments()
const recentBookings = await Booking.find({}).sort({createdAt:-1}).limit(10).populate(['user','car'])

const result = {
    users,
    booking,
    revenue,
    availableCars,
    recentBookings
}
return result
}

export const AdminServices = {
    getOverViewDataFromBD
}