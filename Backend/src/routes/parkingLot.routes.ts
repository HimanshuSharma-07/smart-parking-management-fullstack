import { Router } from "express"
import { createParkingLot, getParkingLotById, updateParkingLot, getAllParkingLots, deleteParkingLot } from "../controllers/parkingLot.controller"
import { verifyJWT } from "../middlewares/auth.middleware"
import { upload } from "../middlewares/multer.middleware"




const router = Router()


router.route("/create-parking-lot").post(
    verifyJWT, 
    upload.fields([
        {
            name: "parkingLotImage",
            maxCount: 1,
        },
    ]),
    createParkingLot)

router.route("/all-parking-lots").get(verifyJWT, getAllParkingLots)

router.route("/parking-lot/:id").get(verifyJWT, getParkingLotById)


router.route("/parking-lot/:id").patch(
    verifyJWT, 

    upload.fields([
        {
            name: "parkingLotImage",
            maxCount: 1,
        },
    ]),
    updateParkingLot)

router.route("/delete-parking-lot/:id").delete(verifyJWT, deleteParkingLot)

export default router