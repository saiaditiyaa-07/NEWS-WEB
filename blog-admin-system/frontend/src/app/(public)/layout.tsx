import type { Metadata } from "next";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";

export const metadata: Metadata = {
  title: "BlogCMS – Discover Ideas That Inspire",
  description: "Read the latest articles on technology, design, business, lifestyle and more. Thoughtfully crafted content for curious minds.",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNavbar />
      <main>{children}</main>
      <PublicFooter />
    </>
  );
}
