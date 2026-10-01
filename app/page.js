import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Courses from "@/components/Courses";
import WhyChooseUs from "@/components/WhyChooseUs";
import TrainingProcess from "@/components/TrainingProcess";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-background">
      <Navbar />
      <Hero />
      <About />
      <Courses />
      <WhyChooseUs />
      <TrainingProcess />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Contact />
      <Newsletter />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
