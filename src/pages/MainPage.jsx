import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredDomain, setHoveredDomain] = useState(null);

  const goDomain = (domain) => {
    navigate(`/${domain}`);
  };

  const cards = [
    {
      key: "video",
      title: "Video 분석",
      desc: "비디오 기능 최종 구현 후 설명 넣어주세요",
      accent: "from-[#4BC6E9] to-[#9CEFE2]",
    },
    {
      key: "image",
      title: "Image 분석",
      desc: "이미지 기능 최종 구현 후 설명 넣어주세요",
      accent: "from-[#357CEA] to-[#4BC6E9]",
    },
    {
      key: "audio",
      title: "Audio 분석",
      desc: "음성 기능 최종 구현 후 설명 넣어주세요",
      accent: "from-[#33C3AD] to-[#4BC6E9]",
    },
    {
      key: "text",
      title: "Text 분석",
      desc: "텍스트 기능 최종 구현 후 설명 넣어주세요",
      accent: "from-[#357CEA] to-[#9CEFE2]",
    },
  ];

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="w-full overflow-x-hidden bg-paper"
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
      {/* ================= Navigation ================= */}
      <nav className="px-6 sm:px-10 lg:px-12 py-8 flex justify-between items-center max-w-6xl mx-auto">
        <div className="text-base sm:text-lg tracking-wider text-primary/70 font-bold">
          FAKE HUNTERS
        </div>

        <div className="hidden sm:flex gap-8 text-sm tracking-wider text-primary">
          {[
            { label: "Image", path: "/image" },
            { label: "Video", path: "/video" },
            { label: "Audio", path: "/audio" },
            { label: "Text", path: "/text" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="
                relative opacity-70 transition-all duration-300
                hover:opacity-100 hover:text-primary
                after:absolute after:left-1/2 after:-bottom-2 after:h-[1.5px]
                after:w-0 after:bg-primary after:rounded-full
                after:transition-all after:duration-300
                after:-translate-x-1/2 hover:after:w-full
              "
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* ================= Hero ================= */}
      <main className="px-6 sm:px-10 lg:px-12 pt-20 pb-20 max-w-6xl mx-auto">
        <div className="flex justify-center mb-20">
          <h1
            ref={heroRef}
            className="
              hero-title
              text-[4rem]
              sm:text-[6rem]
              md:text-[8rem]
              lg:text-[12rem]
              leading-[0.9]
              text-transparent
              select-none
            "
            aria-label="FAKE HUNTERS"
          >
            {"FAKE HUNTERS".split("").map((char, index) => {
              if (char === " ") return <br key={`br-${index}`} />;

              return (
                <span
                  key={index}
                  className={`hero-letter ${isScrolled ? "is-filled" : ""}`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {char}
                </span>
              );
            })}
          </h1>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <div className="text-body-md tracking-[0.2em] mb-6 text-primary/60">
            어떤 말을 적어야할까요
          </div>

          <div className="space-y-6 sm:space-y-8">
            <p className="text-sm leading-relaxed text-text-main/80">
              열심히 하고 메인 글을 나중에 적어보아요 우리
              <br />
              파이팅파이팅!
              <br />
              메인 이 글 작성은 제일 나중에!
            </p>

            <p className="text-sm leading-relaxed text-text-main/80">
              파이썬 매우 이지.
              <br />
              우린 모두 해낼 수 있어요
              <br />
              (메인 디자인 바꾸실거면 바꾸셔도 돼요!)
              <br />
              헌터 X 걸즈
              <br />
              소희 / 소영 / 하영 / 희정
            </p>
          </div>
        </div>
      </main>

      {/* ================= Domain Cards ================= */}
      <section className="px-4 sm:px-10 lg:px-12 pt-10 py-30 max-w-screen-2xl mx-auto ">
        <div
          className="
            flex sm:grid
            sm:grid-cols-2 lg:grid-cols-4
            gap-6 sm:gap-8 lg:gap-12

            overflow-x-auto
            overflow-hidden
            sm:overflow-hidden
            snap-x snap-mandatory
            scroll-smooth
            pb-10

            transparent-scrollbar
        "
        >
          {cards.map((card, index) => (
            <FadeUpCard
              key={card.key}
              index={index}
              card={card}
              hoveredDomain={hoveredDomain}
              setHoveredDomain={setHoveredDomain}
              goDomain={goDomain}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

/* ================= FadeUp Card ================= */

function FadeUpCard({
  card,
  index,
  hoveredDomain,
  setHoveredDomain,
  goDomain,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("opacity-100", "translate-y-0");
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={() => goDomain(card.key)}
      onMouseEnter={() => setHoveredDomain(card.key)}
      onMouseLeave={() => setHoveredDomain(null)}
      className="
            snap-center
            min-w-[85%] sm:min-w-0

            cursor-pointer
            rounded-[22px]
            px-8 sm:px-10 lg:px-12
            py-16
            flex flex-col

            backdrop-blur-xl
            bg-white/55
            border border-white/50

            transition-all duration-2000 ease-out
            opacity-0 translate-y-8
      "
      style={{
        transitionDelay: `${index * 120}ms`,
        transform: hoveredDomain === card.key ? "translateY(-6px)" : undefined,
      }}
    >
      <div className="flex justify-end mb-6">
        <div
          className={`h-1.5 w-16 rounded-full bg-linear-to-r ${card.accent}`}
        />
      </div>

      <h3 className="text-lg font-semibold text-text-main text-right mb-6">
        {card.title}
      </h3>

      <p className="text-sm text-text-main/60 leading-relaxed mb-10">
        {card.desc}
      </p>

      <div className="mt-auto flex justify-end">
        <button
          className="
            group flex items-center gap-2
            text-body-md font-medium
            tracking-wide text-primary
            transition-all duration-300
          "
        >
          <span
            className="
              w-2 h-2 rounded-full bg-primary-sky
              opacity-0 -translate-x-1
              transition-all duration-300
              group-hover:opacity-100 group-hover:translate-x-0
            "
          />
          <span>분석하러 GO</span>
        </button>
      </div>
    </div>
  );
}
