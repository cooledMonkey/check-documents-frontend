import type { JSX } from "react";
import { useSelector } from "react-redux";
import { Divider } from "../divider/divider";
import { ResultsItem } from "../result-item/result-item";
import { FileStatusLabel, type FileStatusType } from "../../const";
import { mapBackendStatus } from "../../utils/statusMapper";
import type { RootState } from "../../store";
import { useJobResultsWatcher } from "../../hook/useJobResultsWatcher";

function ResultsList(): JSX.Element {
  // 👇 Запускаем "слушателя" задачи и загрузки отчётов
  const { isChecking } = useJobResultsWatcher();
  
  const uploadedDocuments = useSelector((state: RootState) => state.files.uploadedDocuments);

  // 🟡 Пусто или проверка только началась
  if (uploadedDocuments.length === 0) {
    return (
      <div className="file-list-bg">
        <p className="file-name">Результаты проверки появятся здесь</p>
      </div>
    );
  }

  return (
    <ul className="file-list-bg">
      {uploadedDocuments.map((doc, index) => {
        // 🔍 Пока нет отчёта или задача в процессе
        if (!doc.report || isChecking) {
          return (
            <li key={doc.id}>
              <div className="file-item">
                <p className="file-name">{doc.originalName}</p>
                <div className="status-badge processing">
                  <div className="status-bg">Проверяется...</div>
                </div>
              </div>
              {index < uploadedDocuments.length - 1 && <Divider />}
            </li>
          );
        }

        // ✅ Отчёт готов — маппим в один из 3 статусов
        const uiStatus: FileStatusType = mapBackendStatus(doc.report);
        const statusLabel = FileStatusLabel[uiStatus];

        return (
          <li key={doc.id}>
            <ResultsItem 
              status={uiStatus}           
              statusLabel={statusLabel}   
              fileName={doc.originalName} 
            />
            {index < uploadedDocuments.length - 1 && <Divider />}
          </li>
        );
      })}
    </ul>
  );
}

export { ResultsList };