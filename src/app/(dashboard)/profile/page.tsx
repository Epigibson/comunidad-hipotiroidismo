import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileClient from "@/components/profile/ProfileClient";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch profile
  const { data: profile } = (await supabase
    .from("profiles")
    .select("alias, avatar_url, date_of_birth, gender, role, created_at")
    .eq("id", user.id)
    .single()) as {
    data: {
      alias: string;
      avatar_url: string | null;
      date_of_birth: string | null;
      gender: string | null;
      role: string;
      created_at: string;
    } | null;
  };

  if (!profile) redirect("/login");

  // Fetch health conditions
  const { data: conditions } = (await supabase
    .from("health_conditions")
    .select("id, condition_name, diagnosed_date")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })) as {
    data: Array<{
      id: string;
      condition_name: string;
      diagnosed_date: string | null;
    }> | null;
  };

  return (
    <div className="animate-fadeInUp">
      <ProfileClient
        profile={profile}
        conditions={conditions ?? []}
        userId={user.id}
        email={user.email ?? ""}
      />
    </div>
  );
}
