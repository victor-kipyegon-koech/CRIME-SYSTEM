 
import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  pgEnum,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";

/* =========================
   ENUMS
========================= */

export const userRoleEnum = pgEnum("userRole", [
  "citizen",
  "officer",
  "admin",
  "disabled",
]);

export const reportStatusEnum = pgEnum("reportStatus", [
  "pending",
  "under_review",
  "assigned",
  "in_progress",
  "resolved",
  "rejected",
  "closed",
]);

export const reportPriorityEnum = pgEnum("reportPriority", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const evidenceTypeEnum = pgEnum("evidenceType", [
  "image",
  "video",
  "audio",
  "document",
  "other",
]);

export const notificationTypeEnum = pgEnum("notificationType", [
  "status_update",
  "assignment",
  "report_submitted",
  "general",
]);

/* =========================
   USERS
========================= */

export const userTable = pgTable("userTable", {
  userId: serial("userId").primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  contactPhone: varchar("contactPhone", { length: 20 }),
  address: text("address"),
  nationalId: varchar("nationalId", { length: 50 }),
  userRole: userRoleEnum("userRole").default("citizen").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

/* =========================
   CRIME CATEGORIES
========================= */

export const crimeCategoryTable = pgTable("crimeCategoryTable", {
  categoryId: serial("categoryId").primaryKey(),
  name: varchar("name", { length: 150 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow(),
});

/* =========================
   OFFICER PROFILE
========================= */

export const officerProfileTable = pgTable("officerProfileTable", {
  officerProfileId: serial("officerProfileId").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => userTable.userId, { onDelete: "cascade" }),
  badgeNumber: varchar("badgeNumber", { length: 50 }).notNull().unique(),
  rank: varchar("rank", { length: 100 }),
  stationName: varchar("stationName", { length: 150 }),
  stationLocation: varchar("stationLocation", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

/* =========================
   CRIME REPORTS
========================= */

export const crimeReportTable = pgTable("crimeReportTable", {
  reportId: serial("reportId").primaryKey(),

  reporterId: integer("reporterId").references(() => userTable.userId, {
    onDelete: "set null",
  }),

  categoryId: integer("categoryId")
    .notNull()
    .references(() => crimeCategoryTable.categoryId, { onDelete: "restrict" }),

  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),

  incidentDate: timestamp("incidentDate"),
  reportedAt: timestamp("reportedAt").defaultNow(),

  locationText: varchar("locationText", { length: 255 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),

  suspectDescription: text("suspectDescription"),
  witnessInfo: text("witnessInfo"),

  status: reportStatusEnum("status").default("pending").notNull(),
  priority: reportPriorityEnum("priority").default("medium").notNull(),

  isAnonymous: boolean("isAnonymous").default(false).notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),

  assignedOfficerId: integer("assignedOfficerId").references(() => userTable.userId, {
    onDelete: "set null",
  }),

  resolutionNotes: text("resolutionNotes"),
  resolvedAt: timestamp("resolvedAt"),
  closedAt: timestamp("closedAt"),

  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

/* =========================
   EVIDENCE
========================= */

export const evidenceTable = pgTable("evidenceTable", {
  evidenceId: serial("evidenceId").primaryKey(),
  reportId: integer("reportId")
    .notNull()
    .references(() => crimeReportTable.reportId, { onDelete: "cascade" }),

  fileUrl: varchar("fileUrl", { length: 500 }).notNull(),
  fileName: varchar("fileName", { length: 255 }),
  fileType: evidenceTypeEnum("fileType").default("other").notNull(),
  uploadedBy: integer("uploadedBy").references(() => userTable.userId, {
    onDelete: "set null",
  }),

  createdAt: timestamp("createdAt").defaultNow(),
});

/* =========================
   CASE ASSIGNMENTS
========================= */

export const caseAssignmentTable = pgTable("caseAssignmentTable", {
  assignmentId: serial("assignmentId").primaryKey(),

  reportId: integer("reportId")
    .notNull()
    .references(() => crimeReportTable.reportId, { onDelete: "cascade" }),

  officerId: integer("officerId")
    .notNull()
    .references(() => userTable.userId, { onDelete: "cascade" }),

  assignedBy: integer("assignedBy").references(() => userTable.userId, {
    onDelete: "set null",
  }),

  assignmentNotes: text("assignmentNotes"),
  assignedAt: timestamp("assignedAt").defaultNow(),
});

/* =========================
   REPORT UPDATES / AUDIT TRAIL
========================= */

export const reportUpdateTable = pgTable("reportUpdateTable", {
  updateId: serial("updateId").primaryKey(),

  reportId: integer("reportId")
    .notNull()
    .references(() => crimeReportTable.reportId, { onDelete: "cascade" }),

  updatedBy: integer("updatedBy").references(() => userTable.userId, {
    onDelete: "set null",
  }),

  oldStatus: reportStatusEnum("oldStatus"),
  newStatus: reportStatusEnum("newStatus"),

  comment: text("comment"),
  internalNote: text("internalNote"),

  createdAt: timestamp("createdAt").defaultNow(),
});

/* =========================
   NOTIFICATIONS
========================= */

export const notificationTable = pgTable("notificationTable", {
  notificationId: serial("notificationId").primaryKey(),

  userId: integer("userId")
    .notNull()
    .references(() => userTable.userId, { onDelete: "cascade" }),

  reportId: integer("reportId").references(() => crimeReportTable.reportId, {
    onDelete: "cascade",
  }),

  type: notificationTypeEnum("type").default("general").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("isRead").default(false).notNull(),

  createdAt: timestamp("createdAt").defaultNow(),
});

/* =========================
   RELATIONS
========================= */

export const userRelations = relations(userTable, ({ many, one }) => ({
  submittedReports: many(crimeReportTable),
  uploadedEvidence: many(evidenceTable),
  notifications: many(notificationTable),
  caseAssignments: many(caseAssignmentTable),
  reportUpdates: many(reportUpdateTable),
  officerProfile: one(officerProfileTable, {
    fields: [userTable.userId],
    references: [officerProfileTable.userId],
  }),
}));

export const crimeCategoryRelations = relations(crimeCategoryTable, ({ many }) => ({
  reports: many(crimeReportTable),
}));

export const officerProfileRelations = relations(officerProfileTable, ({ one }) => ({
  user: one(userTable, {
    fields: [officerProfileTable.userId],
    references: [userTable.userId],
  }),
}));

export const crimeReportRelations = relations(crimeReportTable, ({ one, many }) => ({
  reporter: one(userTable, {
    fields: [crimeReportTable.reporterId],
    references: [userTable.userId],
  }),
  category: one(crimeCategoryTable, {
    fields: [crimeReportTable.categoryId],
    references: [crimeCategoryTable.categoryId],
  }),
  assignedOfficer: one(userTable, {
    fields: [crimeReportTable.assignedOfficerId],
    references: [userTable.userId],
  }),
  evidenceFiles: many(evidenceTable),
  assignments: many(caseAssignmentTable),
  updates: many(reportUpdateTable),
  notifications: many(notificationTable),
}));

export const evidenceRelations = relations(evidenceTable, ({ one }) => ({
  report: one(crimeReportTable, {
    fields: [evidenceTable.reportId],
    references: [crimeReportTable.reportId],
  }),
  uploader: one(userTable, {
    fields: [evidenceTable.uploadedBy],
    references: [userTable.userId],
  }),
}));

export const caseAssignmentRelations = relations(caseAssignmentTable, ({ one }) => ({
  report: one(crimeReportTable, {
    fields: [caseAssignmentTable.reportId],
    references: [crimeReportTable.reportId],
  }),
  officer: one(userTable, {
    fields: [caseAssignmentTable.officerId],
    references: [userTable.userId],
  }),
  assignedByUser: one(userTable, {
    fields: [caseAssignmentTable.assignedBy],
    references: [userTable.userId],
  }),
}));

export const reportUpdateRelations = relations(reportUpdateTable, ({ one }) => ({
  report: one(crimeReportTable, {
    fields: [reportUpdateTable.reportId],
    references: [crimeReportTable.reportId],
  }),
  updatedByUser: one(userTable, {
    fields: [reportUpdateTable.updatedBy],
    references: [userTable.userId],
  }),
}));

export const notificationRelations = relations(notificationTable, ({ one }) => ({
  user: one(userTable, {
    fields: [notificationTable.userId],
    references: [userTable.userId],
  }),
  report: one(crimeReportTable, {
    fields: [notificationTable.reportId],
    references: [crimeReportTable.reportId],
  }),
}));

/* =========================
   TYPES
========================= */

export type TUserInsert = typeof userTable.$inferInsert;
export type TUserSelect = typeof userTable.$inferSelect;

export type TCrimeCategoryInsert = typeof crimeCategoryTable.$inferInsert;
export type TCrimeCategorySelect = typeof crimeCategoryTable.$inferSelect;

export type TOfficerProfileInsert = typeof officerProfileTable.$inferInsert;
export type TOfficerProfileSelect = typeof officerProfileTable.$inferSelect;

export type TCrimeReportInsert = typeof crimeReportTable.$inferInsert;
export type TCrimeReportSelect = typeof crimeReportTable.$inferSelect;

export type TEvidenceInsert = typeof evidenceTable.$inferInsert;
export type TEvidenceSelect = typeof evidenceTable.$inferSelect;

export type TCaseAssignmentInsert = typeof caseAssignmentTable.$inferInsert;
export type TCaseAssignmentSelect = typeof caseAssignmentTable.$inferSelect;

export type TReportUpdateInsert = typeof reportUpdateTable.$inferInsert;
export type TReportUpdateSelect = typeof reportUpdateTable.$inferSelect;

export type TNotificationInsert = typeof notificationTable.$inferInsert;
export type TNotificationSelect = typeof notificationTable.$inferSelect;