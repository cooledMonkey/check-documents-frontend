// src/hooks/useJobResultsWatcher.ts
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { documentService } from '../api/document-service';
import type { JobStatusResponse } from '../types/api-types';
import type { RootState } from '../store';
import { setCheckError, setIsChecking, updateDocumentStatus } from '../store/fileSlice';

export function useJobResultsWatcher() {
  const dispatch = useDispatch();
  const currentJobId = useSelector((state: RootState) => state.files.currentJobId);
  const uploadedDocuments = useSelector((state: RootState) => state.files.uploadedDocuments);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isFetchingRef = useRef(false); // Защита от concurrent-запросов

  useEffect(() => {
    // Если jobId нет или уже проверяем — выходим
    if (!currentJobId || isFetchingRef.current) return;

    // Запускаем поллинг каждые 2 секунды
    pollRef.current = setInterval(async () => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      try {
        const jobStatus: JobStatusResponse = await documentService.getJobStatus(currentJobId);

        if (jobStatus.status === 'completed') {
          // ✅ Задача завершена → останавливаем поллинг
          if (pollRef.current) clearInterval(pollRef.current);
          
          // Загружаем отчёты для каждого документа
          for (const doc of uploadedDocuments) {
            if (doc.report) continue; // Уже есть отчёт
            try {
              const report = await documentService.getVerificationReport(doc.id);
              dispatch(updateDocumentStatus({
                documentId: doc.id,
                status: 'completed',
                report,
              }));
            } catch (err: any) {
              dispatch(updateDocumentStatus({
                documentId: doc.id,
                status: 'failed',
                error: err.message || 'Не удалось загрузить отчёт',
              }));
            }
          }
          dispatch(setIsChecking(false)); // Только теперь выключаем флаг
          
        } else if (jobStatus.status === 'failed') {
          // ❌ Ошибка на сервере
          if (pollRef.current) clearInterval(pollRef.current);
          dispatch(setCheckError('Проверка завершилась с ошибкой на сервере'));
          dispatch(setIsChecking(false));
        }
      } catch (err) {
        console.warn('Ошибка опроса статуса задачи:', err);
      } finally {
        isFetchingRef.current = false;
      }
    }, 2000);

    // Очистка при размонтировании или смене jobId
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
      isFetchingRef.current = false;
    };
  }, [currentJobId, uploadedDocuments, dispatch]);

  return { currentJobId };
}