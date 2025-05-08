import { usersTable } from "@/db/schema";

//Selection
export type User = typeof usersTable.$inferSelect;

//Insertion
export type NewUser = typeof usersTable.$inferInsert;
