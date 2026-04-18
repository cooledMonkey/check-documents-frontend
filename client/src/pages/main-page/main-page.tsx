import type { JSX } from "react";
import { ResultsList } from "../../components/results-list/results-list";
import { UploadedFilesList } from "../../components/uploaded-files-list/uploaded-files-list";
import { HeaderComponent } from "../../components/header/header-component";
import { UploadFilesComponent } from "../../components/upload-files/upload-files-component";

function MainPage(): JSX.Element {
    return(<div><HeaderComponent/>
    <main className="content-container">
    <div className="file-list-container">
    <ResultsList></ResultsList>
    <div className="clear-btn">
        <div className="btn-bg">Очистить</div>
      </div>
    </div>
    <UploadFilesComponent/>
    <UploadedFilesList></UploadedFilesList>
    </main></div>)
}
export {MainPage}