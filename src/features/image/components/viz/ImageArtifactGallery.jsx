import { useImageStore } from "../../../../store/image/imageStore";
import ImageArtifactTabs from "./ImageArtifactTabs";

export default function ImageArtifactGallery() {
  const result = useImageStore((s) => s.result);
  const hasArtifacts =
    Array.isArray(result?.artifacts) && result.artifacts.length > 0;

  if (!hasArtifacts) return null;

  return <ImageArtifactTabs />;
}
