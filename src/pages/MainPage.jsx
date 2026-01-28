import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Audio from "../assets/FH_AUDIO.png";
import Image from "../assets/FH_IMAGE.png";
import Text from "../assets/FH_TEXT.png";
import Video from "../assets/FH_VIDEO.png";

/* ================= FadeUp Hook ================= */
function useFadeUp(delay = 0) {
  const ref = useRef(null);
  const prevTop = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const currentTop = entry.boundingClientRect.top;
        const scrollingDown = currentTop < prevTop.current;

        prevTop.current = currentTop;

        // 화면 안 + 아래로 이동 → 보여줌
        if (entry.isIntersecting && scrollingDown) {
          el.classList.add("opacity-100", "translate-y-0");
          el.classList.remove("opacity-0", "translate-y-40");
        }

        // 화면 벗어나거나 위로 → 숨김
        if (!scrollingDown) {
          el.classList.add("opacity-0", "translate-y-40");
          el.classList.remove("opacity-100", "translate-y-0");
        }
      },
      {
        threshold: 0.3,
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [delay]);

  return ref;
}

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
      desc: "영상 내 딥페이크 흔적 자동 분석",
      accentImg: Video,
    },
    {
      key: "image",
      title: "Image 분석",
      desc: "이미지 위·변조 여부와 합성 흔적 탐지",
      accentImg: Image,
    },
    {
      key: "audio",
      title: "Audio 분석",
      desc: "음성 변조·합성 여부 AI 기반 판별",
      accentImg: Audio,
    },
    {
      key: "text",
      title: "Text 분석",
      desc: "뉴스 정보 조작 가능성 분석",
      accentImg: Text,
    },
  ];

  /* Fade Animations */
  const introAnim = useFadeUp(0);
  const valueAnim = useFadeUp(100);
  const whyAnim = useFadeUp(200);
  const missionAnim = useFadeUp(300);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      {
        threshold: 0.6,
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
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
      <nav className="px-6 sm:px-10 lg:px-12 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center">
            <ul className="flex gap-20 text-sm tracking-[0.25em] text-primary/70">
              {[
                { label: "IMAGE", path: "/image" },
                { label: "VIDEO", path: "/video" },
                { label: "AUDIO", path: "/audio" },
                { label: "TEXT", path: "/text" },
              ].map((item) => (
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
        </div>
      </nav>

      {/* ================= Hero ================= */}
      <main className="px-6 sm:px-10 lg:px-12 pt-20 pb-20 max-w-6xl mx-auto">
        <div className="flex justify-center mb-40">
          <h1
            ref={heroRef}
            className="hero-title text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[12.5rem] leading-[0.9] select-none"
          >
            {"FAKE HUNTERS".split("").map((char, i) =>
              char === " " ? (
                <br key={i} />
              ) : (
                <span
                  key={i}
                  className={`hero-letter ${isScrolled ? "is-filled" : ""}`}
                  style={{ animationDelay: `${i * 200}ms` }}
                >
                  {char}
                </span>
              ),
            )}
          </h1>
        </div>

        {/* ================= Intro Section ================= */}
        <section
          ref={introAnim}
          className="
          max-w-5xl mx-auto text-center relative
          opacity-0 translate-y-10
          transition-all duration-1000 ease-out
        "
        >
          {/* Background Aura */}
          <div
            className="
            absolute -top-40 left-1/2 -translate-x-1/2
            w-[900px] h-[900px]
            bg-gradient-to-r
            from-primary-sky/25
            via-primary-mint/15
            to-primary-soft/25
            blur-[220px]
            rounded-full
            -z-10
          "
          />

          {/* Headline */}
          {/* <h2
            className="
            text-4xl sm:text-5xl md:text-6xl
            font-bold
            text-primary-deep/30
            tracking-tight
            mb-12
          "
          >
            AI 시대 , 신뢰를 설계하다
          </h2> */}

          {/* Sub */}
          <p
            className="
            text-xl sm:text-2xl
            text-primary/55
            leading-relaxed
            max-w-2xl
            mx-auto
          "
          >
            Fake Hunters는 인공지능 기술을 통해
            <br />
            디지털 콘텐츠의 진위를 증명합니다.
          </p>
        </section>

        {/* ================= Value Proposition ================= */}
        <section
          ref={valueAnim}
          className="
          max-w-6xl mx-auto px-6 mt-40
          opacity-0 translate-y-10
          transition-all duration-1000 ease-out
        "
        >
          <div className="grid md:grid-cols-2 gap-y-16 gap-x-24">
            {[
              {
                title: "멀티모달 AI 분석",
                desc: "이미지, 영상, 음성, 텍스트 데이터를 통합적으로 분석.",
              },
              {
                title: "딥페이크 패턴 분석",
                desc: "딥러닝 기반 모델을 통해 위·변조 패턴을 정밀 분석.",
              },
              {
                title: "자동 분석 리포트",
                desc: "분석 결과를 시각화된 형태로 자동 정리하여 제공.",
              },
              {
                title: "확장 가능한 시스템 구조",
                desc: "모듈형 아키텍처 기반으로 기능 확장이 용이한 구조.",
              },
            ].map((item, i) => (
              <div key={i} className="relative pl-6">
                {/* Vertical Line */}
                <div
                  className="
                  absolute left-0 top-1
                  w-[2px] h-full
                  bg-primary-dark/40
                "
                />

                <h3 className="text-lg font-semibold text-primary-deep/65 mb-3">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= Why Fake Hunters ================= */}
        <section
          ref={whyAnim}
          className="
          max-w-6xl mx-auto px-6 mt-44
          opacity-0 translate-y-10
          transition-all duration-1000 ease-out
        "
        >
          <div className="text-center mb-20">
            <p className="text-3xl font-extrabold tracking-[0.35em] text-primary/55 mb-4">
              WHY FAKE HUNTERS
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-x-20 gap-y-16">
            {[
              {
                title: "정확도 중심 설계",
                desc: "실제 딥페이크 데이터 기반 학습 모델 적용",
              },
              {
                title: "고성능 모델 파이프라인",
                desc: "딥러닝 기반 분석 모델을 최적화하여 효율적인 처리.",
              },
              {
                title: "설명 가능한 결과",
                desc: "분석 근거·신뢰도 시각화 제공",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div
                  className="
                    w-10 h-10
                    mx-auto mb-6
                    rounded-full
                    bg-primary/10
                    flex items-center justify-center
                    text-sm font-bold text-primary/70
                  "
                >
                  {i + 1}
                </div>

                <h4 className="font-semibold text-xl text-primary-dark/75 mb-4">
                  {item.title}
                </h4>

                <p className="text-md text-black/55 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ================= Domain Cards ================= */}
      <section className="px-4 sm:px-10 lg:px-12 py-30 max-w-screen-2xl mx-auto ">
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

      {/* ================= Mission & Team ================= */}
      <section
        ref={missionAnim}
        className="
        max-w-5xl mx-auto px-6 mb-44 text-center
        opacity-0 translate-y-10
        transition-all duration-1000 ease-out
      "
      >
        <p
          className="
          text-md
          text-primary-deep/50
          
          leading-relaxed
          max-w-xl
          mx-auto
          mb-30
        "
        >
          투명한 AI 기술로
          <br />
          허위 정보와 디지털 범죄를 예방하고 신뢰 가능한 온라인 환경을
          구축합시다
        </p>

        {/* Divider */}
        <div className="w-30 h-[1px] bg-primary-light/70 mx-auto mb-30" />

        <p className="text-md font-extrabold tracking-[0.35em] text-primary-dark/55 mb-6">
          FAKE HUNTERS TEAM
        </p>

        <div className="flex justify-center gap-10 text-sm text-primary/55">
          <span>@SOHEE</span>
          <span>@HEEJEONG</span>
          <span>@HAYOUNG</span>
          <span>@SOYOUNG</span>
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
      { threshold: 0.2 },
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
            group
            snap-center
            min-w-[85%] sm:min-w-0

            cursor-pointer
            rounded-[22px]
            px-8 sm:px-10 lg:px-12
            py-16
            flex flex-col

            backdrop-blur-xl
            bg-white/40
            border border-white/50

            shadow-[0_18px_45px_-16px_rgba(0,0,0,0.05)]
            hover:shadow-[0_28px_60px_-18px_rgba(0,0,0,0.08)]

            transition-all duration-2000 ease-out
            opacity-0 translate-y-8
      "
      style={{
        transitionDelay: `${index * 120}ms`,
        transform: hoveredDomain === card.key ? "translateY(-6px)" : undefined,
      }}
    >
      <div className="flex justify-end mb-6">
        <img
          src={card.accentImg}
          alt={`${card.title} icon`}
          className="
            w-12 h-12
            object-contain
            opacity-90
          "
        />
      </div>

      <h3 className="text-lg font-semibold text-text-main text-right mb-6">
        {card.title}
      </h3>

      <p className="text-sm text-text-main/60 leading-relaxed text-right mb-10">
        {card.desc}
      </p>

      <div className="mt-auto flex justify-end">
        <button
          className="
            group flex items-center gap-3
            text-body-md font-extrabold
            tracking-wide text-primary-deep/60
            transition-all duration-300
            
          "
        >
          <span
            className="
              w-2.5 h-2.5 rounded-full bg-primary-sky
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
