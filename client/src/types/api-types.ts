export interface UploadFilesResponse {
  documents: TaskResponse[];
}

export interface TaskResponse {
  status: string;      
  originalName: string; 
  id: string;          
}

export interface UploadDocumentsValidationItem {
  field: string;     
  errorCode: string;   
  message: string;   
}

export interface UploadDocumentsValidationResponse {
  error: string;
  details?: UploadDocumentsValidationItem[];
}
export interface DocumentIdRequest {
  document_ids: string[]; 
}

export interface JobIdResponse {
  job_ids: string[]; 
}

export interface JobStatusResponse {
  jobId: string;      // UUID задачи
  status: 'pending' | 'processing' | 'completed' | 'failed' | string;
  retryCount: number;
  maxRetry: number;
}
export interface CryptoproResponseDto {
  file: string;  
}

export interface VerificationReportResponse {
  id: string;                
  document_id: string;          
  job_id: string;               
  status: string;              
  cryptopro_response?: CryptoproResponseDto;
  created_at: string;           
}

export interface UpdateLastAccessResponse {
  id: string;                   
  lastAccessedAt: string;      
}

export interface HistoryItem {
  id: string;            
  originalName: string;
  status: string;           
  uploadedAt: string;           
}

export interface DocumentHistoryResponse {
  total: number; 
  page: number;
  limit: number;  
  items: HistoryItem[];
}
export interface NotificationItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | string;
  isRead: boolean;
  createdAt: string;        
  relatedDocument?: string; 
}
export interface NotificationResponse {
  notifications: NotificationItem[];
}
export interface ApiError {
  status: number;
  message: string;
  details?: Record<string, any>;
}