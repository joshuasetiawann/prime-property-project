import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";

/**
 * Wraps every public page with the sticky header and the branded footer
 * (logo + copyright). `overlay` lets the header float transparently over a
 * dark hero (landing) and turn solid on scroll.
 */
export function PublicShell({
  overlay = false,
  children,
}: {
  overlay?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader overlay={overlay} />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </>
  );
}
