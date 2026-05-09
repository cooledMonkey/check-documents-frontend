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
  uploadFiles: async (files: File[]): Promise<UploadFilesResponse> => {
    const formData = new FormData();
    files.forEach(file => formData.append('file', file));

    const response = await apiClient.post<UploadFilesResponse>('/v1/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  startCheck: async (documentIds: string[]): Promise<JobIdResponse> => {
    const payload: DocumentIdRequest = { document_ids: documentIds };
    const response = await apiClient.post<JobIdResponse>('/v1/jobs', payload);
    return response.data;
  },

  getJobStatus: async (jobId: string): Promise<JobStatusResponse> => {
    const response = await apiClient.get<JobStatusResponse>(`/v1/jobs/${jobId}`);
    return response.data;
  },

  getVerificationReport: async (documentId: string): Promise<VerificationReportResponse> => {
    const response = await apiClient.get<VerificationReportResponse>(
      `/v1/documents/${documentId}/report`
    );
    return response.data;
  },


    getDocumentHistory: async (params: {
    page: number;
    limit: number;
    sortByDate?: 'date_asc' | 'date_desc';
    filterByStatus?: 'pending' | 'Изменения не вносились' | 'Изменения внесены' | 'Некорректный файл';
    search?: string;
  }): Promise<DocumentHistoryResponse> => {
    const response = await apiClient.get<DocumentHistoryResponse>('/v1/documents', {
      params, 
    });
    return response.data;
  },

  getNotifications: async (): Promise<NotificationResponse> => {
    const response = await apiClient.get<NotificationResponse>('/v1/notifications');
    return response.data;
  },

    updateLastAccess: async (documentId: string): Promise<UpdateLastAccessResponse> => {
    const response = await apiClient.patch<UpdateLastAccessResponse>(
      `/v1/documents/${documentId}/access`
    );
    return response.data;
  },

  getDocumentPreview: async (documentId: string): Promise<string> => {
    const response = await apiClient.get(`/v1/documents/${documentId}/preview`, {
      responseType: 'text',
    });
    return response.data;
  },

  deleteDocument: async (documentId: string): Promise<void> => {
    await apiClient.delete(`/v1/documents/${documentId}`);
  },
};
