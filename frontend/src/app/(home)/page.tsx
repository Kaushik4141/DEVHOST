import {
  FAQ,
  Featured,
  FinancialFuture,
  FinancilaFreedom,
  HeroSection,
  IntroSection,
  // JoinSection, // commented correctly
  OffersSection,
} from '@/components';
import SignInCTA from '@/components/SignInCTA';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <SignInCTA />
      <Featured />
      <OffersSection />
      <FinancilaFreedom />
      <FinancialFuture />
      <IntroSection />
      {/* <JoinSection /> */}
      <FAQ />
    </main>
  );
}
