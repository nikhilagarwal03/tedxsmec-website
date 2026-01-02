// require('dotenv').config();
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const User = require('./models/user');
// const Speaker = require('./models/Speaker');
// const Sponsor = require('./models/Sponsor');
// const Event = require('./models/Event');
// const Organizer = require('./models/Organizer');
// const FacultyCoordinator = require('./models/FacultyCoordinator');

// async function seed() {
//   const uri = process.env.MONGODB_URI;
//   if (!uri) { console.error('MONGODB_URI missing'); process.exit(1); }
//   await mongoose.connect(uri);

//   await Promise.all([User.deleteMany({}), Speaker.deleteMany({}), Sponsor.deleteMany({}), Event.deleteMany({})]);

//   const hashed = await bcrypt.hash('changeme', 10);
//   const admin = await User.create({ name: 'Admin', email: 'admin@tedxsmec.edu', password: hashed, role: 'admin' });

//   const s1 = await Speaker.create({ name: 'Alice Johnson', bio: 'AI researcher', title: 'Keynote' });
//   const s2 = await Speaker.create({ name: 'Bob Kumar', bio: 'Entrepreneur' });

//   const sp1 = await Sponsor.create({ name: 'ACME Corp', imageUrl: 'https://placehold.co/200x80' });
//   const sp2 = await Sponsor.create({ name: 'EduLabs', imageUrl: 'https://placehold.co/200x80' });

//   const op1 = await Organizer.create({ name: 'ACME Corp', imageUrl: 'https://placehold.co/200x80' });
//   const op2 = await Organizer.create({ name: 'EduLabs', imageUrl: 'https://placehold.co/200x80' });

//     const fp1 = await FacultyCoordinator.create({ name: 'ACME Corp', imageUrl: 'https://placehold.co/200x80' });


//   const ev = await Event.create({
//     name: 'TEDxSMEC 2025 — Ideas Worth Spreading',
//     slug: 'tedxsmec-2025',
//     description: 'Annual TEDx at SMEC',
//     date: new Date(),
//     isUpcoming: true,
//     bannerUrl: 'https://placehold.co/1200x400',
//     speakers: [s1._id, s2._id],
//     sponsors: [sp1._id, sp2._id],
//     organizers: [op1._id , op2._id],
//     coordinators: [fp1._id]
//   });

//   console.log('Seed done. Admin:', admin.email, 'password: changeme');
//   await mongoose.disconnect();
// }

// seed().catch(err => { console.error(err); process.exit(1); });
