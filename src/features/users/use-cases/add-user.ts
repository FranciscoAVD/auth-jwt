import { db } from "@/db/index";
import { usersTable } from "@/db/schema";
import type { NewUser } from "@/db/types";

export async function addUser(data: NewUser): Promise<number | Error> {
  try {
    const [{ id }] = await db
      .insert(usersTable)
      .values(data)
      .returning({ id: usersTable.id });
    return id;
  } catch (err) {
    return new Error(`Error while adding new user. Full error: ${err}`);
  }
}
