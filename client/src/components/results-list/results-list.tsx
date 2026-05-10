import type { JSX } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { Divider } from "../divider/divider";
import { ResultsItem } from "../result-item/result-item";
import { FileStatusLabel, type FileStatusType } from "../../const";
import { mapBackendStatus } from "../../utils/statusMapper";
import type { RootState } from "../../store";
import { useJobResultsWatcher } from "../../hook/useJobResultsWatcher";
import { resetCheckState } from "../../store/fileSlice";

function ResultsList(): JSX.Element {
  const { isChecking } = useJobResultsWatcher();
  const dispatch = useDispatch();
  const uploadedDocuments = useSelector((state: RootState) => state.files.uploadedDocuments);

  // 👇 Обработчик очистки результатов
  const handleClearResults = useCallback(() => {
    dispatch(resetCheckState());
  }, [dispatch]);

  if (uploadedDocuments.length === 0) {
    return (
      <div className="file-list-bg">
        <p className="file-name">Результаты проверки появятся здесь</p>
      </div>
    );
  }

  return (
    <>
      <ul className="file-list-bg">
        {uploadedDocuments.map((doc, index) => {
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

      <div className="clear-btn" onClick={handleClearResults}>
        <div className="btn-bg">Очистить</div>
      </div>
    </>
  );
}

export { ResultsList };