import { Button } from "~/components/ui/button";
import { SettingsDialog } from "~/components/settings-dialog";

export default function Page() {
  return (
    <div className="flex h-svh items-center justify-center">
      <SettingsDialog>
        <Button>Open Dialog</Button>
      </SettingsDialog>
    </div>
  );
}
