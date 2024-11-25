import { Navigation } from "~/components/navigation";
import Hero from "~/components/hero";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { FeatureCards } from "~/components/feature-cards";
import { Github, Code, Users, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-slate-950 dark:text-white">
      {" "}
      <Navigation />
      <Hero />
      {/* Features Section */}
      <section className="bg-gray-50 py-20 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Key Features</h2>

          <FeatureCards />
        </div>
      </section>
      {/* Open Source Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">Open Source Power</h2>

          <p className="mx-auto mb-8 max-w-2xl text-gray-600 dark:text-slate-300">
            Regreso is proudly open source. We believe in the power of
            community-driven development and transparency.
          </p>

          <div className="flex justify-center space-x-4">
            <Link href="https://github.com/your-repo" passHref>
              <Button className="bg-gray-800 text-white hover:bg-gray-700 dark:bg-slate-800 dark:hover:bg-slate-700">
                <Github className="mr-2 h-4 w-4" /> View on GitHub
              </Button>
            </Link>

            <Link href="/contribute" passHref>
              <Button variant="outline">Contribute</Button>
            </Link>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="bg-gray-50 py-20 dark:bg-slate-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">
            Ready to Never Lose Your Digital Trail?
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-gray-600 dark:text-slate-300">
            Join thousands of users who have streamlined their digital journey
            with Regreso.
          </p>

          <Button className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-3 text-lg text-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
            Get Started for Free
          </Button>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-white py-10 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="mb-6 w-full md:mb-0 md:w-1/3">
              <h3 className="mb-4 text-xl font-bold">Regreso</h3>

              <p className="text-gray-600 dark:text-slate-400">
                Your digital breadcrumbs, always at your fingertips.
              </p>
            </div>

            <div className="mb-6 w-full md:mb-0 md:w-1/3">
              <h4 className="mb-4 text-lg font-semibold">Quick Links</h4>

              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    About
                  </Link>
                </li>

                <li>
                  <Link
                    href="/team"
                    className="text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    Team
                  </Link>
                </li>

                <li>
                  <Link
                    href="/docs"
                    className="text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    Documentation
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contribute"
                    className="text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    Contribute
                  </Link>
                </li>
              </ul>
            </div>

            <div className="w-full md:w-1/3">
              <h4 className="mb-4 text-lg font-semibold">Connect</h4>

              <div className="flex space-x-4">
                <Link
                  href="https://github.com/your-repo"
                  className="text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <Github className="h-6 w-6" />
                </Link>

                {/* Add more social icons as needed */}
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-gray-600 dark:border-slate-800 dark:text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} Regreso. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg bg-slate-800 p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
