import { FileStatus, type FileStatusType } from '../const';
import type { VerificationReportResponse } from '../types/api-types';

/**
 * Преобразует ответ сервера в один из 3 финальных статусов.
 * Вызывать ТОЛЬКО когда report уже получен.
 */
export const mapBackendStatus = (report: VerificationReportResponse): FileStatusType => {
  const status = report.status?.toLowerCase() || '';
  
  // ✅ Подпись действительна
  if (
    status.includes('корректна') || 
    status.includes('valid') || 
    status.includes('ok') ||
    status.includes('изменения не вносились')
  ) {
    return FileStatus.Valid;
  }
  
  // ⚠️ Некорректный файл (ошибка формата, не XML, повреждён)
  if (
    status.includes('недействительна') &&
    !status.includes('истек/не наступил срок действия требуемого сертификата')
  ) {
    return FileStatus.Invalid;
  }

  // ❌ По умолчанию, если отчёт есть, но статус не распознан — считаем невалидным
  return FileStatus.IncorrectFile;
};