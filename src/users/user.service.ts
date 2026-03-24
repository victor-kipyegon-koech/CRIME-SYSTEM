 import { desc, eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TUserInsert, TUserSelect, userTable } from "../drizzle/schema";

// ========== Get all users ==========
export const getUsersServices = async (): Promise<TUserSelect[]> => {
  return await db.query.userTable.findMany({
    orderBy: [desc(userTable.userId)],
  });
};

// ========== Get user by ID ==========
export const getUserByIdServices = async (
  userId: number
): Promise<TUserSelect | undefined> => {
  return await db.query.userTable.findFirst({
    where: eq(userTable.userId, userId),
  });
};

// ========== Create a new user ==========
export const createUserServices = async (
  user: TUserInsert
): Promise<TUserSelect> => {
  const createdUsers = await db.insert(userTable).values(user).returning();
  return createdUsers[0];
};

// ========== Update an existing user ==========
export const updateUserServices = async (
  userId: number,
  user: Partial<TUserInsert>
): Promise<TUserSelect | null> => {
  const existingUser = await db.query.userTable.findFirst({
    where: eq(userTable.userId, userId),
  });

  if (!existingUser) {
    return null;
  }

  const updatedUsers = await db
    .update(userTable)
    .set({
      ...user,
      updatedAt: new Date(),
    })
    .where(eq(userTable.userId, userId))
    .returning();

  return updatedUsers[0] ?? null;
};

// ========== Delete an existing user ==========
export const deleteUserServices = async (
  userId: number
): Promise<TUserSelect | null> => {
  const existingUser = await db.query.userTable.findFirst({
    where: eq(userTable.userId, userId),
  });

  if (!existingUser) {
    return null;
  }

  const deletedUsers = await db
    .delete(userTable)
    .where(eq(userTable.userId, userId))
    .returning();

  return deletedUsers[0] ?? null;
};