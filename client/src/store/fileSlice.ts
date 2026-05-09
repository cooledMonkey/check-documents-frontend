import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { VerificationReportResponse } from '../types/api-types';

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
}
export interface FileWithMeta extends FileMetadata {
  file: File;
}
export interface UploadedDocument {
  id: string;  
  originalName: string; 
  status: 'pending' | 'processing' | 'completed' | 'failed';
  report?: VerificationReportResponse; 
  error?: string;
}

interface FilesState {
  selectedFiles: FileMetadata[];            
  uploadedDocuments: UploadedDocument[]; 
  currentJobId: string | null;      
  isChecking: boolean;                
  checkError: string | null;          
  uploadProgress: Record<string, number>;
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