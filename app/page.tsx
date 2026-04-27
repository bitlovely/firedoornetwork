import { LandingPage } from "@/components/landing/LandingPage";
import { RecoveryHashRedirect } from "@/components/auth/RecoveryHashRedirect";

export default function Home() {
  return (
    <>
      <RecoveryHashRedirect />
      <LandingPage />
    </>
  );
}
