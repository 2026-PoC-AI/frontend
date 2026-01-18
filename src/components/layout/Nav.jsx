import { Link } from "react-router-dom";

export default function Nav() {
  const items = [
    { label: "IMAGE", path: "/image" },
    { label: "VIDEO", path: "/video" },
    { label: "AUDIO", path: "/audio" },
    { label: "TEXT", path: "/text" },
  ];

  return (
    <nav className="px-6 sm:px-10 lg:px-12 py-12">
      <div className="max-w-4xl mx-auto">
        <ul className="flex justify-center gap-20 text-sm tracking-[0.25em] text-primary/70">
          {items.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path}
                className="
                  relative transition-all duration-300
                  hover:text-primary hover:opacity-100
                  after:absolute after:left-1/2 after:-bottom-2 after:h-[1.5px]
                  after:w-0 after:bg-primary after:rounded-full
                  after:transition-all after:duration-300
                  after:-translate-x-1/2 hover:after:w-full
                "
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
