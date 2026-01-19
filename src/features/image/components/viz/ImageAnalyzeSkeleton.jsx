export default function ImageAnalyzeSkeleton() {
  return (
    <div className="rounded-[28px] bg-white/45 backdrop-blur-xl p-12 animate-pulse">
      <div className="h-6 w-40 bg-white/40 rounded mb-8" />

      <div className="flex gap-8">
        <div className="w-44 h-44 rounded-full bg-white/30" />
        <div className="flex-1 space-y-4">
          <div className="h-5 w-1/2 bg-white/30 rounded" />
          <div className="h-4 w-1/3 bg-white/30 rounded" />
          <div className="h-4 w-2/3 bg-white/30 rounded" />
        </div>
      </div>

      <div className="mt-10 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-4 bg-white/30 rounded" />
        ))}
      </div>
    </div>
  );
}
