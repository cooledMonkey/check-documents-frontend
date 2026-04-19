import type { JSX } from "react";
import { useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
  addFiles,
  setSelectedFiles,
  clearFiles,
  type FileMetadata
} from "../../store/fileSlice";
import { fileRegistry } from "../../utils/fileRegistry";
import type { RootState } from "../../store";

interface UploadFilesComponentProps {
  maxFiles?: number;
  accept?: string;
  maxSize?: number;
  mode?: 'replace' | 'append';
}

function UploadFilesComponent({
  maxFiles = 5,
  accept = ".xml",
  maxSize = 10 * 1024 * 1024,
  mode = 'append'
}: UploadFilesComponentProps): JSX.Element {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const selectedFilesMeta = useSelector((state: RootState) => state.files.selectedFiles) as FileMetadata[];
  const isChecking = useSelector((state: RootState) => state.files.isChecking);

  const generateFileId = (file: File): string => {
    return `${file.name}-${file.size}-${file.lastModified}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  };

  const extractMetadata = (file: File, id: string): FileMetadata => ({
    id,
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  });

  const validateFiles = (filesToValidate: File[]): File[] => {
    setError(null);
    if (filesToValidate.length > maxFiles) {
      setError(`Максимальное количество файлов: ${maxFiles}`);
      return [];
    }
    const oversizedFiles = filesToValidate.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError(`Некоторые файлы превышают максимальный размер (${maxSize / 1024 / 1024}MB)`);
      return [];
    }
    if (accept !== "*") {
      const acceptedExtensions = accept.split(',').map(ext => ext.trim().toLowerCase());
      const invalidFiles = filesToValidate.filter(file => {
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        return !acceptedExtensions.some(ext => {
          if (ext === fileExtension) return true;
          if (ext.includes('/*')) {
            const mainType = ext.split('/')[0];
            return file.type.startsWith(mainType);
          }
          return ext === file.type;
        });
      });
      if (invalidFiles.length > 0) {
        setError(`Неподдерживаемый тип файлов. Принимаются: ${accept}`);
        return [];
      }
    }
    return filesToValidate;
  };

  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const filesArray = Array.from(newFiles);
    const validFiles = validateFiles(filesArray);

    if (validFiles.length > 0) {
      const processed = validFiles.map(file => {
        const id = generateFileId(file);
        return { file, meta: extractMetadata(file, id) };
      });

      // Регистрируем файлы в глобальном реестре
      processed.forEach(({ file, meta }) => {
        fileRegistry.register(meta.id, file);
      });

      const metadataList = processed.map(p => p.meta);

      if (mode === 'replace') {
        // При замене очищаем старые из реестра
        selectedFilesMeta.forEach(meta => fileRegistry.unregister(meta.id));
        dispatch(setSelectedFiles(metadataList));
      } else {
        dispatch(addFiles(metadataList));
      }
    }
  }, [dispatch, maxFiles, accept, maxSize, mode, selectedFilesMeta]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
  }, []);
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation();
  }, []);
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleButtonClick = useCallback(() => fileInputRef.current?.click(), []);
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (e.target.value) e.target.value = '';
  }, [handleFiles]);

  return (
    <div className="file-upload-container">
      <div
        className={`upload-area-bg ${isDragging ? 'dragging' : ''} ${isChecking ? 'disabled' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <svg className="file-icon" width="56" height="59" viewBox="0 0 56 59" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.67123 0.0670985C8.02729 0.0243248 8.38963 0 8.75749 0H41.2606L41.7108 0.01094C46.3324 0.238231 50.0173 3.94429 50.0173 8.49525V29.2433H46.9488V8.49525C46.9488 5.55414 44.5646 3.14237 41.5535 2.99464L41.2606 2.98734H3.06849V50.5047C3.0685 53.5406 5.60897 56.0125 8.75674 56.0127H24.7367V59H8.75674C3.92672 58.9999 1.04592e-05 55.2025 0 50.5047V0H7.67123V0.0670985Z" fill="#8480B5"></path>
          <path d="M45.7854 44.91H56V47.8974H45.7854V57.7988H42.7169V47.8974H32.5024V44.91H42.7169V35.0079H45.7854V44.91Z" fill="#8480B5"></path>
          <path d="M26.5437 37.9953H12.6411V35.0079H26.5437V37.9953Z" fill="#8480B5"></path>
          <path d="M37.3778 27.4929H12.6411V24.5055H37.3778V27.4929Z" fill="#8480B5"></path>
          <path d="M37.3778 16.9905H12.6411V14.0032H37.3778V16.9905Z" fill="#8480B5"></path>
        </svg>

        <div className="file-select-btn" onClick={handleButtonClick}>
          <div className="btn-bg">Выбрать файлы</div>
        </div>

        <p className="drag-drop-text">или перетащите файлы сюда</p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          disabled={isChecking}
        />
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

export { UploadFilesComponent };