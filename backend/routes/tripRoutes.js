import express from "express";
import {createTrip} from "../controllers/tripController.js";

const router = express.Router();

router.post('/create-trip', createTrip);
router.post('/get-trip', getTrip);
router.delete('/delete-trip/:id', deleteTrip);


export default router;