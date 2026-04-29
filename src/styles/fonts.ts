import { Playfair_Display } from "next/font/google";

export const playfairDisplay = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
});
