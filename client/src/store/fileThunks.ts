// src/store/fileThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { documentService } from '../api/document-service';
import { fileRegistry } from '../utils/fileRegistry';
import type { UploadedDocument, FileMetadata } from './fileSlice';
import type { TaskResponse, JobIdResponse } from '../types/api-types';

// 👇 Асинхронный экшен для запуска проверки
export const startFilesCheck = createAsyncThunk<
  { jobIds: string[]; documents: UploadedDocument[] }, // возвращаемое значение
  void, // входные параметры (не нужны)
  { rejectValue: string } // тип ошибки
>(
  'files/startCheck',
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState() as any; // 👇 Приведите к вашему RootState
      const selectedFiles: FileMetadata[] = state.files.selectedFiles;

      if (selectedFiles.length === 0) {
        return rejectWithValue('Нет файлов для проверки');
      }

      // 1️⃣ Достаём реальные файлы из реестра
      const filesToUpload = fileRegistry.getAll(selectedFiles.map(f => f.id));
      
      if (filesToUpload.length !== selectedFiles.length) {
        return rejectWithValue('Часть файлов не найдена. Выберите файлы заново.');
      }

      // 2️⃣ Загружаем файлы на сервер
      const uploadResponse = await documentService.uploadFiles(filesToUpload);

      // 3️⃣ Формируем список документов для стейта
      const documents: UploadedDocument[] = uploadResponse.documents.map((doc: TaskResponse) => ({
        id: doc.id,
        originalName: doc.originalName,
        status: 'pending',
      }));

      // 4️⃣ Запускаем задачу проверки
      const jobResponse: JobIdResponse = await documentService.startCheck(
        documents.map(d => d.id)
      );

      return { jobIds: jobResponse.job_ids, documents };

    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка при запуске проверки');
    }
  }
);