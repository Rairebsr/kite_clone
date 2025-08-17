import express from 'express'
import { deleteWatchlist, renameWatchlist, save, view } from '../controllers/watchlistController.js';

const listRouter = express.Router();

listRouter.post('/save',save)
listRouter.get('/view',view)
listRouter.post('/rename',renameWatchlist)
listRouter.post('/delete',deleteWatchlist)

export default listRouter;