import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AffiliateApplicationForm } from "@/components/apply/AffiliateApplicationForm";

export const metadata: Metadata = {
  title: "Become an Affiliate — FireDoor Network",
  description:
    "Apply to join the UK network for verified fire door surveyors and inspectors.",
};

export default function ApplyPage() {
  return (
    <main className="relative min-h-dvh w-full overflow-hidden text-white">
      <div
        className="pointer-events-none absolute inset-0 z-0 select-none"
        aria-hidden
      >
        <Image
          src="/hero-firedoor.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          quality={80}
        />
        <div className="absolute inset-0 bg-black/68" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-10 sm:px-6 lg:py-14">
        <div className="mb-8 flex justify-start lg:mb-10">
          <Link
            href="/"
            className="text-xs text-white underline-offset-4 hover:underline sm:text-sm"
          >
            Back to home
          </Link>
        </div>
        <AffiliateApplicationForm />
      </div>
    </main>
  );
}
