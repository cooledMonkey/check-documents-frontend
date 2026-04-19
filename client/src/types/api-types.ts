// ===== DOCUMENTS & UPLOAD =====
export interface UploadFilesResponse {
  documents: TaskResponse[];
}

export interface TaskResponse {
  status: string;       // статус загрузки документа
  originalName: string; // исходное имя файла
  id: string;           // UUID документа
}

export interface UploadDocumentsValidationItem {
  field: string;        // например: "files[0]"
  errorCode: string;    // например: "FILE_SIZE_EXCEEDED"
  message: string;      // человекочитаемое описание
}

export interface UploadDocumentsValidationResponse {
  error: string;
  details?: UploadDocumentsValidationItem[];
}

// ===== JOBS =====
export interface DocumentIdRequest {
  document_ids: string[];  // массив UUID документов
}

export interface JobIdResponse {
  job_ids: string[];  // ⚠️ массив, а не один jobId!
}

export interface JobStatusResponse {
  jobId: string;      // UUID задачи
  status: 'pending' | 'processing' | 'completed' | 'failed' | string; // бэкенд может вернуть другие значения
  retryCount: number;
  maxRetry: number;
}

// ===== REPORTS & HISTORY =====
export interface CryptoproResponseDto {
  file: string;  // JSON-отчёт от КриптоПро (как строка)
}

export interface VerificationReportResponse {
  id: string;                    // UUID отчёта
  document_id: string;           // UUID документа (snake_case!)
  job_id: string;                // UUID задачи (snake_case!)
  status: string;                // например: "Изменения не вносились"
  cryptopro_response?: CryptoproResponseDto;
  created_at: string;            // ISO 8601 (snake_case!)
}

export interface UpdateLastAccessResponse {
  id: string;                    // UUID документа
  lastAccessedAt: string;        // ISO 8601 (camelCase!)
}

export interface HistoryItem {
  id: string;                    // UUID
  originalName: string;
  status: string;                // например: "Изменения не вносились"
  uploadedAt: string;            // ISO 8601
}

export interface DocumentHistoryResponse {
  total: number;    // всего записей
  page: number;     // текущая страница
  limit: number;    // записей на страницу
  items: HistoryItem[];
}

// ===== NOTIFICATIONS =====
export interface NotificationItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | string;
  isRead: boolean;
  createdAt: string;            // ISO 8601
  relatedDocument?: string;     // UUID документа (опционально)
}

export interface NotificationResponse {
  notifications: NotificationItem[];
}

// ===== UTILS =====
export interface ApiError {
  status: number;
  message: string;
  details?: Record<string, any>;
}