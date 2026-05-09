import { FileStatus, type FileStatusType } from '../const';
import type { VerificationReportResponse } from '../types/api-types';

export const mapBackendStatus = (report: VerificationReportResponse): FileStatusType => {
  const status = report.status?.toLowerCase() || '';
  
  if (
    status.includes('корректна') || 
    status.includes('valid') || 
    status.includes('ok') ||
    status.includes('изменения не вносились')
  ) {
    return FileStatus.Valid;
  }
  
  if (
    status.includes('недействительна') &&
    !status.includes('истек/не наступил срок действия требуемого сертификата')
  ) {
    return FileStatus.Invalid;
  }

  return FileStatus.IncorrectFile;
};