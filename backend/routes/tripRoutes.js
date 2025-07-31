import express from "express";
import {createTrip, getTrip, deleteTrip} from "../controllers/tripController.js";
import authMiddleware from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.use(authMiddleware);

router.post('/create-trip',authMiddleware, createTrip);
router.get('/get-trip',authMiddleware, getTrip);
router.delete('/delete-trip/:id',authMiddleware, deleteTrip);


export default router;