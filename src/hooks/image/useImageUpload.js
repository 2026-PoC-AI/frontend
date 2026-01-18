import { useRef } from "react";
import { useImageStore } from "../../store/image/imageStore.js";

export default function useImageUpload() {
  const inputRef = useRef(null);
  const { setFile, clearFile } = useImageStore();

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleFile = (file) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setFile(file, previewUrl);
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const reset = () => {
    clearFile();
    if (inputRef.current) inputRef.current.value = "";
  };

  return {
    inputRef,
    openFilePicker,
    onFileChange,
    onDrop,
    onDragOver,
    reset,
  };
}
