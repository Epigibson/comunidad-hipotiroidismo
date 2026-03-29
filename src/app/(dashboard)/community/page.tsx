import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CommunityClient from "@/components/community/CommunityClient";

export default async function CommunityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch categories
  const { data: categories } = (await supabase
    .from("community_categories")
    .select("id, name, slug, description, icon, has_trigger_warning, trigger_warning_text")
    .order("sort_order", { ascending: true })) as {
    data: Array<{
      id: string;
      name: string;
      slug: string;
      description: string;
      icon: string;
      has_trigger_warning: boolean;
      trigger_warning_text: string | null;
    }> | null;
  };

  // Fetch user alias
  const { data: profile } = (await supabase
    .from("profiles")
    .select("alias")
    .eq("id", user.id)
    .single()) as { data: { alias: string } | null };

  return (
    <div className="animate-fadeInUp">
      <CommunityClient
        categories={categories ?? []}
        userId={user.id}
        userAlias={profile?.alias ?? "Usuario"}
      />
    </div>
  );
}
