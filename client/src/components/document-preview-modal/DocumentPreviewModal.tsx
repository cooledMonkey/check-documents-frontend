import type { JSX, useEffect } from "react";
import { useState, useEffect as useReactEffect, useRef } from "react";
import { documentService } from "../../api/document-service";

interface DocumentPreviewModalProps {
  documentId: string;
  fileName: string;
  onClose: () => void;
}

function DocumentPreviewModal({ documentId, fileName, onClose }: DocumentPreviewModalProps): JSX.Element {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useReactEffect(() => {
    let cancelled = false;
    const fetchPreview = async () => {
      try {
        const html = await documentService.getDocumentPreview(documentId);
        if (!cancelled) setHtmlContent(html);
      } catch {
        if (!cancelled) setError('Не удалось загрузить превью документа');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchPreview();
    return () => { cancelled = true; };
  }, [documentId]);

  // Закрытие по Escape
  useReactEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div className="preview-modal-content" onClick={e => e.stopPropagation()}>
        <div className="preview-modal-header">
          <h3 className="preview-title">{fileName}</h3>
          <button className="preview-close-btn" onClick={onClose} title="Закрыть">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="preview-modal-body">
          {loading && (
            <div className="preview-state">
              <div className="preview-spinner"></div>
              <p>Загрузка документа...</p>
            </div>
          )}
          {error && <div className="preview-state preview-error">{error}</div>}
          {!loading && !error && (
            <iframe 
              srcDoc={htmlContent} 
              title="Предпросмотр документа" 
              className="preview-iframe"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export { DocumentPreviewModal };