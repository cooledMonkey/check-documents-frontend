// store/filesSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FileState {
  selectedFiles: File[];
  uploadProgress: Record<string, number>; // для отслеживания прогресса загрузки
  uploadStatus: Record<string, 'idle' | 'uploading' | 'success' | 'error'>;
}

const initialState: FileState = {
  selectedFiles: [],
  uploadProgress: {},
  uploadStatus: {},
};

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setSelectedFiles: (state, action: PayloadAction<File[]>) => {
      state.selectedFiles = action.payload;
    },
    addFiles: (state, action: PayloadAction<File[]>) => {
      state.selectedFiles = [...state.selectedFiles, ...action.payload];
    },
    removeFile: (state, action: PayloadAction<number>) => {
      const fileToRemove = state.selectedFiles[action.payload];
      if (fileToRemove) {
        delete state.uploadProgress[fileToRemove.name];
        delete state.uploadStatus[fileToRemove.name];
      }
      state.selectedFiles = state.selectedFiles.filter((_, index) => index !== action.payload);
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
  },
});

export const {
  setSelectedFiles,
  addFiles,
  removeFile,
  clearFiles,
  setUploadProgress,
  setUploadStatus,
} = filesSlice.actions;

export default filesSlice.reducer;