 import { desc, eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TUserInsert, TUserSelect, userTable } from "../drizzle/schema";

// ========== Get all users ==========
export const getUsersServices = async (): Promise<TUserSelect[] | null> => {
  return await db.query.userTable.findMany({
    with: {
      submittedReports: true, // reports submitted by the user
      assignedReports: true,  // reports assigned to this user (officer/admin)
    },
    orderBy: [desc(userTable.userId)],
  });
};

// ========== Get user by ID ==========
export const getUserByIdServices = async (
  userId: number
): Promise<TUserSelect | undefined> => {
  return await db.query.userTable.findFirst({
    where: eq(userTable.userId, userId),
    with: {
      submittedReports: true,
      assignedReports: true,
    },
  });
};

// ========== Create a new user ==========
export const createUserServices = async (
  user: TUserInsert
): Promise<TUserSelect> => {
  const [createdUser] = await db
    .insert(userTable)
    .values(user)
    .returning();

  return createdUser;
};

// ========== Update an existing user ==========
export const updateUserServices = async (
  userId: number,
  user: Partial<TUserInsert>
): Promise<TUserSelect | undefined> => {
  await db.update(userTable).set(user).where(eq(userTable.userId, userId));

  const updatedUser = await db.query.userTable.findFirst({
    where: eq(userTable.userId, userId),
    with: {
      submittedReports: true,
      assignedReports: true,
    },
  });

  return updatedUser || undefined;
};

// ========== Delete a user ==========
export const deleteUserServices = async (
  userId: number
): Promise<TUserSelect | undefined> => {
  const userToDelete = await db.query.userTable.findFirst({
    where: eq(userTable.userId, userId),
  });

  if (!userToDelete) return undefined;

  await db.delete(userTable).where(eq(userTable.userId, userId));

  return userToDelete;
};