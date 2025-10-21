import Features from "../components/feature";
import Footer from "../components/footer";
import Hero from "../components/hero";
import Navbar from "../components/navbar";
import Pricing from "../components/pricing";
import { auth } from "../lib/auth";

export default async function HomePage() {
  const session = await auth();
  return (
    <>
      <Navbar session={session} />
      <main>
        <Hero />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
