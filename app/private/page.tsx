import { redirect } from "next/navigation";

export default function PrivateRedirectPage() {
  redirect("/privacy");
}

