import { Link } from "react-router-dom";

export default function Nav() {
  const items = [
    { label: "IMAGE", path: "/image" },
    { label: "VIDEO", path: "/video" },
    { label: "AUDIO", path: "/audio" },
    { label: "TEXT", path: "/text" },
  ];

  return (
    <nav className="px-6 sm:px-10 lg:px-12 py-6 shrink-0">
      <div className="max-w-4xl mx-auto">
        <ul className="flex justify-center gap-16 text-sm tracking-[0.25em] text-primary/70">
          {items.map((item) => (
            <li key={item.label}>
              <Link to={item.path} className="...">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
