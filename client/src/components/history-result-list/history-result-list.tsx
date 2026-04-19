import type { JSX } from "react";
import { useState, useEffect, useCallback } from "react";
import { FileStatus, FileStatusLabel } from "../../const";
import { HistoryResultsItem } from "../history-result-item/history-result-item";
import { HistoryDivider } from "../history-divider/history-divider";
import { documentService } from "../../api/document-service";
import type { HistoryItem } from "../../types/api-types";
import type { FilterValues } from "../filter-component/filter-component";

interface HistoryResultsListProps {
  filters: FilterValues;
  page: number;
  onPageChange: (page: number) => void;
}

const mapHistoryStatus = (status: string): string => {
  const s = status.toLowerCase();
  if (s.includes("изменения не вносились")) return FileStatus.Valid;
  if (s.includes("некорректный файл")) return FileStatus.IncorrectFile;
  if (s.includes("изменения внесены")) return FileStatus.Invalid;
  return FileStatus.Invalid;
};

function HistoryResultsList({ filters, page, onPageChange }: HistoryResultsListProps): JSX.Element {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [limit] = useState(20);

  const backendStatus = filters.status === '' ? undefined :
    filters.status === 'valid' ? 'Изменения не вносились' :
    filters.status === 'invalid' ? 'Изменения внесены' :
    'Некорректный файл';

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await documentService.getDocumentHistory({
        page,
        limit,
        search: filters.search || undefined,
        filterByStatus: backendStatus,
        sortByDate: filters.sort,
      });
      setHistory(response.items || []);
      const totalItems = response.total || 0;
      setTotalPages(totalItems > 0 ? Math.ceil(totalItems / limit) : 0);
    } catch (err: any) {
      setError(err.message || "Не удалось загрузить историю");
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters, backendStatus]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleString("ru-RU", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  const handlePreview = async (documentId: string) => {
    try {
      const html = await documentService.getDocumentPreview(documentId);
      const win = window.open('', '_blank');
      if (win) { win.document.write(html); win.document.close(); }
    } catch (err) { console.error('Ошибка просмотра:', err); }
  };

  const handleDelete = async (documentId: string) => {
    if (!window.confirm('Удалить документ?')) return;
    try {
      await documentService.deleteDocument(documentId);
      fetchHistory();
    } catch (err) { console.error('Ошибка удаления:', err); }
  };

  if (loading && history.length === 0) return <div className="history-loading">Загрузка истории...</div>;
  if (error) return <div className="history-error"><p>⚠️ {error}</p><button onClick={fetchHistory} className="retry-button">Повторить</button></div>;

  return (
    <>
      <ul className="file-list-bg">
        {history.map((item, index) => {
          const uiStatus = mapHistoryStatus(item.status);
          return (
            <li key={item.id}>
              <HistoryResultsItem 
                status={uiStatus}
                statusLabel={FileStatusLabel[uiStatus]}
                fileName={`${item.originalName} • ${formatDate(item.uploadedAt)}`}
                onPreview={() => handlePreview(item.id)}
                onDelete={() => handleDelete(item.id)}
              />
              {index < history.length - 1 && <HistoryDivider />}
            </li>
          );
        })}
      </ul>

      {totalPages > 1 && (
        <div className="history-pagination">
          <button 
            className="pagination-btn"
            onClick={() => onPageChange(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            ← Назад
          </button>
          <span className="pagination-info">
            Страница {page} из {Math.max(0, totalPages - 1)}
          </span>
          <button 
            className="pagination-btn"
            onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
          >
            Вперёд →
          </button>
        </div>
      )}
    </>
  );
}

export { HistoryResultsList };