/**
 * ================================================================
 * ScrollToTop.jsx
 * ================================================================
 * React Router does not reset scroll position between page
 * navigations on its own — by default, a new page inherits whatever
 * scroll position the previous page was left at. Without this fix,
 * clicking from a link near the bottom of one page to another page
 * would open that new page already scrolled halfway down, instead
 * of starting at the top like a normal website.
 *
 * This component renders nothing visible. It just watches the
 * current URL path via `useLocation`, and every time that path
 * changes (i.e. every time the user navigates to a different page),
 * it scrolls the window back to the very top.
 *
 * Usage: rendered once, near the top of App.jsx, inside
 * <BrowserRouter> (see main.jsx) so `useLocation` has router context
 * to read from.
 * ================================================================
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
