const express = require('express');
const Event = require('../../models/Event');
const auth = require('../../middleware/auth');
const router = express.Router();
router.use(auth);

// body: { speakers: [], sponsors: [], organizers: [], coordinators: [] }
router.post('/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { speakers = [], sponsors = [], organizers = [], coordinators = [] } = req.body;
    const ev = await Event.findByIdAndUpdate(eventId, { $set: { speakers, sponsors, organizers, coordinators } }, { new: true })
      .populate('speakers sponsors organizers coordinators').lean();
    res.json(ev);
  } catch (err) { res.status(400).json({ error: 'mapping failed', details: err.message }); }
});

module.exports = router;
