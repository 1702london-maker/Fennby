import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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
      <div className="flex-1">{children}</div>
      {!hideFooter && <Footer />}
    </div>
  );
}
