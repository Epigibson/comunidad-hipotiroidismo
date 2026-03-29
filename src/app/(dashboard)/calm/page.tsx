import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CalmClient from "@/components/calm/CalmClient";

export default async function CalmPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return <CalmClient />;
}
