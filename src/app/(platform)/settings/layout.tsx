import { SettingsDialog } from "~/components/settings-dialog";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-svh items-center justify-center">
      <SettingsDialog>{children}</SettingsDialog>
    </div>
  );
}
