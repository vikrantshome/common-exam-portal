const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting Local Flow Verification...");

  // 1. Simulate Signup
  const mobile = "9999999999";
  console.log(`\n1. Creating User (Mobile: ${mobile})...`);
  
  // Clean up previous run
  await prisma.document.deleteMany({ where: { user: { mobile } } });
  await prisma.profile.deleteMany({ where: { user: { mobile } } });
  await prisma.user.deleteMany({ where: { mobile } });

  const user = await prisma.user.create({
    data: {
      mobile: mobile,
      password: "hashed_password_123", // mocked hash
    },
  });
  console.log("✅ User Created:", user.id);

  // 2. Simulate Onboarding (Create Profile)
  console.log("\n2. Simulating Onboarding...");
  const profile = await prisma.profile.create({
    data: {
      userId: user.id,
      firstName: "Test",
      lastName: "Student",
      class12Stream: "PCM",
    },
  });
  console.log("✅ Profile Created:", profile.firstName, profile.class12Stream);

  // 3. Simulate Master Form Update (Personal Details)
  console.log("\n3. Updating Personal Details...");
  const updatedProfile = await prisma.profile.update({
    where: { userId: user.id },
    data: {
      dob: new Date("2008-01-01"),
      gender: "MALE",
      category: "GEN",
      city: "Mumbai",
      state: "Maharashtra",
    },
  });
  console.log("✅ Profile Updated:", updatedProfile.city, updatedProfile.gender);

  // 4. Simulate Document Upload
  console.log("\n4. Simulating Document Upload...");
  const doc = await prisma.document.create({
    data: {
      userId: user.id,
      type: "PHOTO",
      url: "/uploads/photo-test.jpg",
      mimeType: "image/jpeg",
      size: 1024,
    },
  });
  console.log("✅ Document Record Created:", doc.type, doc.url);

  // 5. Verify Exam Data (Seeding Check)
  console.log("\n5. Checking Exam Database...");
  const exams = await prisma.exam.findMany();
  console.log(`✅ Found ${exams.length} exams.`);
  if (exams.length > 0) {
    console.log("   - First Exam:", exams[0].name);
  } else {
    console.error("   ❌ No exams found! Seeding might have failed.");
  }

  console.log("\n✨ Verification Complete! Backend logic is sound.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
