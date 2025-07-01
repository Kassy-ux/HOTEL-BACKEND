import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { users } from "../drizzle/schema";
import bcrypt from "bcrypt";
import { RegisterInput, LoginInput } from "../validation/auth.validator";
import { TUsersInsert, TUsersSelect } from "../drizzle/schema";

export const createUserServices = async (userData: RegisterInput): Promise<TUsersSelect> => {
  try {
    const result = await db.insert(users)
      .values({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        contactPhone: userData.contactPhone || null,
        address: userData.address || null,
        role: userData.role
      })
      .returning();
    
    return result[0];
  } catch (error) {
    throw new Error(`Failed to create user: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const getUserByEmailService = async (email: string): Promise<TUsersSelect | undefined> => {
  try {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email)
    });
    return result || undefined;
  } catch (error) {
    throw new Error(`Failed to get user by email: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const getUserByIdService = async (userId: number): Promise<TUsersSelect | undefined> => {
  try {
    const result = await db.query.users.findFirst({
      where: eq(users.userId, userId)
    });
    return result || undefined;
  } catch (error) {
    throw new Error(`Failed to get user by ID: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const updateUserPasswordService = async (email: string, newPassword: string): Promise<TUsersSelect> => {
  try {
    const result = await db.update(users)
      .set({ 
        password: newPassword,
        updatedAt: new Date() 
      })
      .where(eq(users.email, email))
      .returning();
    
    if (!result[0]) {
      throw new Error("User not found");
    }
    
    return result[0];
  } catch (error) {
    throw new Error(`Failed to update password: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const verifyUserCredentials = async (email: string, password: string): Promise<TUsersSelect> => {
  try {
    const user = await getUserByEmailService(email);
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }

    return user;
  } catch (error) {
    throw new Error(`Authentication failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const updateUserProfileService = async (
  userId: number, 
  updateData: {
    firstName?: string;
    lastName?: string;
    contactPhone?: string | null;
    address?: string | null;
  }
): Promise<TUsersSelect> => {
  try {
    const result = await db.update(users)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(users.userId, userId))
      .returning();
    
    if (!result[0]) {
      throw new Error("User not found");
    }
    
    return result[0];
  } catch (error) {
    throw new Error(`Failed to update profile: ${error instanceof Error ? error.message : String(error)}`);
  }
};