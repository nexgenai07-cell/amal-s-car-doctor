/**
 * Defines every top-level route in the application and maps each one
 * to its page component. The Services Hub is a single page at
 * /services; individual services are selected inside that page via a
 * sidebar rather than through separate routes.
 */
import { Routes, Route } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import Home from "../pages/Home";
import ServicesHub from "../pages/ServicesHub";
import Gallery from "../pages/Gallery";
import AboutUs from "../pages/AboutUs";
import Contact from "../pages/Contact";
import NotFoundPage from "../pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.SERVICES} element={<ServicesHub />} />
      <Route path={ROUTES.GALLERY} element={<Gallery />} />
      <Route path={ROUTES.ABOUT} element={<AboutUs />} />
      <Route path={ROUTES.CONTACT} element={<Contact />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
