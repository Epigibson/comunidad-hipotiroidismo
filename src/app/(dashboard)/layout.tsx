import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/layout/DashboardNav";
import { BottomNav } from "@/components/layout/BottomNav";
import type { Profile } from "@/lib/types/database";
import "./dashboard.css";
import "./modules.css";
import "./modules-extra.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  const { data: profile } = (await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()) as { data: Profile | null };

  return (
    <div className="dashboard-layout">
      <DashboardNav
        user={{
          alias: profile?.alias ?? "Usuario",
          avatarUrl: profile?.avatar_url ?? null,
          role: profile?.role ?? "patient",
        }}
      />
      <main className="dashboard-main">{children}</main>
      <BottomNav />
    </div>
  );
}
