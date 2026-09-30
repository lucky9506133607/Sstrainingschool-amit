import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "SS Training School | Professional Car Driving Training",
  description:
    "Professional car driving training with beginner, refresher, license and female driving training programs.",
  keywords: [
    "driving school",
    "car driving training",
    "beginner driving",
    "refresher course",
    "driving license training",
    "female driving training",
  ],
  openGraph: {
    title: "SS Training School | Professional Car Driving Training",
    description:
      "Learn to drive with confidence. Beginner, refresher, license and female driving training programs.",
    type: "website",
    siteName: "SS Training School",
  },
  twitter: {
    card: "summary_large_image",
    title: "SS Training School",
    description: "Learn to drive with confidence.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
