import type { JSX } from "react";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../store/hooks";
import { clearFiles } from "../../store/fileSlice"; // 👈 импортируем экшен

function UploadedFilesList(): JSX.Element {
    const dispatch = useDispatch();
    const selectedFiles = useAppSelector((state) => state.files.selectedFiles);
    
    // 👇 Обработчик очистки списка
    const handleClearFiles = useCallback(() => {
        if (selectedFiles.length === 0) return;
        dispatch(clearFiles());
    }, [dispatch, selectedFiles.length]);

    return (
        <div className="selected-files-container">
            <ul className="selected-files-bg">
                {selectedFiles.map((file) => (
                    <li key={file.name} className="selected-file">
                        {file.name}
                    </li>
                ))}
            </ul>
            
            <div className="two-buttons-class">
                <div className="verify-btn">
                    <div className="btn-bg">Проверка</div>
                </div>
                
                {/* 👇 Кнопка очистки с обработчиком и состоянием disabled */}
                <div 
                    className={`verify-btn${selectedFiles.length === 0 ? ' disabled' : ''}`}
                    onClick={handleClearFiles}
                    style={{ 
                        cursor: selectedFiles.length === 0 ? 'not-allowed' : 'pointer',
                        opacity: selectedFiles.length === 0 ? 0.6 : 1
                    }}
                >
                    <div className="btn-bg">Очистить</div>
                </div>
            </div>
        </div>
    );
}

export { UploadedFilesList };