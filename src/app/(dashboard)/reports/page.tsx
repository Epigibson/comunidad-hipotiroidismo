import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ReportsClient from "@/components/reports/ReportsClient";

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="animate-fadeInUp">
      <ReportsClient userId={user.id} />
    </div>
  );
}
