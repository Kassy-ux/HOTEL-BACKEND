import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { users, type TUsersInsert,  TUsersSelect } from "../drizzle/schema";
import { UserSchema, PartialUserSchema, type UserInput, type PartialUserInput } from "../validation/user.validation";

//  Get all users
export const getUsersService = async (): Promise<TUsersSelect[]> => {
  return await db.query.users.findMany(
    {
      with: {
        
        bookings: true,
        
      }
    }
  );

};

//  Get user by ID
export const getUserByIdService = async (userId: number): Promise<TUsersSelect | undefined> => {
  return await db.query.users.findFirst({
    where: eq(users.userId, userId),
  });
};

// Create new user
export const createUserService = async (userData: UserInput): Promise<TUsersSelect> => {
  const validated = UserSchema.parse(userData);
  const result = await db.insert(users).values(validated).returning();
  return result[0];
};

// Update user
export const updateUserService = async (userId: number, userData: PartialUserInput): Promise<TUsersSelect> => {
  const validated = PartialUserSchema.parse(userData);
  const result = await db
    .update(users)
    .set(validated)
    .where(eq(users.userId, userId))
    .returning();
  return result[0];
};

// Delete user
export const deleteUserService = async (userId: number): Promise<TUsersSelect> => {
  const result = await db
    .delete(users)
    .where(eq(users.userId, userId))
    .returning();
  return result[0];
};
