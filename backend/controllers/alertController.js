// controllers/alertController.js
import Alert from '../model/Alert.js'

// Create Alert
export const createAlert = async (req, res) => {
  try {
    const alert = new Alert(req.body)
    await alert.save()
    res.status(201).json(alert)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create alert', error: err })
  }
}

// Get Alerts in a Basket
export const getAlerts = async (req, res) => {
  try {
    const { userId, basketName } = req.params
    const alerts = await Alert.find({ userId, alertBasketName: basketName })
    res.status(200).json(alerts)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch alerts', error: err })
  }
}

// Delete Selected Alerts
export const deleteSelectedAlerts = async (req, res) => {
  try {
    const { userId, basketName } = req.body
    const result = await Alert.deleteMany({ userId, alertBasketName: basketName, isSelected: true })
    res.status(200).json({ message: 'Deleted selected alerts', result })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete selected alerts', error: err })
  }
}

// Clear All Alerts in a Basket
export const clearBasket = async (req, res) => {
  try {
    const { userId, basketName } = req.params
    const result = await Alert.deleteMany({ userId, alertBasketName: basketName })
    res.status(200).json({ message: 'Cleared basket alerts', result })
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear basket', error: err })
  }
}
