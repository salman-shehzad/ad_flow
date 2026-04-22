import bcrypt from "bcryptjs";
import {
  AD_STATUSES,
  PAYMENT_STATUSES,
  MEDIA_TYPES,
  ROLES,
  VALIDATION_STATUSES,
} from "../../../shared/index.js";

const categories = ["Technology", "Fashion", "Food", "Fitness", "Travel"];
const cities = ["Karachi", "Lahore", "Islamabad", "Dubai", "Riyadh"];
const packages = [
  { name: "Starter", duration_days: 7, weight: 1, price: 49, is_featured: false },
  { name: "Growth", duration_days: 14, weight: 2, price: 99, is_featured: false },
  { name: "Featured", duration_days: 30, weight: 4, price: 199, is_featured: true },
];

const sampleAds = [
  ["LaunchPad CRM", "Automate your sales follow-up pipeline.", 1, 1, 1, AD_STATUSES.PUBLISHED, -2, 5, 3],
  ["Luxe Streetwear Drop", "Limited edition collection for Gen Z buyers.", 2, 2, 2, AD_STATUSES.PUBLISHED, -1, 10, 2],
  ["Healthy Bowl Week", "Fresh meal subscriptions with citywide delivery.", 3, 1, 1, AD_STATUSES.PUBLISHED, -3, 4, 1],
  ["PeakFit Coaching", "Online coaching program for busy founders.", 4, 3, 2, AD_STATUSES.SCHEDULED, 1, 15, 2],
  ["Desert Nights Escape", "Weekend travel package for couples.", 5, 4, 3, AD_STATUSES.PAYMENT_VERIFIED, 2, 30, 3],
  ["Cloud POS Upgrade", "Restaurant POS with real-time analytics.", 1, 2, 1, AD_STATUSES.PAYMENT_PENDING, 3, 10, 1],
  ["Studio Athleisure", "Breathable performance apparel for women.", 2, 3, 2, AD_STATUSES.PAYMENT_SUBMITTED, 0, 14, 2],
  ["Cafe Espresso Fest", "Citywide promo for seasonal coffee menu.", 3, 1, 1, AD_STATUSES.SUBMITTED, 0, 7, 1],
  ["ProGym Franchise", "Investor campaign for regional expansion.", 4, 5, 3, AD_STATUSES.UNDER_REVIEW, 0, 21, 3],
  ["Nomad Visa Support", "Migration assistance with concierge support.", 5, 4, 2, AD_STATUSES.DRAFT, 0, 14, 2],
  ["DevSprint Hiring", "Recruit senior engineers in 10 days.", 1, 1, 2, AD_STATUSES.PUBLISHED, -4, 7, 2],
  ["Runway Capsule", "Pre-launch waitlist for premium handbags.", 2, 2, 3, AD_STATUSES.PUBLISHED, -5, 20, 3],
  ["Organic Meal Prep", "Weekly family meal plans from nutritionists.", 3, 3, 1, AD_STATUSES.EXPIRED, -20, -5, 1],
  ["Mobility Challenge", "Corporate fitness challenge for HR teams.", 4, 2, 2, AD_STATUSES.REJECTED, 0, 14, 2],
  ["Coastal Retreat", "Luxury beachfront escapes with transfers.", 5, 5, 3, AD_STATUSES.PUBLISHED, -6, 18, 3],
];

const userRecords = [
  {
    name: "Ayesha Client",
    email: "client@adflow.pro",
    username: "client",
    role: ROLES.CLIENT,
    password: "Password123!",
  },
  {
    name: "Musa Client",
    email: "client2@adflow.pro",
    username: "client2",
    role: ROLES.CLIENT,
    password: "Password123!",
  },
  {
    name: "Mariam Moderator",
    email: "moderator@adflow.pro",
    username: "moderator",
    role: ROLES.MODERATOR,
    password: "Password123!",
  },
  {
    name: "Admin",
    email: "admin@adflow.pro",
    username: "admin",
    role: ROLES.ADMIN,
    password: "admin@123",
  },
  {
    name: "Sara Super",
    email: "super@adflow.pro",
    username: "superadmin",
    role: ROLES.SUPER_ADMIN,
    password: "Password123!",
  },
];

const upsertUser = async (db, user) => {
  const passwordHash = await bcrypt.hash(user.password, 10);

  await db.query(
    `INSERT INTO users (name, email, username, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (email)
     DO UPDATE SET
       name = EXCLUDED.name,
       username = EXCLUDED.username,
       password_hash = EXCLUDED.password_hash,
       role = EXCLUDED.role`,
    [user.name, user.email, user.username, passwordHash, user.role],
  );
};

const ensureLookupData = async (db, table, values) => {
  for (const value of values) {
    await db.query(
      `INSERT INTO ${table} (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
      [value],
    );
  }
};

const ensurePackages = async (db) => {
  for (const pkg of packages) {
    await db.query(
      `INSERT INTO packages (name, duration_days, weight, price, is_featured)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (name)
       DO UPDATE SET
         duration_days = EXCLUDED.duration_days,
         weight = EXCLUDED.weight,
         price = EXCLUDED.price,
         is_featured = EXCLUDED.is_featured`,
      [pkg.name, pkg.duration_days, pkg.weight, pkg.price, pkg.is_featured],
    );
  }
};

const seedSampleAds = async (db) => {
  const { rows } = await db.query("SELECT COUNT(*)::int AS count FROM ads");
  if (rows[0].count > 0) {
    return;
  }

  for (let index = 0; index < sampleAds.length; index += 1) {
    const [
      title,
      description,
      categoryId,
      cityId,
      packageId,
      status,
      publishOffset,
      expireOffset,
      ownerId,
    ] = sampleAds[index];
    const publishAt = new Date(Date.now() + publishOffset * 24 * 60 * 60 * 1000);
    const expireAt = new Date(Date.now() + expireOffset * 24 * 60 * 60 * 1000);
    const adResult = await db.query(
      `INSERT INTO ads (user_id, title, description, category_id, city_id, status, publish_at, expire_at, package_id, admin_boost)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [ownerId > 2 ? 1 : ownerId, title, description, categoryId, cityId, status, publishAt, expireAt, packageId, index % 3],
    );

    const adId = adResult.rows[0].id;
    const mediaUrl =
      index % 4 === 0
        ? "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        : `https://images.unsplash.com/photo-15${12000000 + index}?auto=format&fit=crop&w=1200&q=80`;
    const mediaType = mediaUrl.includes("youtube") ? MEDIA_TYPES.YOUTUBE : MEDIA_TYPES.IMAGE;
    const thumbnail =
      mediaType === MEDIA_TYPES.YOUTUBE
        ? "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
        : mediaUrl;

    await db.query(
      "INSERT INTO ad_media (ad_id, source_type, original_url, thumbnail_url, validation_status) VALUES ($1, $2, $3, $4, $5)",
      [adId, mediaType, mediaUrl, thumbnail, VALIDATION_STATUSES.VALID],
    );

    await db.query(
      "INSERT INTO ad_status_history (ad_id, old_status, new_status, note) VALUES ($1, $2, $3, $4)",
      [adId, null, status, "Seeded record"],
    );

    if (
      [
        AD_STATUSES.PAYMENT_SUBMITTED,
        AD_STATUSES.PAYMENT_VERIFIED,
        AD_STATUSES.SCHEDULED,
        AD_STATUSES.PUBLISHED,
      ].includes(status)
    ) {
      const paymentStatus =
        status === AD_STATUSES.PAYMENT_SUBMITTED
          ? PAYMENT_STATUSES.SUBMITTED
          : PAYMENT_STATUSES.VERIFIED;
      await db.query(
        "INSERT INTO payments (ad_id, amount, transaction_ref, screenshot_url, status) VALUES ($1, $2, $3, $4, $5)",
        [
          adId,
          packages[packageId - 1].price,
          `TXN-${1000 + adId}`,
          "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=800&q=80",
          paymentStatus,
        ],
      );
    }
  }
};

export const seedDatabase = async (db) => {
  for (const user of userRecords) {
    await upsertUser(db, user);
  }

  await ensureLookupData(db, "categories", categories);
  await ensureLookupData(db, "cities", cities);
  await ensurePackages(db);
  await seedSampleAds(db);
};
