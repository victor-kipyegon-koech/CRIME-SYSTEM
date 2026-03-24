 
import { z } from "zod";

export const roleEnum = z.enum(["member", "admin", "disabled"]);
export const bookingStatusEnum = z.enum(["pending", "confirmed", "canceled", "completed"]);
export const paymentStatusEnum = z.enum(["pending", "failed", "canceled", "completed"]);
export const ticketStatusEnum = z.enum(["pending", "in_progress", "resolved", "closed"]);

const stringOptional = z.string().optional();
const timestampOptional = z.coerce.date().optional();
const decimalString = z.union([z.string(), z.number()]).transform(Number);
const idSchema = z.number().int().positive();

// ✅ user validation (fix: email + password now optional in baseUser)
const baseUser = z.object({
  firstName: stringOptional,
  lastName: stringOptional,
  email: z.string().email().optional(),     // ← made optional
  password: z.string().min(6).optional(),   // ← made optional
  contactPhone: stringOptional,
  address: stringOptional,
  userType: roleEnum.optional(),
  createdAt: timestampOptional,
  updatedAt: timestampOptional,
  avatarUrl: z.string().url().optional(),
});

export const createUserSchema = baseUser.extend({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),      // still required for create
  password: z.string().min(6),    // still required for create
  userType: roleEnum.default("member"),
});

export const updateUserSchema = baseUser.partial(); // works cleanly with profile form

// =======================
// VENUE VALIDATION
// =======================
const baseVenue = z.object({
  name: z.string().min(1),
  address: stringOptional,
  capacity: z.number().int().positive(),
  createdAt: timestampOptional,
});

export const createVenueSchema = baseVenue;
export const updateVenueSchema = baseVenue.partial();

// =======================
// EVENT VALIDATION
// =======================
const baseEvent = z.object({
  title: z.string().min(1),
  description: stringOptional,
  venueId: idSchema,
  category: stringOptional,
  date: stringOptional,
  time: stringOptional,
  ticketPrice: decimalString,
  ticketsTotal: z.number().int().positive(),
  ticketsSold: z.number().int().nonnegative().optional(),
  createdAt: timestampOptional,
  updatedAt: timestampOptional,
});

export const createEventSchema = baseEvent;
export const updateEventSchema = baseEvent.partial();

// =======================
// BOOKING VALIDATION
// =======================
const baseBooking = z.object({
  userId: idSchema,
  eventId: idSchema,
  quantity: z.number().int().positive(),
  totalAmount: decimalString,
  status: bookingStatusEnum.optional(),
  createdAt: timestampOptional,
  updatedAt: timestampOptional,
});

export const createBookingSchema = baseBooking;
export const updateBookingSchema = baseBooking.partial();

// =======================
// PAYMENT VALIDATION
// =======================
const basePayment = z.object({
  bookingId: idSchema,
  amount: decimalString,
  paymentStatus: paymentStatusEnum.optional(),
  paymentDate: timestampOptional,
  paymentMethod: stringOptional,
  transactionId: stringOptional,
  createdAt: timestampOptional,
  updatedAt: timestampOptional,
});

export const createPaymentSchema = basePayment;
export const updatePaymentSchema = basePayment.partial();

// =======================
// SUPPORT VALIDATION
// =======================
const baseSupport = z.object({
  userId: idSchema,
  subject: z.string().min(1).max(255),
  message: z.string().min(1),
  status: ticketStatusEnum.optional(),
  createdAt: timestampOptional,
  updatedAt: timestampOptional,
});

export const createSupportSchema = baseSupport;
export const updateSupportSchema = baseSupport.partial();
