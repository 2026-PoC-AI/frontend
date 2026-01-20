/* eslint-disable */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logoImg from "../../assets/FH_LOGO_ARROW.png";

export default function Nav() {
  const leftItems = [
    { label: "IMAGE", path: "/image" },
    { label: "VIDEO", path: "/video" },
  ];

  const rightItems = [
    { label: "AUDIO", path: "/audio" },
    { label: "TEXT", path: "/text" },
  ];

  return (
    <nav className="px-6 sm:px-10 lg:px-12 py-6 shrink-0">
      <div className="max-w-4xl mx-auto">
        <ul className="flex justify-center items-center gap-16 text-sm tracking-[0.25em] text-primary/70">
          {/* 왼쪽 메뉴 */}
          {leftItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path}
                className="hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* 중앙 로고 */}
          <li>
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center"
              >
                <img
                  src={logoImg}
                  alt="Logo"
                  className="h-10 w-auto object-contain"
                />
              </motion.div>
            </Link>
          </li>

          {/* 오른쪽 메뉴 */}
          {rightItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path}
                className="hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
