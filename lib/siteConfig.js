// Centralized business configuration for SS Training School.
// Never hardcode business info across components — import from here.

export const siteConfig = {
  name: "SS Training School",
  shortName: "SS Training",
  tagline: "Learn to Drive With Confidence",
  description:
    "Professional car driving training with beginner, refresher, license and female driving training programs.",

  // Contact details (update with your real numbers)
  phone: "+91 98765 43210",
  phoneRaw: "919876543210",
  whatsapp: "919876543210",
  email: "sstrainingschool89@gmail.com",
  address: "Main Road, Your City, India",
  hours: "Mon – Sun · 6:00 AM – 8:00 PM",

  nav: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Courses", href: "#courses" },
    { label: "Why Us", href: "#why-us" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ],

  courses: [
    {
      id: "beginner",
      title: "Beginner Car Driving",
      icon: "Car",
      description:
        "Start from zero with patient, step-by-step guidance covering controls, clutch, gears and road basics.",
    },
    {
      id: "refresher",
      title: "Refresher Course",
      icon: "RefreshCw",
      description:
        "Been away from the wheel? Rebuild your driving confidence with focused practical sessions.",
    },
    {
      id: "license",
      title: "Driving License Training",
      icon: "BadgeCheck",
      description:
        "Get fully prepared for your RTO test with structured lessons and real test-route practice.",
    },
    {
      id: "female",
      title: "Female Driving Training",
      icon: "UserRound",
      description:
        "A comfortable, safe and supportive learning environment designed for women learners.",
    },
  ],

  courseOptions: [
    "Beginner Car Driving",
    "Refresher Course",
    "Driving License Training",
    "Female Driving Training",
    "Other",
  ],

  pricing: [
    {
      name: "BASIC",
      price: "3500",
      km: "8 km per day",
      popular: false,
      features: ["8 km practice per day", "Certified instructor", "Dual-control car", "Flexible timings"],
    },
    {
      name: "STANDARD",
      price: "4500",
      km: "10 km per day",
      popular: true,
      features: ["10 km practice per day", "Certified instructor", "Dual-control car", "Priority scheduling", "License test guidance"],
    },
    {
      name: "ADVANCE",
      price: "5500",
      km: "11 km per day",
      popular: false,
      features: ["11 km practice per day", "Senior instructor", "Dual-control car", "Highway & parking mastery", "Full license support"],
    },
  ],

  socials: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
  },
};

export const whatsappLink = (message = "Hi SS Training School, I would like to book a driving training session.") =>
  `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;

export default siteConfig;
