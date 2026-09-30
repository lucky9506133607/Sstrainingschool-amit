import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/siteConfig";

export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-black shadow-lg shadow-black/40 transition-transform hover:scale-110"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30" />
    </a>
  );
}
