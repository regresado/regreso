import Link from "next/link";

import { motion } from "framer-motion";
import { Binoculars, Rocket } from "lucide-react";

import { useOnborda } from "onborda";

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
  const { startOnborda, closeOnborda } = useOnborda();
  return (
    <motion.div
      initial={{ opacity: 0.5, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0,
        duration: 0.2,
        ease: "easeOut",
      }}
    >
      <Card id="welcome-card">
        <CardHeader>
          <CardTitle>👋 Welcome {name},</CardTitle>
          <CardDescription>
            Learn the basics of how to use Regreso.
          </CardDescription>
        </CardHeader>
        <CardContent className="sm:p-3 xl:p-6">
          <TeamSwitcher teams={teams} />

          <div className="mt-4 flex gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link href="/guide">
                <Rocket />
                Setup Guide
              </Link>
            </Button>
            <Button
              size="sm"
              onClick={() => {
                startOnborda("welcome-tour");
              }}
            >
              <Binoculars /> Start Tour
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
