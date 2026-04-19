import type { JSX } from "react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAppSelector } from "../../store/hooks";
import { clearFiles, setIsChecking, setCheckError } from "../../store/fileSlice";
import { startFilesCheck } from "../../store/fileThunks"; // 👈 импортируем thunk
import type { RootState } from "../../store";
import type { FileMetadata } from "../../store/fileSlice";

function UploadedFilesList(): JSX.Element {
    const dispatch = useDispatch();
    const selectedFiles = useAppSelector((state) => state.files.selectedFiles) as FileMetadata[];
    const isChecking = useSelector((state: RootState) => state.files.isChecking);
    
    const handleClearFiles = useCallback(() => {
        if (selectedFiles.length === 0) return;
        dispatch(clearFiles());
    }, [dispatch, selectedFiles.length]);

    // 👇 Обработчик кнопки "Проверка"
    const handleCheckFiles = useCallback(async () => {
        if (selectedFiles.length === 0) return;
        
        // 👇 Диспатчим thunk — вся логика проверки внутри
        const result = await dispatch(startFilesCheck());
        
        if (startFilesCheck.rejected.match(result)) {
            // Обработка ошибки
            dispatch(setCheckError(result.payload || 'Ошибка проверки'));
            dispatch(setIsChecking(false));
        }
        // При успехе thunk сам обновит стейт (uploadedDocuments, currentJobId)
    }, [dispatch, selectedFiles.length]);

    return (
        <div className="selected-files-container">
            <ul className="selected-files-bg">
                {selectedFiles.map((file) => (
                    <li key={file.id} className="selected-file">
                        {file.name}
                    </li>
                ))}
            </ul>
            
            <div className="two-buttons-class">
                {/* 👇 Кнопка "Проверка" с обработчиком и disabled-состоянием */}
                <div 
                    className={`verify-btn${selectedFiles.length === 0 || isChecking ? ' disabled' : ''}`}
                    onClick={handleCheckFiles}
                    style={{ 
                        cursor: (selectedFiles.length === 0 || isChecking) ? 'not-allowed' : 'pointer',
                        opacity: (selectedFiles.length === 0 || isChecking) ? 0.6 : 1
                    }}
                >
                    <div className="btn-bg">
                        {isChecking ? 'Проверка...' : 'Проверка'}
                    </div>
                </div>
                
                <div 
                    className={`verify-btn${selectedFiles.length === 0 || isChecking ? ' disabled' : ''}`}
                    onClick={handleClearFiles}
                    style={{ 
                        cursor: (selectedFiles.length === 0 || isChecking) ? 'not-allowed' : 'pointer',
                        opacity: (selectedFiles.length === 0 || isChecking) ? 0.6 : 1
                    }}
                >
                    <div className="btn-bg">Очистить</div>
                </div>
            </div>
        </div>
    );
}

export { UploadedFilesList };