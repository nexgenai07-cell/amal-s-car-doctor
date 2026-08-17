/**
 * ================================================================
 * NotFoundPage.jsx
 * ================================================================
 * The 404 page, shown for any URL that doesn't match a real route.
 * Now that all real pages exist, this replaces the temporary
 * PagePlaceholder that was used during development.
 * ================================================================
 */
import Button from "../components/ui/Button";
import { ROUTES } from "../constants/routes";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-5 text-center px-4">
      <span className="font-heading font-bold text-6xl text-primary">404</span>
      <h1 className="font-heading font-semibold text-xl">Page Not Found</h1>
      <p className="text-neutral text-sm max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button variant="primary" to={ROUTES.HOME}>
        Back to Home
      </Button>
    </div>
  );
}
