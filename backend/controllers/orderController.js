import Orders from "../model/Orders.js";
import Fund from "../model/Fund.js";
import Cart from "../model/Cart.js";

export const addOrder = async (req, res) => {
  try {
    const {
      userId,
      stockSymbol,
      stockName,
      price,
      quantity: rawQty,
      stopLoss,
      orderType,
      productType,
      tabType,
      validity,
      disclosedQty,
      timestamp,
      segment,
      basketName,
      exchange
    } = req.body;

    const quantity = parseInt(rawQty);
    const isBuy = req.body?.val !== 'Sell';

    // Find or create fund for user
    let fund = await Fund.findOne({ userId });
    if (!fund) {
      fund = new Fund({ userId });
    }

    // Validate segment (equity or commodity)
    if (!['EQUITY', 'COMMODITY'].includes(segment)) {
      return res.status(400).json({ message: 'Invalid segment' });
    }

    const fundSegment = fund[segment.toLowerCase()];
    const totalPrice = price * quantity;
    // const order = await Order.create({
    //   ...orderData,
    //   basketName: orderData.basketName || null
    // });
    // === BUY ORDER ===
    if (isBuy) {
      if (fundSegment.availableMargin < totalPrice) {
        return res.status(400).json({ message: 'Insufficient margin' });
      }

      // Deduct from availableMargin and update usedMargin
      fundSegment.availableMargin -= totalPrice;
      fundSegment.usedMargin += totalPrice;

      const existingOrder = await Orders.findOne({ userId, stockSymbol, segment, exchange, basketName: basketName || null});

      if (existingOrder) {
        existingOrder.quantity += quantity;
        existingOrder.price = price; // you may average this
        await existingOrder.save();
      } else {
        const newOrder = new Orders({
          userId,
          stockSymbol,
          stockName,
          price,
          quantity,
          stopLoss,
          orderType,
          productType,
          tabType,
          validity,
          disclosedQty,
          timestamp,
          segment,
          exchange,   // ✅ saves basket reference
          basketName: basketName || null
        });
        await newOrder.save();
      }

      await fund.save();
      return res.status(200).json({ message: 'Buy order processed' });
    }

    // === SELL ORDER ===
    else {
      const existingOrder = await Orders.findOne({ userId, stockSymbol, segment, exchange, basketId: basketId || null  });

      if (!existingOrder) {
        return res.status(400).json({ message: 'You do not own this stock in this segment' });
      }

      if (existingOrder.quantity < quantity) {
        return res.status(400).json({ message: 'Cannot sell more than you own' });
      }

      existingOrder.quantity -= quantity;

      // Credit margin back
      fundSegment.availableMargin += totalPrice;
      fundSegment.usedMargin = Math.max(0, fundSegment.usedMargin - totalPrice); // avoid negative

      if (existingOrder.quantity === 0) {
        await Orders.deleteOne({ _id: existingOrder._id });
      } else {
        await existingOrder.save();
      }

      await fund.save();
      return res.status(200).json({ message: 'Sell order processed' });
    }

  } catch (err) {
    console.error('Order placement error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// GET /api/order/basketorders?userId=xxx&basketName=yyy
export const getOrdersByBasket = async (req, res) => {
  try {
    const { userId, basketName } = req.query;
    if (!userId || !basketName) {
      return res.status(400).json({ message: "userId and basketName are required" });
    }

    const orders = await Orders.find({ userId, basketName });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching basket orders:", err);
    res.status(500).json({ message: "Failed to fetch basket orders" });
  }
};


export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Orders.find({ userId: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
export const deleteBasket = async (req, res) => {
  const { basketName, userId } = req.body;

  if (!basketName || !userId) return res.status(400).json({ message: "basketName and userId required" });

  try {
    await Basket.findOneAndDelete({ name: basketName, userId });
    await Orders.deleteMany({ basketName, userId });

    res.status(200).json({ message: "Basket and its orders deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete basket", error: err.message });
  }
};
// GET /api/positions/:userId
export const getposition = async (req, res) => {
  try {
     const { userId } = req.params;
  const positions = await Orders.find({ userId, productType: 'Intraday' });
  res.json(positions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch position" });
  }
 
};

export const setcart =  async (req, res) => {
  const { userId, item } = req.body;

  try {
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $addToSet: { items: item } }, // prevent duplicates
      { upsert: true, new: true }
    );
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

export const updatecart = async (req, res) => {
  const { userId, itemId, updates } = req.body;

  try {
    const result = await Cart.findOneAndUpdate(
      { userId, "items._id": itemId },
      {
        $set: Object.fromEntries(
          Object.entries(updates).map(([k, v]) => [`items.$.${k}`, v])
        )
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Item updated", result });
  } catch (err) {
    console.error("Error updating cart item:", err);
    res.status(500).json({ message: "Failed to update cart", error: err.message });
  }
};


export const getcart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    res.status(200).json(cart || { cart: [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// Example Express route
export const cartremove = async (req, res) => {
  const { userId, itemId } = req.body;

  try {
    const result = await Cart.updateOne(
      { userId },
      { $pull: { items: { _id: itemId } } }
    );

    res.status(200).json({ message: 'Item removed', result });
  } catch (error) {
    res.status(500).json({ message: 'Error removing item', error });
  }
};


// clearcart.js (or inside your existing controller)
export const clearCart = async (req, res) => {
  const { userId } = req.body;

  try {
    const result = await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Cart cleared", result });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear cart", error: err.message });
  }
};

// GET all orders for a specific basket


export const placeAllOrders = async (req, res) => {
  const { userId, basketName } = req.body; // ✅ basketName passed from frontend

  if (!basketName) {
    return res.status(400).json({ message: 'Basket name is required' });
  }

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Filter only items from the selected basket
    const basketItems = cart.items.filter(item => item.basketName === basketName);

    if (basketItems.length === 0) {
      return res.status(400).json({ message: 'No items in this basket to place orders' });
    }

    const fund = await Fund.findOne({ userId });
    if (!fund) {
      return res.status(400).json({ message: 'No fund account found' });
    }

    // Calculate total cost per segment
    const segmentTotals = {};
    for (const item of basketItems) {
      if (item.val === 'Sell') continue;
      const key = item.segment.toLowerCase();
      const cost = item.price * item.quantity;
      segmentTotals[key] = (segmentTotals[key] || 0) + cost;
    }

    for (const seg of Object.keys(segmentTotals)) {
      const segFund = fund[seg];
      if (!segFund || segFund.availableMargin < segmentTotals[seg]) {
        return res.status(400).json({
          message: `Insufficient margin for segment ${seg.toUpperCase()}`
        });
      }
    }

    // Deduct funds
    for (const item of basketItems) {
      const segKey = item.segment.toLowerCase();
      const cost = item.price * item.quantity;
      const isBuy = item.val !== 'Sell';

      if (isBuy) {
        fund[segKey].availableMargin -= cost;
        fund[segKey].usedMargin += cost;
      } else {
        fund[segKey].availableMargin += cost;
        fund[segKey].usedMargin = Math.max(0, fund[segKey].usedMargin - cost);
      }
    }

    // Prepare order docs with basketName
    const orderDocs = basketItems.map(item => ({
      userId,
      stockSymbol: item.symbol,
      stockName: item.name,
      price: item.price,
      quantity: item.quantity,
      stopLoss: item.stopLoss,
      orderType: item.orderType,
      productType: item.productType,
      tabType: item.tabType,
      validity: item.validity,
      disclosedQty: item.disclosedQty,
      segment: item.segment,
      exchange: item.exchange,
      basketName, // ✅ Save the basket name
      timestamp: new Date(),
    }));

    await Orders.insertMany(orderDocs);

    // Remove only the items placed from this basket
    cart.items = cart.items.filter(item => item.basketName !== basketName);
    await cart.save();
    await fund.save();

    res.status(200).json({ message: 'Orders from basket placed successfully' });

  } catch (error) {
    console.error('Error placing basket orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
