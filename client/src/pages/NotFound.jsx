import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page Not Found — Suraj Kumar";
    return () => {
      document.title = "Suraj Kumar — Full-Stack Web Developer";
    };
  }, []);

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
        {/* Big 404 */}
        <p className="text-7xl font-bold tracking-tighter text-neutral-900 dark:text-white sm:text-8xl lg:text-9xl">
          404
        </p>

        {/* Subtitle */}
        <h1 className="mt-4 text-lg font-semibold tracking-tight text-neutral-500 dark:text-neutral-400 sm:text-xl">
          Page not found
        </h1>

        {/* Back to Home button */}
        <Link
          to="/"
          className="group mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-neutral-700 hover:shadow-md dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
