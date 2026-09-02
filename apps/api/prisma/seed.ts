import { PrismaClient, BookingStatus, MechanicStatus } from '@prisma/client';

const prisma = new PrismaClient();

// ── Helpers ──────────────────────────────────────────────────────────────────

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysAgo: number): Date {
  const now = new Date();
  const past = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
}

// ── Seed Data ────────────────────────────────────────────────────────────────

const firstNames = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan',
  'Krishna', 'Ishaan', 'Ananya', 'Diya', 'Aditi', 'Myra', 'Sara', 'Aadhya',
  'Isha', 'Kavya', 'Riya', 'Anvi', 'Rahul', 'Priya', 'Vikram', 'Neha',
  'Rohit', 'Pooja', 'Amit', 'Divya', 'Suresh', 'Meena', 'Rajesh', 'Sunita',
  'Deepak', 'Anjali', 'Manish', 'Swati', 'Nikhil', 'Shweta', 'Gaurav', 'Nisha',
  'Harish', 'Lata', 'Pankaj', 'Komal', 'Tushar', 'Pallavi', 'Varun', 'Shruti',
  'Karan', 'Jyoti',
];

const lastNames = [
  'Sharma', 'Verma', 'Gupta', 'Patel', 'Singh', 'Kumar', 'Reddy', 'Nair',
  'Mehta', 'Joshi', 'Shah', 'Bhat', 'Iyer', 'Rao', 'Pillai', 'Das',
  'Chopra', 'Kapoor', 'Malhotra', 'Agarwal', 'Banerjee', 'Mukherjee',
  'Chatterjee', 'Saxena', 'Thakur',
];

const mechanicNames = [
  'Ramesh Yadav', 'Sunil Chauhan', 'Ajay Thakur', 'Manoj Tiwari',
  'Rajendra Prasad', 'Sanjay Mishra', 'Gopal Singh', 'Dinesh Kumar',
  'Vijay Sharma', 'Mukesh Verma', 'Ravi Patel', 'Arun Nair',
  'Suresh Reddy', 'Mohan Das', 'Prakash Jha', 'Naveen Rao',
  'Kishore Mehta', 'Santosh Gupta', 'Bharat Pillai', 'Ashok Bhat',
];

const serviceCategories = [
  'Battery Jumpstart',
  'Flat Tire Fix',
  'Towing',
  'Engine Diagnostics',
  'Oil Change',
  'Brake Repair',
  'AC Repair',
];

const categoryPriceRanges: Record<string, [number, number]> = {
  'Battery Jumpstart': [300, 800],
  'Flat Tire Fix': [400, 1200],
  'Towing': [1500, 5000],
  'Engine Diagnostics': [500, 2000],
  'Oil Change': [600, 1500],
  'Brake Repair': [800, 3000],
  'AC Repair': [1000, 4000],
};

const vehicleMakes = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Honda', 'Toyota', 'Mahindra', 'Kia', 'MG', 'Skoda', 'Volkswagen'];
const vehicleModels: Record<string, string[]> = {
  'Maruti Suzuki': ['Swift', 'Baleno', 'Alto', 'WagonR', 'Dzire', 'Brezza', 'Ertiga'],
  'Hyundai': ['i20', 'Creta', 'Venue', 'Verna', 'Tucson', 'i10 Nios'],
  'Tata': ['Nexon', 'Punch', 'Harrier', 'Safari', 'Altroz', 'Tiago'],
  'Honda': ['City', 'Amaze', 'Elevate', 'WR-V'],
  'Toyota': ['Innova', 'Fortuner', 'Glanza', 'Urban Cruiser', 'Camry'],
  'Mahindra': ['Thar', 'XUV700', 'Scorpio', 'XUV300', 'Bolero'],
  'Kia': ['Seltos', 'Sonet', 'Carens', 'EV6'],
  'MG': ['Hector', 'Astor', 'ZS EV', 'Gloster'],
  'Skoda': ['Kushaq', 'Slavia', 'Superb', 'Kodiaq'],
  'Volkswagen': ['Taigun', 'Virtus', 'Tiguan'],
};

const states = ['DL', 'MH', 'KA', 'TN', 'UP', 'RJ', 'GJ', 'HR', 'MP', 'WB'];

function generatePlate(): string {
  const state = randomFrom(states);
  const district = randomBetween(1, 99).toString().padStart(2, '0');
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const series = letters[randomBetween(0, 25)]! + letters[randomBetween(0, 25)]!;
  const number = randomBetween(1000, 9999);
  return `${state}-${district}-${series}-${number}`;
}

function generatePhone(): string {
  const prefixes = ['98', '97', '96', '95', '94', '93', '91', '90', '88', '87', '86', '85', '70', '73', '74', '75', '76'];
  return `+91${randomFrom(prefixes)}${randomBetween(10000000, 99999999)}`;
}

// ── Status distribution ─────────────────────────────────────────────────────

const statusWeights: { status: BookingStatus; weight: number }[] = [
  { status: BookingStatus.COMPLETED, weight: 60 },
  { status: BookingStatus.PENDING, weight: 15 },
  { status: BookingStatus.ASSIGNED, weight: 7 },
  { status: BookingStatus.MECHANIC_ON_THE_WAY, weight: 5 },
  { status: BookingStatus.IN_PROGRESS, weight: 8 },
  { status: BookingStatus.CANCELLED, weight: 5 },
];

function weightedRandomStatus(): BookingStatus {
  const total = statusWeights.reduce((s, w) => s + w.weight, 0);
  let r = Math.random() * total;
  for (const sw of statusWeights) {
    r -= sw.weight;
    if (r <= 0) return sw.status;
  }
  return BookingStatus.COMPLETED;
}

// ── Lat/Lng around Indian metro cities ────────────────────────────────────

const metroCoords = [
  { lat: 28.6139, lng: 77.2090 },   // Delhi
  { lat: 19.0760, lng: 72.8777 },   // Mumbai
  { lat: 12.9716, lng: 77.5946 },   // Bangalore
  { lat: 13.0827, lng: 80.2707 },   // Chennai
  { lat: 17.3850, lng: 78.4867 },   // Hyderabad
  { lat: 22.5726, lng: 88.3639 },   // Kolkata
  { lat: 23.0225, lng: 72.5714 },   // Ahmedabad
  { lat: 26.9124, lng: 75.7873 },   // Jaipur
];

function randomCoords(): { lat: number; lng: number } {
  const base = randomFrom(metroCoords);
  return {
    lat: base.lat + (Math.random() - 0.5) * 0.1,
    lng: base.lng + (Math.random() - 0.5) * 0.1,
  };
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding database...\n');

  // Clean existing data
  await prisma.booking.deleteMany();
  await prisma.mechanic.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.serviceCategory.deleteMany();

  // 1. Service Categories
  console.log('📦 Creating service categories...');
  const categories = await Promise.all(
    serviceCategories.map((name) =>
      prisma.serviceCategory.create({ data: { name } })
    )
  );
  console.log(`   ✅ ${categories.length} categories created`);

  // 2. Customers
  console.log('👥 Creating customers...');
  const customers = await Promise.all(
    firstNames.map((firstName, i) => {
      const lastName = lastNames[i % lastNames.length]!;
      const name = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`;
      return prisma.customer.create({
        data: {
          name,
          email,
          phone: generatePhone(),
          createdAt: randomDate(90),
        },
      });
    })
  );
  console.log(`   ✅ ${customers.length} customers created`);

  // 3. Mechanics
  console.log('🔧 Creating mechanics...');
  const mechanicStatuses: MechanicStatus[] = [];
  for (let i = 0; i < mechanicNames.length; i++) {
    if (i < 12) mechanicStatuses.push(MechanicStatus.AVAILABLE);
    else if (i < 17) mechanicStatuses.push(MechanicStatus.ON_JOB);
    else mechanicStatuses.push(MechanicStatus.OFFLINE);
  }
  const mechanics = await Promise.all(
    mechanicNames.map((name, i) => {
      const coords = randomCoords();
      return prisma.mechanic.create({
        data: {
          name,
          phone: generatePhone(),
          status: mechanicStatuses[i]!,
          jobsCompleted: randomBetween(10, 250),
          currentLat: coords.lat,
          currentLng: coords.lng,
        },
      });
    })
  );
  console.log(`   ✅ ${mechanics.length} mechanics created`);

  // 4. Bookings
  console.log('📋 Creating bookings...');
  const bookingData = [];
  const BOOKING_COUNT = 550;

  for (let i = 0; i < BOOKING_COUNT; i++) {
    const status = weightedRandomStatus();
    const category = randomFrom(categories);
    const customer = randomFrom(customers);
    const priceRange = categoryPriceRanges[category.name]!;
    const amount = randomBetween(priceRange[0], priceRange[1]);
    const make = randomFrom(vehicleMakes);
    const models = vehicleModels[make]!;
    const model = randomFrom(models);
    const createdAt = randomDate(60);

    // Assign mechanic for non-PENDING bookings
    const needsMechanic = status !== BookingStatus.PENDING && status !== BookingStatus.CANCELLED;
    const mechanic = needsMechanic ? randomFrom(mechanics) : null;

    // Set completedAt for completed bookings
    const completedAt = status === BookingStatus.COMPLETED
      ? new Date(createdAt.getTime() + randomBetween(30, 180) * 60 * 1000)
      : null;

    const scheduledAt = new Date(createdAt.getTime() + randomBetween(15, 120) * 60 * 1000);

    bookingData.push({
      customerId: customer.id,
      mechanicId: mechanic?.id ?? null,
      serviceCategoryId: category.id,
      status,
      amount,
      vehicleMake: make,
      vehicleModel: model,
      vehiclePlate: generatePlate(),
      scheduledAt,
      completedAt,
      createdAt,
      updatedAt: completedAt ?? scheduledAt,
    });
  }

  // Batch create in chunks of 50
  for (let i = 0; i < bookingData.length; i += 50) {
    const chunk = bookingData.slice(i, i + 50);
    await prisma.booking.createMany({ data: chunk });
  }
  console.log(`   ✅ ${BOOKING_COUNT} bookings created`);

  // 5. Update mechanic job counts based on actual completed bookings
  console.log('📊 Updating mechanic stats...');
  for (const mechanic of mechanics) {
    const completedCount = await prisma.booking.count({
      where: { mechanicId: mechanic.id, status: BookingStatus.COMPLETED },
    });
    await prisma.mechanic.update({
      where: { id: mechanic.id },
      data: { jobsCompleted: completedCount },
    });
  }
  console.log('   ✅ Mechanic stats updated\n');

  // Print summary
  const totalBookings = await prisma.booking.count();
  const statusCounts = await prisma.booking.groupBy({
    by: ['status'],
    _count: { id: true },
  });

  console.log('═══════════════════════════════════════════');
  console.log('   📊 SEED SUMMARY');
  console.log('═══════════════════════════════════════════');
  console.log(`   Customers:         ${customers.length}`);
  console.log(`   Mechanics:         ${mechanics.length}`);
  console.log(`   Service Categories: ${categories.length}`);
  console.log(`   Total Bookings:    ${totalBookings}`);
  console.log('   ─────────────────────────────────────');
  for (const sc of statusCounts) {
    console.log(`   ${sc.status.padEnd(22)} ${sc._count.id}`);
  }
  console.log('═══════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
