import { Binoculars, Rocket } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { TeamSwitcher } from "~/components/team-switcher";
import { Button } from "~/components/ui/button";

export function WelcomeCard({
  teams,
  name,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
  name: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>👋 Welcome {name},</CardTitle>
        <CardDescription>
          Learn the basics of how to use Regreso.
        </CardDescription>
      </CardHeader>
      <CardContent className="sm:p-3 xl:p-6">
        <TeamSwitcher teams={teams} />

        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline">
            <Rocket />
            Setup Guide
          </Button>
          <Button size="sm">
            <Binoculars /> Start Tour
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
