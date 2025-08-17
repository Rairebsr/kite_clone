// routes/ipoRoutes.js
import express from 'express';
import { applyForIPO } from '../controllers/ipoController.js';

const router = express.Router();

router.post('/apply', applyForIPO);

export default router;
