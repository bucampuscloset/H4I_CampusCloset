import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.galleryPhoto.deleteMany()
  await prisma.impactStats.deleteMany()
  await prisma.event.deleteMany()
  await prisma.donationBin.deleteMany()
  await prisma.teamMember.deleteMany()
  await prisma.faqItem.deleteMany()
  await prisma.contactRequest.deleteMany()
  await prisma.adminUser.deleteMany()

  // Events
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Spring Clothing Swap',
        type: 'swap',
        date: new Date('2025-04-12T12:00:00Z'),
        location: 'GSU Ballroom, 775 Commonwealth Ave',
        description: 'Our biggest swap of the semester! Bring up to 10 items and take home something new.',
        itemLimit: 10,
        isPast: true,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Winter Drive Collection',
        type: 'drive',
        date: new Date('2025-02-15T10:00:00Z'),
        location: 'Warren Towers Lobby',
        description: 'Collecting winter coats and warm clothing for local shelters.',
        isPast: true,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Fall Kickoff Swap',
        type: 'swap',
        date: new Date('2024-09-20T14:00:00Z'),
        location: 'Marsh Plaza Tent',
        description: 'Welcome back swap to kick off the semester sustainably.',
        itemLimit: 8,
        isPast: true,
      },
    }),
    prisma.event.create({
      data: {
        title: 'End-of-Year Mega Swap',
        type: 'swap',
        date: new Date('2026-09-15T11:00:00Z'),
        location: 'FitRec Gymnasium',
        description: 'Don\'t throw away your clothes when you move out — swap them!',
        itemLimit: 15,
        isPast: false,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Fall Kickoff Swap',
        type: 'swap',
        date: new Date('2026-09-20T14:00:00Z'),
        location: 'Marsh Plaza Tent',
        description: 'Welcome back swap to kick off the semester sustainably. Bring your summer finds!',
        itemLimit: 10,
        isPast: false,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Winter Drive Collection',
        type: 'drive',
        date: new Date('2026-10-05T10:00:00Z'),
        location: 'Warren Towers Lobby',
        description: 'Collecting winter coats and warm clothing for the cold months ahead.',
        isPast: false,
      },
    }),
  ])

  // Impact stats for past events
  await Promise.all([
    prisma.impactStats.create({
      data: {
        eventId: events[0].id,
        itemsReused: 342,
        itemsDonated: 89,
        attendance: 215,
        wasteDivertedKg: 120,
        waterSavedL: 1026000,
        carbonSavedKg: 3420,
      },
    }),
    prisma.impactStats.create({
      data: {
        eventId: events[1].id,
        itemsReused: 0,
        itemsDonated: 267,
        attendance: 94,
        wasteDivertedKg: 85,
        waterSavedL: 801000,
        carbonSavedKg: 2670,
      },
    }),
    prisma.impactStats.create({
      data: {
        eventId: events[2].id,
        itemsReused: 198,
        itemsDonated: 54,
        attendance: 156,
        wasteDivertedKg: 70,
        waterSavedL: 594000,
        carbonSavedKg: 1980,
      },
    }),
  ])

  // Donation bins at real BU locations
  await Promise.all([
    prisma.donationBin.create({
      data: {
        name: 'GSU Main Lobby',
        building: 'George Sherman Union',
        latitude: 42.3505,
        longitude: -71.1054,
        active: true,
      },
    }),
    prisma.donationBin.create({
      data: {
        name: 'Warren Towers Entrance',
        building: 'Warren Towers',
        latitude: 42.3490,
        longitude: -71.1040,
        active: true,
      },
    }),
    prisma.donationBin.create({
      data: {
        name: 'West Campus Lounge',
        building: 'Claflin Hall',
        latitude: 42.3515,
        longitude: -71.1155,
        active: true,
      },
    }),
  ])

  // Team members — real eboard
  await Promise.all([
    prisma.teamMember.create({ data: { name: 'Sasha', role: 'President', photoUrl: '/team/sasha-president.jpg', displayOrder: 1 } }),
    prisma.teamMember.create({ data: { name: 'Ria', role: 'Vice President', photoUrl: '/team/ria-vp.jpg', displayOrder: 2 } }),
    prisma.teamMember.create({ data: { name: 'Jess', role: 'Treasurer', photoUrl: '/team/jess-treasurer.jpg', displayOrder: 3 } }),
    prisma.teamMember.create({ data: { name: 'Emmett', role: 'Secretary', photoUrl: '/team/emmett-secretary.jpg', displayOrder: 4 } }),
    prisma.teamMember.create({ data: { name: 'Harry', role: 'Marketing', photoUrl: '/team/harry-marketing.jpg', displayOrder: 5 } }),
    prisma.teamMember.create({ data: { name: 'Owen', role: 'Marketing', photoUrl: '/team/owen-marketing.jpg', displayOrder: 6 } }),
    prisma.teamMember.create({ data: { name: 'Andrew', role: 'Media', photoUrl: '/team/andrew-media.jpg', displayOrder: 7 } }),
    prisma.teamMember.create({ data: { name: 'Kailey', role: 'Media', photoUrl: '/team/kailey-media.jpg', displayOrder: 8 } }),
    prisma.teamMember.create({ data: { name: 'Kelly', role: 'Media', photoUrl: '/team/kelly-media.jpg', displayOrder: 9 } }),
    prisma.teamMember.create({ data: { name: 'Dan', role: 'Outreach', photoUrl: '/team/dan-outreach.jpg', displayOrder: 10 } }),
    prisma.teamMember.create({ data: { name: 'Destiny', role: 'Outreach', photoUrl: '/team/destiny-outreach.jpg', displayOrder: 11 } }),
    prisma.teamMember.create({ data: { name: 'Alanna', role: 'Events', photoUrl: '/team/alanna-events.jpg', displayOrder: 12 } }),
    prisma.teamMember.create({ data: { name: 'Isobel', role: 'Events', photoUrl: '/team/isobel-events.jpg', displayOrder: 13 } }),
  ])

  // FAQ items
  await Promise.all([
    prisma.faqItem.create({ data: { question: 'What items can I donate?', answer: 'We accept clean clothing, shoes, and accessories in good condition. We cannot accept undergarments, swimwear, or items with significant damage.', category: 'Donations', displayOrder: 1 } }),
    prisma.faqItem.create({ data: { question: 'Where are the donation bins located?', answer: 'Our bins are located in GSU, Warren Towers, and West Campus. Check the Donate page for an interactive map.', category: 'Donations', displayOrder: 2 } }),
    prisma.faqItem.create({ data: { question: 'Can I request a pickup for large donations?', answer: 'Yes! Use the pickup request form on our Donate page and we\'ll arrange a time to collect your items.', category: 'Donations', displayOrder: 3 } }),
    prisma.faqItem.create({ data: { question: 'How do clothing swaps work?', answer: 'Bring gently used clothing items (up to the event limit) and receive tokens to "shop" from what others have brought. No money changes hands!', category: 'Participation', displayOrder: 1 } }),
    prisma.faqItem.create({ data: { question: 'Do I need to bring items to take items?', answer: 'At swaps, yes — you trade items. At post-swap free shops, remaining items are available to everyone.', category: 'Participation', displayOrder: 2 } }),
    prisma.faqItem.create({ data: { question: 'How can I volunteer?', answer: 'Visit the About page and fill out the Get Involved form, or attend one of our e-board meetings!', category: 'Participation', displayOrder: 3 } }),
    prisma.faqItem.create({ data: { question: 'Do I have to donate to participate?', answer: 'You don\'t need to donate to attend a swap, but bringing items lets you take more home. Free shops are open to everyone after each swap.', category: 'Participation', displayOrder: 4 } }),
    prisma.faqItem.create({ data: { question: 'Is this only for BU students?', answer: 'Our swaps are primarily for BU students, but we welcome guests when capacity allows. Donation bins are open to anyone in the community.', category: 'Participation', displayOrder: 5 } }),
    prisma.faqItem.create({ data: { question: 'What happens to unclaimed items?', answer: 'After each swap, remaining items are donated to local shelters and organizations like Goodwill and Boomerangs.', category: 'General', displayOrder: 1 } }),
    prisma.faqItem.create({ data: { question: 'Is Campus Closet affiliated with BU?', answer: 'Campus Closet is a student-run initiative at Boston University, built and maintained by Hack4Impact BU.', category: 'General', displayOrder: 2 } }),
  ])

  // Contact requests
  await Promise.all([
    prisma.contactRequest.create({ data: { name: 'Emily Watson', email: 'ewatson@bu.edu', message: 'I have 3 bags of clothes from my spring cleaning. Can someone pick them up from South Campus?', type: 'pickup', status: 'new' } }),
    prisma.contactRequest.create({ data: { name: 'Marcus Lee', email: 'mlee@bu.edu', message: 'Are you looking for volunteers for the End-of-Year Mega Swap?', type: 'general', status: 'responded' } }),
    prisma.contactRequest.create({ data: { name: 'Sofia Ramirez', email: 'sramirez@bu.edu', message: 'I dropped off a bag at the GSU bin last week. Just wanted to confirm it was received!', type: 'dropoff', status: 'completed' } }),
  ])

  // Gallery photos — tagged to past events where applicable
  await Promise.all([
    prisma.galleryPhoto.create({ data: { url: 'https://placehold.co/800x800/B89F7B/FFFFFF?text=Spring+Swap+1', caption: 'Browsing the racks at Spring Swap', eventId: events[0].id } }),
    prisma.galleryPhoto.create({ data: { url: 'https://placehold.co/800x800/8B7355/FFFFFF?text=Spring+Swap+2', caption: 'Volunteers sorting donations', eventId: events[0].id } }),
    prisma.galleryPhoto.create({ data: { url: 'https://placehold.co/800x800/A89071/FFFFFF?text=Spring+Swap+3', caption: 'Full house at the GSU Ballroom', eventId: events[0].id } }),
    prisma.galleryPhoto.create({ data: { url: 'https://placehold.co/800x800/6B5D4F/FFFFFF?text=Winter+Drive+1', caption: 'Coats collected for local shelters', eventId: events[1].id } }),
    prisma.galleryPhoto.create({ data: { url: 'https://placehold.co/800x800/9B8268/FFFFFF?text=Winter+Drive+2', caption: 'Drop-off station at Warren Towers', eventId: events[1].id } }),
    prisma.galleryPhoto.create({ data: { url: 'https://placehold.co/800x800/C7B299/FFFFFF?text=Fall+Kickoff+1', caption: 'Welcome back swap kickoff', eventId: events[2].id } }),
    prisma.galleryPhoto.create({ data: { url: 'https://placehold.co/800x800/8E7B5F/FFFFFF?text=Fall+Kickoff+2', caption: 'New friends at Marsh Plaza', eventId: events[2].id } }),
    prisma.galleryPhoto.create({ data: { url: 'https://placehold.co/800x800/B89F7B/FFFFFF?text=Behind+the+Scenes', caption: 'E-board planning the next event', eventId: null } }),
  ])

  await prisma.adminUser.createMany({
    data: [
      { email: 'kzingade@bu.edu' },
      { email: 'dliao@bu.edu' },
      { email: 'aflopez@bu.edu' },
      { email: 'diggyzar@bu.edu' },
      { email: 'bucampuscloset@gmail.com' },
      { email: 'riashahh@bu.edu' },
      { email: 'mnyak@bu.edu' },
    ],
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
