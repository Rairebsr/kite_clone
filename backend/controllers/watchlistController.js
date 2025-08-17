import UserWatchlist from "../model/UserWatchlist.js";

export const save = async (req, res) => {
  const { userId, watchlists } = req.body;

  if (!userId || !watchlists || typeof watchlists !== 'object') {
    return res.status(400).json({ error: "Invalid data" });
  }

  const transformed = Object.entries(watchlists).map(([watchlistName, wl]) => ({
    watchlistName,
    groups: Object.entries(wl.groups || {}).map(([groupName, stocks]) => ({
      groupName,
      stocks
    }))
  }));

  try {
    const existing = await UserWatchlist.findOne({ userId });

    if (existing) {
      existing.watchlists = transformed;
      await existing.save();
    } else {
      await UserWatchlist.create({ userId, watchlists: transformed });
    }

    res.json({ message: 'Saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


export const view = async (req, res) => {
  try {
    const {userId} = req.query
    const doc = await UserWatchlist.findOne({  userId });
    res.json(doc || { watchlists: [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch watchlists' });
  }
};

export const renameWatchlist = async (req, res) => {
  const { userId, oldName, newName } = req.body;

  if (!userId || !oldName || !newName) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const doc = await UserWatchlist.findOne({ userId });

    if (!doc) return res.status(404).json({ error: 'User not found' });

    const wl = doc.watchlists.find(wl => wl.watchlistName === oldName);

    if (!wl) return res.status(404).json({ error: 'Watchlist not found' });

    wl.watchlistName = newName;

    await doc.save();

    res.json({ message: 'Watchlist renamed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteWatchlist = async (req, res) => {
  const { userId, watchlistName } = req.body;

  if (!userId || !watchlistName) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const doc = await UserWatchlist.findOne({ userId });

    if (!doc) return res.status(404).json({ error: 'User not found' });

    const initialLength = doc.watchlists.length;

    doc.watchlists = doc.watchlists.filter(wl => wl.watchlistName !== watchlistName);

    if (doc.watchlists.length === initialLength) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }

    await doc.save();

    res.json({ message: 'Watchlist deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};