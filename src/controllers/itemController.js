const Item = require('../models/Item');

exports.getItems = async (req, res) => {
  try {
    const { 
      status, category, location, date, dateFrom, dateTo, search, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (location) filter.location = location;

    if (date) {
      // match that exact day (00:00 - 23:59)
      const d = new Date(date);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      filter.date = { $gte: d, $lt: next };
    } else if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Item.countDocuments(filter);

    const items = await Item.find(filter)
      .sort({ createdAt: -1 }) // newest first
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ 
      total, 
      page: Number(page), 
      limit: Number(limit), 
      items 
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch items' });
  }
};


exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('createdBy', 'name email');
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch item' });
  }
};

exports.createItem = async (req, res) => {
  try {
    const payload = { ...req.body, createdBy: req.user.id };
    const item = await Item.create(payload);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Could not create item' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // only owner or admin can update
    if (item.createdBy && item.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this item' });
    }

    Object.assign(item, req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Could not update item' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    //route already ensures admin access
    await item.deleteOne();
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete item' });
  }
};
