import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LabsList from "@/components/labs/LabsList";

export default async function LabsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: labs } = (await supabase
    .from("lab_results")
    .select("id, test_date, lab_name, tsh_level, t4_free_level, t3_free_level, anti_tpo_level, anti_tg_level, notes")
    .eq("user_id", user.id)
    .order("test_date", { ascending: false })
    .limit(50)) as { data: Array<{
      id: string;
      test_date: string;
      lab_name: string | null;
      tsh_level: number | null;
      t4_free_level: number | null;
      t3_free_level: number | null;
      anti_tpo_level: number | null;
      anti_tg_level: number | null;
      notes: string | null;
    }> | null };

  return (
    <div className="animate-fadeInUp">
      <LabsList labs={labs ?? []} userId={user.id} />
    </div>
  );
}
