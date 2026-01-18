import ImageUploadCard from "../../features/image/ImageUploadCard";
import ImageResultPanel from "../../features/image/ImageResultPanel";

export default function ImagePage() {
  return (
    <main className="px-6 sm:px-10 lg:px-12 pt-20 pb-32 max-w-6xl mx-auto">
      <header className="text-center mb-20">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-text-main mb-6">
          Image Analysis
        </h1>
        <p className="text-text-sub leading-relaxed">
          이미지가 AI로 생성되었거나 조작되었는지 분석합니다.
        </p>
      </header>

      <section
        className="
          grid
          grid-cols-1
          lg:grid-cols-[1fr_2fr]
          gap-10
          items-start
        "
      >
        <ImageUploadCard />
        <ImageResultPanel />
      </section>
    </main>
  );
}
