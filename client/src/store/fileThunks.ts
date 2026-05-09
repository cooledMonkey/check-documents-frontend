import { createAsyncThunk } from '@reduxjs/toolkit';
import { documentService } from '../api/document-service';
import { fileRegistry } from '../utils/fileRegistry';
import type { UploadedDocument, FileMetadata } from './fileSlice';
import type { TaskResponse, JobIdResponse } from '../types/api-types';

export const startFilesCheck = createAsyncThunk<
  { jobIds: string[]; documents: UploadedDocument[] }, 
  void,
  { rejectValue: string } 
>(
  'files/startCheck',
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState() as any; 
      const selectedFiles: FileMetadata[] = state.files.selectedFiles;

      if (selectedFiles.length === 0) {
        return rejectWithValue('Нет файлов для проверки');
      }

      const filesToUpload = fileRegistry.getAll(selectedFiles.map(f => f.id));
      
      if (filesToUpload.length !== selectedFiles.length) {
        return rejectWithValue('Часть файлов не найдена. Выберите файлы заново.');
      }

      const uploadResponse = await documentService.uploadFiles(filesToUpload);

      const documents: UploadedDocument[] = uploadResponse.documents.map((doc: TaskResponse) => ({
        id: doc.id,
        originalName: doc.originalName,
        status: 'pending',
      }));

      const jobResponse: JobIdResponse = await documentService.startCheck(
        documents.map(d => d.id)
      );

      return { jobIds: jobResponse.job_ids, documents };

    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка при запуске проверки');
    }
  }
);