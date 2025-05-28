import { db } from "@/db/index";
import { usersTable } from "@/db/schema";
import { User } from "../types";
import { eq } from "drizzle-orm";

export async function getUserByEmail(email: string):Promise<User | null | Error>{
  try{
    const [res] = await db.select().from(usersTable).where(eq(usersTable.email,email ));
    return res ?? null;
  }catch(err){
    return new Error(`Error while querying user by email. Full error: ${err}`)
  }
}
