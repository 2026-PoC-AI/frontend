import { Outlet, useLocation } from "react-router-dom";
import Nav from "./Nav";

export default function AppLayout() {
  const location = useLocation();
  const isMainPage = location.pathname === "/";

  return (
    <div
      className="w-full h-screen overflow-hidden bg-paper flex flex-col" // h-screen과 overflow-hidden 추가
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

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <Outlet />
      </div>
    </div>
  );
}
