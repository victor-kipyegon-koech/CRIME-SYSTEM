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
  console.log("✅ Crime Reporting System seeding started...");

  /* =========================
     1. USERS
  ========================= */
  await db.insert(userTable).values([
    {
      userId: 1,
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@example.com",
      password: "hashed-password-1",
      contactPhone: "0712345678",
      address: "Nairobi, Kenya",
      nationalId: "12345678",
      userRole: "admin",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: 2,
      firstName: "Brian",
      lastName: "Kiptoo",
      email: "brian@example.com",
      password: "hashed-password-2",
      contactPhone: "0798765432",
      address: "Eldoret, Kenya",
      nationalId: "23456789",
      userRole: "officer",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: 3,
      firstName: "Cynthia",
      lastName: "Achieng",
      email: "cynthia@example.com",
      password: "hashed-password-3",
      contactPhone: "0700111222",
      address: "Kisumu, Kenya",
      nationalId: "34567890",
      userRole: "citizen",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  /* =========================
     2. CRIME CATEGORIES
  ========================= */
  await db.insert(crimeCategoryTable).values([
    {
      categoryId: 1,
      name: "Theft",
      description: "Stealing of property or belongings",
      createdAt: new Date(),
    },
    {
      categoryId: 2,
      name: "Assault",
      description: "Physical attack or threat of violence",
      createdAt: new Date(),
    },
    {
      categoryId: 3,
      name: "Fraud",
      description: "Deception for financial or personal gain",
      createdAt: new Date(),
    },
    {
      categoryId: 4,
      name: "Domestic Violence",
      description: "Violence or abuse within the home",
      createdAt: new Date(),
    },
  ]);

  /* =========================
     3. OFFICER PROFILE
  ========================= */
  await db.insert(officerProfileTable).values([
    {
      officerProfileId: 1,
      userId: 2,
      badgeNumber: "KP10234",
      rank: "Inspector",
      stationName: "Central Police Station",
      stationLocation: "Nairobi",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  /* =========================
     4. CRIME REPORTS
  ========================= */
  await db.insert(crimeReportTable).values([
    {
      reportId: 1,
      reporterId: 3,
      categoryId: 1,
      title: "Phone stolen at bus stage",
      description: "My phone was stolen while I was boarding a matatu at the bus stage.",
      incidentDate: new Date("2026-03-20T18:30:00"),
      reportedAt: new Date(),
      locationText: "Kisumu Bus Stage",
      latitude: " -0.0917",
      longitude: "34.7680",
      suspectDescription: "Male adult wearing a black hoodie",
      witnessInfo: "Two nearby vendors may have seen the incident",
      status: "assigned",
      priority: "high",
      isAnonymous: false,
      isVerified: true,
      assignedOfficerId: 2,
      resolutionNotes: null,
      resolvedAt: null,
      closedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      reportId: 2,
      reporterId: 3,
      categoryId: 3,
      title: "Mobile money fraud",
      description: "I received a fake transaction confirmation and lost money.",
      incidentDate: new Date("2026-03-18T14:00:00"),
      reportedAt: new Date(),
      locationText: "Kisumu CBD",
      latitude: "-0.1022",
      longitude: "34.7617",
      suspectDescription: "Unknown caller pretending to be customer care",
      witnessInfo: null,
      status: "pending",
      priority: "medium",
      isAnonymous: false,
      isVerified: false,
      assignedOfficerId: null,
      resolutionNotes: null,
      resolvedAt: null,
      closedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  /* =========================
     5. EVIDENCE
  ========================= */
  await db.insert(evidenceTable).values([
    {
      evidenceId: 1,
      reportId: 1,
      fileUrl: "https://example.com/uploads/stolen-phone-photo.jpg",
      fileName: "stolen-phone-photo.jpg",
      fileType: "image",
      uploadedBy: 3,
      createdAt: new Date(),
    },
    {
      evidenceId: 2,
      reportId: 2,
      fileUrl: "https://example.com/uploads/fraud-sms-screenshot.png",
      fileName: "fraud-sms-screenshot.png",
      fileType: "image",
      uploadedBy: 3,
      createdAt: new Date(),
    },
  ]);

  /* =========================
     6. CASE ASSIGNMENTS
  ========================= */
  await db.insert(caseAssignmentTable).values([
    {
      assignmentId: 1,
      reportId: 1,
      officerId: 2,
      assignedBy: 1,
      assignmentNotes: "Investigate theft case and contact witnesses.",
      assignedAt: new Date(),
    },
  ]);

  /* =========================
     7. REPORT UPDATES
  ========================= */
  await db.insert(reportUpdateTable).values([
    {
      updateId: 1,
      reportId: 1,
      updatedBy: 1,
      oldStatus: "pending",
      newStatus: "assigned",
      comment: "Case reviewed and assigned to investigating officer.",
      internalNote: "High priority because theft occurred in a public area.",
      createdAt: new Date(),
    },
    {
      updateId: 2,
      reportId: 2,
      updatedBy: 1,
      oldStatus: null,
      newStatus: "pending",
      comment: "Report received and awaiting review.",
      internalNote: "Need to verify mobile transaction records.",
      createdAt: new Date(),
    },
  ]);

  /* =========================
     8. NOTIFICATIONS
  ========================= */
  await db.insert(notificationTable).values([
    {
      notificationId: 1,
      userId: 3,
      reportId: 1,
      type: "assignment",
      title: "Case Assigned",
      message: "Your report has been assigned to an officer for investigation.",
      isRead: false,
      createdAt: new Date(),
    },
    {
      notificationId: 2,
      userId: 3,
      reportId: 2,
      type: "report_submitted",
      title: "Report Submitted",
      message: "Your crime report was submitted successfully and is awaiting review.",
      isRead: false,
      createdAt: new Date(),
    },
  ]);

  console.log("✅ Crime Reporting System seeding complete!");
  process.exit(0);
}

seed().catch((e) => {
  console.error("❌ Seeding failed:", e);
  process.exit(1);
});