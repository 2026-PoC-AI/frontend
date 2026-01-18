import { Outlet, useLocation } from "react-router-dom";
import Nav from "./Nav";

export default function AppLayout() {
  const location = useLocation();

  const isMainPage = location.pathname === "/";

  return (
    <div
      className="w-full min-h-screen overflow-x-hidden bg-paper"
      style={{
        background: `
          radial-gradient(
            ellipse 80% 70% at 50% 40%,
            var(--color-paper) 0%,
            rgba(255,255,255,0.95) 25%,
            color-mix(in srgb, var(--color-primary-soft) 30%, transparent) 50%,
            color-mix(in srgb, var(--color-primary-sky) 40%, transparent) 75%,
            color-mix(in srgb, var(--color-primary-mint) 45%, transparent) 100%
          )
        `,
      }}
    >
      {!isMainPage && <Nav />}
      <Outlet />
    </div>
  );
}
