import { apiClient } from './axiosInstance';
import type {
  DocumentIdRequest,
  JobIdResponse,
  UploadFilesResponse,
  UpdateLastAccessResponse,
  JobStatusResponse,
  VerificationReportResponse,
  DocumentHistoryResponse,
  NotificationResponse,
} from '../types/api-types';

export const documentService = {
  /**
   * Загрузка XML-документов (multipart/form-data)
   * Swagger указывает "in: query", но для файлов это технически невозможно.
   * Реализовано через FormData — стандартный способ.
   */
  uploadFiles: async (files: File[]): Promise<UploadFilesResponse> => {
    const formData = new FormData();
    files.forEach(file => formData.append('file', file));

    const response = await apiClient.post<UploadFilesResponse>('/v1/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /** Запуск проверки документов по их ID */
  startCheck: async (documentIds: string[]): Promise<JobIdResponse> => {
    const payload: DocumentIdRequest = { document_ids: documentIds };
    const response = await apiClient.post<JobIdResponse>('/v1/jobs', payload);
    return response.data;
  },

  /** Получение статуса задачи (или массива задач) */
  getJobStatus: async (jobId: string): Promise<JobStatusResponse> => {
    const response = await apiClient.get<JobStatusResponse>(`/v1/jobs/${jobId}`);
    return response.data;
  },

  /** Обновление времени доступа к документу */
  updateLastAccess: async (documentId: string): Promise<UpdateLastAccessResponse> => {
    const response = await apiClient.patch<UpdateLastAccessResponse>(
      `/v1/documents/${documentId}/access`
    );
    return response.data;
  },

  /** Получение верификационного отчёта */
  getVerificationReport: async (documentId: string): Promise<VerificationReportResponse> => {
    const response = await apiClient.get<VerificationReportResponse>(
      `/v1/documents/${documentId}/report`
    );
    return response.data;
  },

  /** Получение HTML-превью документа */
  getDocumentPreview: async (documentId: string): Promise<string> => {
    const response = await apiClient.get(`/v1/documents/${documentId}/preview`, {
      responseType: 'text',
    });
    return response.data;
  },

  /** Получение истории документов (с пагинацией) */
  getDocumentHistory: async (page = 1, limit = 20): Promise<DocumentHistoryResponse> => {
    const response = await apiClient.get<DocumentHistoryResponse>('/v1/documents/history', {
      params: { page, limit },
    });
    return response.data;
  },

  /** Получение уведомлений пользователя */
  getNotifications: async (): Promise<NotificationResponse> => {
    const response = await apiClient.get<NotificationResponse>('/v1/notifications');
    return response.data;
  },

//   /** Получение профиля текущего пользователя */
//   getProfile: async (): Promise<UserProfileRespon> => {
//     const response = await apiClient.get<UserProfileResponse>('/v1/users/me');
//     return response.data;
//   },
};