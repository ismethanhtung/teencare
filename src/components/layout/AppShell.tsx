import type { ReactNode } from "react";
import { Leftbar } from "./Leftbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-main text-text-main">
      <Leftbar />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
