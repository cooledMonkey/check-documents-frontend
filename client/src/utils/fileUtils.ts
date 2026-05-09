import type { FileMetadata } from "../store/fileSlice";

export const extractFileMetadata = (file: File): FileMetadata => ({
  id: `${file.name}-${file.size}-${file.lastModified}`, 
  name: file.name,
  size: file.size,
  type: file.type,
  lastModified: file.lastModified,
});

export const generateFileId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};