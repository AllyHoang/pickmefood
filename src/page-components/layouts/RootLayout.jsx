import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const RootLayout = ({ children }) => {
  return (
    <div
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}
    >
      {children}
    </div>
  );
};

