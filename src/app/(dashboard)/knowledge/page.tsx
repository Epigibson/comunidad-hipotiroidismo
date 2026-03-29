import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import KnowledgeClient from "@/components/knowledge/KnowledgeClient";

export default async function KnowledgePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return <KnowledgeClient />;
}
