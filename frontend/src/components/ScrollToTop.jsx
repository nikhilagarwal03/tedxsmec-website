import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instantly scrolls to the top of the page (0, 0)
    // whenever the path changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}