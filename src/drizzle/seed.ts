 import db from "./db";
import {
  userTable,
  crimeCategoryTable,
  officerProfileTable,
  crimeReportTable,
  evidenceTable,
  caseAssignmentTable,
  reportUpdateTable,
  notificationTable,
} from "./schema";

async function seed() {
  console.log("🌱 Seeding started...");

  /* =========================
     1. USERS
  ========================= */
  const users = await db
    .insert(userTable)
    .values([
      {
        firstName: "Alice",
        lastName: "Admin",
        email: "admin@example.com",
        password: "hashed-password",
        userRole: "admin",
      },
      {
        firstName: "Brian",
        lastName: "Officer",
        email: "officer@example.com",
        password: "hashed-password",
        userRole: "officer",
      },
      {
        firstName: "Cynthia",
        lastName: "Citizen",
        email: "citizen@example.com",
        password: "hashed-password",
        userRole: "citizen",
      },
    ])
    .returning();

  const admin = users.find((u) => u.userRole === "admin")!;
  const officer = users.find((u) => u.userRole === "officer")!;
  const citizen = users.find((u) => u.userRole === "citizen")!;

  /* =========================
     2. CRIME CATEGORIES
  ========================= */
  const categories = await db
    .insert(crimeCategoryTable)
    .values([
      { name: "Theft", description: "Stealing property" },
      { name: "Fraud", description: "Financial deception" },
      { name: "Assault", description: "Physical attack" },
    ])
    .returning();

  const theftCategory = categories[0];
  const fraudCategory = categories[1];

  /* =========================
     3. OFFICER PROFILE
  ========================= */
  await db.insert(officerProfileTable).values({
    userId: officer.userId,
    badgeNumber: "KP10234",
    rank: "Inspector",
    stationName: "Central Police Station",
    stationLocation: "Nairobi",
  });

  /* =========================
     4. CRIME REPORTS
  ========================= */
  const reports = await db
    .insert(crimeReportTable)
    .values([
      {
        reporterId: citizen.userId,
        categoryId: theftCategory.categoryId,
        title: "Phone stolen",
        description: "My phone was stolen at the bus stage",
        locationText: "Kisumu Bus Stage",
        latitude: "-0.0917",
        longitude: "34.7680",
        status: "assigned",
        priority: "high",
        assignedOfficerId: officer.userId,
      },
      {
        reporterId: citizen.userId,
        categoryId: fraudCategory.categoryId,
        title: "M-Pesa fraud",
        description: "Fake SMS led to money loss",
        locationText: "Kisumu CBD",
        latitude: "-0.1022",
        longitude: "34.7617",
        status: "pending",
        priority: "medium",
      },
    ])
    .returning();

  const report1 = reports[0];
  const report2 = reports[1];

  /* =========================
     5. EVIDENCE
  ========================= */
  await db.insert(evidenceTable).values([
    {
      reportId: report1.reportId,
      fileUrl: "https://example.com/evidence1.jpg",
      fileName: "evidence1.jpg",
      fileType: "image",
      uploadedBy: citizen.userId,
    },
  ]);

  /* =========================
     6. CASE ASSIGNMENT
  ========================= */
  await db.insert(caseAssignmentTable).values({
    reportId: report1.reportId,
    officerId: officer.userId,
    assignedBy: admin.userId,
    assignmentNotes: "Investigate immediately",
  });

  /* =========================
     7. REPORT UPDATES
  ========================= */
  await db.insert(reportUpdateTable).values([
    {
      reportId: report1.reportId,
      updatedBy: admin.userId,
      oldStatus: "pending",
      newStatus: "assigned",
      comment: "Assigned to officer",
    },
    {
      reportId: report2.reportId,
      updatedBy: admin.userId,
      newStatus: "pending",
      comment: "Awaiting review",
    },
  ]);

  /* =========================
     8. NOTIFICATIONS
  ========================= */
  await db.insert(notificationTable).values([
    {
      userId: citizen.userId,
      reportId: report1.reportId,
      type: "assignment",
      title: "Case Assigned",
      message: "Your case has been assigned",
    },
    {
      userId: citizen.userId,
      reportId: report2.reportId,
      type: "report_submitted",
      title: "Report Submitted",
      message: "Your report is under review",
    },
  ]);

  console.log("✅ Seeding completed successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});