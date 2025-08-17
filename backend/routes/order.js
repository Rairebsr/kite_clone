import express from 'express'
import { addOrder, cartremove, clearCart, getcart, getOrdersByUser, getposition, placeAllOrders, setcart, updatecart, getOrdersByBasket,deleteBasket } from '../controllers/orderController.js'


const orderRouter = express.Router()

orderRouter.post('/addorder',addOrder)
orderRouter.get('/getorder/:userId', getOrdersByUser);
orderRouter.get('/getposition/:userId',getposition);
orderRouter.post('/cart',setcart);
orderRouter.post('/updatecart',updatecart);
orderRouter.get('/getcart/:userId',getcart);
orderRouter.post('/clearcart',clearCart);
orderRouter.post('/placeall',placeAllOrders);
orderRouter.post('/remove',cartremove);
orderRouter.get("/basketorders", getOrdersByBasket);

export default orderRouter