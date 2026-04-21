import type { Metadata } from "next";
import { AffiliateApplicationForm } from "@/components/apply/AffiliateApplicationForm";

export const metadata: Metadata = {
  title: "Become an Affiliate — FireDoor Network",
  description:
    "Apply to join the UK network for verified fire door surveyors and inspectors.",
};

export default function ApplyPage() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:py-16">
      <p className="text-xs font-semibold tracking-wider text-accent uppercase">
        Affiliate application
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
        Become a Verified Affiliate
      </h1>
      <p className="mt-3 text-muted-foreground">
        This is how we build the directory: your details and documents are reviewed by our
        team, then approved profiles go live for property managers and contractors to find
        you.
      </p>
      <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <AffiliateApplicationForm />
      </div>
    </main>
  );
}
