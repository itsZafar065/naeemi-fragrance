import { redirect } from "next/navigation";

export default async function AdminCatchAllRedirect({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = slug && slug.length > 0 ? slug.join("/") : "";
  redirect(`/naeemi-fragrance-secure-vault-admin-portal${path ? `/${path}` : ""}`);
}
