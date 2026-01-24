import { forwardRef } from "react";

const AudioPlayer = forwardRef(({ src }, ref) => {
  return (
    <div className="rounded-xl bg-white/60 border p-4">
      <audio ref={ref} src={src} controls className="w-full" />
    </div>
  );
});

export default AudioPlayer;
