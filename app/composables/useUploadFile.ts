export interface ImagePreview {
  file: File;
  url: string;
}

export const useUploadFile = () => {
  const previews = ref<ImagePreview[]>([]);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  const clearPreviews = () => {
    previews.value.forEach((p) => {
      URL.revokeObjectURL(p.url);
    });
    previews.value = [];
  };

  const removeImage = (
    index: number,
    callback: (index: number, image: File[]) => void,
  ) => {
    const preview = previews.value[index];
    if (!preview) return;

    URL.revokeObjectURL(preview.url);
    previews.value.splice(index, 1);
    callback(
      index,
      previews.value.map((p) => p.file),
    );
  };

  const handleFileChange = (e: Event, callback: () => void) => {
    const input = e.target as HTMLInputElement;
    if (!input.files) return;
    const files = Array.from(input.files);
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    const newPreviews: ImagePreview[] = [];
    for (const file of files) {
      if (file.size > MAX_SIZE) {
        // toast.error(`La imagen "${file.name}" supera el límite de 5MB`);
      } else {
        newPreviews.push({
          file,
          url: URL.createObjectURL(file),
        });
      }
    }

    if (newPreviews.length > 0) {
      previews.value = [...previews.value, ...newPreviews];
      callback();
    }

    // Reset input to allow selecting same files again if needed
    input.value = "";
  };

  return {
    previews,
    formatSize,
    clearPreviews,
    removeImage,
    handleFileChange,
  };
};
