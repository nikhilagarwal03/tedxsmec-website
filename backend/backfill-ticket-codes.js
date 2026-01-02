// backfill-ticket-codes.js
require('dotenv').config();
const mongoose = require('mongoose');
const Ticket = require('./models/Ticket');
const { generateReadableCode } = require('./utils/codeGen');

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set in .env');
    process.exit(1);
  }

  // connect (no deprecated options)
  await mongoose.connect(process.env.MONGODB_URI);

  try {
    // ensure indexes (creates the unique index for ticketCode if defined)
    await Ticket.init();
    console.log('Connected to DB and ensured indexes.');

    const query = { $or: [{ ticketCode: { $exists: false } }, { ticketCode: null }, { ticketCode: '' }] };
    const cursor = Ticket.find(query).cursor();

    let count = 0;
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      // generate unique code with retries
      let code = null;
      for (let i = 0; i < 8; i++) {
        const cand = generateReadableCode(8);
        const exists = await Ticket.findOne({ ticketCode: cand }).lean().select('_id').exec();
        if (!exists) { code = cand; break; }
      }
      if (!code) code = generateReadableCode(10);
      doc.ticketCode = code;
      await doc.save();
      count++;
      if (count % 50 === 0) console.log('Processed', count);
    }

    console.log('Backfill complete, total:', count);
  } catch (err) {
    console.error('Backfill failed:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
