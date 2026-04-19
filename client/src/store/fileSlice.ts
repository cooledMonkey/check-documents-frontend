import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { VerificationReportResponse } from '../types/api-types';

export interface FileMetadata {
  id: string;              // Уникальный ID (генерируем сами)
  name: string;            // Имя файла
  size: number;            // Размер в байтах
  type: string;            // MIME-тип
  lastModified: number;    // Timestamp
}
export interface FileWithMeta extends FileMetadata {
  file: File;              // Сам объект File (только в памяти компонента)
}
export interface UploadedDocument {
  id: string;           // UUID от сервера
  originalName: string; // Имя файла
  status: 'pending' | 'processing' | 'completed' | 'failed';
  report?: VerificationReportResponse; // Результат проверки
  error?: string;
}

interface FilesState {
  selectedFiles: FileMetadata[];              // Файлы, выбранные пользователем
  uploadedDocuments: UploadedDocument[]; // Загруженные на сервер документы
  currentJobId: string | null;        // ID текущей задачи проверки
  isChecking: boolean;                // Идёт ли проверка
  checkError: string | null;          // Ошибка при проверке
  uploadProgress: Record<string, number>; // для отслеживания прогресса загрузки
  uploadStatus: Record<string, 'idle' | 'uploading' | 'success' | 'error'>;
}

const initialState: FilesState = {
  selectedFiles: [],
  uploadedDocuments: [],
  currentJobId: null,
  isChecking: false,
  checkError: null,
  uploadProgress: {},
  uploadStatus: {},
};

import { startFilesCheck } from './fileThunks';

const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
        addFiles: (state, action: PayloadAction<FileMetadata[]>) => {
      state.selectedFiles.push(...action.payload);
    },
    setSelectedFiles: (state, action: PayloadAction<FileMetadata[]>) => {
      state.selectedFiles = action.payload;
    },
    clearSelectedFiles: (state) => {
      state.selectedFiles = [];
    },
    clearFiles: (state) => {
      state.selectedFiles = [];
      state.uploadProgress = {};
      state.uploadStatus = {};
    },
    setUploadProgress: (state, action: PayloadAction<{ fileName: string; progress: number }>) => {
      state.uploadProgress[action.payload.fileName] = action.payload.progress;
    },
    setUploadStatus: (state, action: PayloadAction<{ fileName: string; status: 'idle' | 'uploading' | 'success' | 'error' }>) => {
      state.uploadStatus[action.payload.fileName] = action.payload.status;
    },
    // 👇 Новые экшены для проверки
    setUploadedDocuments: (state, action: PayloadAction<UploadedDocument[]>) => {
      state.uploadedDocuments = action.payload;
    },
    updateDocumentStatus: (state, action: PayloadAction<{ 
      documentId: string; 
      status: UploadedDocument['status'];
      report?: VerificationReportResponse;
      error?: string;
    }>) => {
      const doc = state.uploadedDocuments.find(d => d.id === action.payload.documentId);
      if (doc) {
        doc.status = action.payload.status;
        if (action.payload.report) doc.report = action.payload.report;
        if (action.payload.error) doc.error = action.payload.error;
      }
    },
    setCurrentJobId: (state, action: PayloadAction<string | null>) => {
      state.currentJobId = action.payload;
    },
    setIsChecking: (state, action: PayloadAction<boolean>) => {
      state.isChecking = action.payload;
    },
    setCheckError: (state, action: PayloadAction<string | null>) => {
      state.checkError = action.payload;
    },
    resetCheckState: (state) => {
      state.uploadedDocuments = [];
      state.currentJobId = null;
      state.isChecking = false;
      state.checkError = null;
    },
  },
  extraReducers: (builder) => {
  builder
    .addCase(startFilesCheck.pending, (state) => {
      state.isChecking = true;
      state.checkError = null;
    })
    .addCase(startFilesCheck.fulfilled, (state, action) => {
      // 👇 ОСТАВЛЯЕМ true! Хук сам выключит флаг после загрузки отчётов
      state.isChecking = true; 
      state.uploadedDocuments = action.payload.documents;
      state.currentJobId = action.payload.jobIds[0] || null;
    })
    .addCase(startFilesCheck.rejected, (state, action) => {
      state.isChecking = false;
      state.checkError = action.payload || 'Ошибка запуска проверки';
    });
}
});

export const {
  addFiles,
  setSelectedFiles,
  clearSelectedFiles,
  setUploadedDocuments,
  clearFiles,
  updateDocumentStatus,
  setCurrentJobId,
  setIsChecking,
  setCheckError,
  resetCheckState,
} = fileSlice.actions;

export default fileSlice.reducer;