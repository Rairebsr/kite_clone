import IPOApplication from '../model/IpoApplication.js';  // ✅ Correct

export const applyForIPO = async (req, res) => {
  try {
    console.log('Received IPO application:', req.body); // ✅ log input

    const { userId, symbol, upiId, upiProvider } = req.body;

    if (!userId || !symbol || !upiId || !upiProvider ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newApplication = new IPOApplication({
      userId,
      symbol,
      upiId,
      upiProvider,
    });

    await newApplication.save();
    res.status(201).json({ message: 'IPO Application submitted successfully' });
  } catch (error) {
    console.error('IPO Apply Error:', error); // ✅ log actual error
    res.status(500).json({ message: 'Server error' });
  }
};
