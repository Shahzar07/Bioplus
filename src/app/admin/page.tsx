import { requireStaff } from "@/lib/auth";

export default async function AdminHome() {
  const user = await requireStaff();
  return <p>admin ok: {user.email}</p>;
}
