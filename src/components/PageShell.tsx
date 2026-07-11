import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SidebarNav } from "@/components/SidebarNav";

export function PageShell({
  children,
  hideFooter = false,
}: {
  children: React.ReactNode;
  hideFooter?: boolean;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex">
        <SidebarNav />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
      {!hideFooter && <Footer />}
    </div>
  );
}
