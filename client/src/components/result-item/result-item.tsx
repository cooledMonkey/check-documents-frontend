import type { JSX } from "react";

type ResultsItemProps = {
  status: string;
  statusLabel: string;
  fileName: string;
}
function ResultsItem({status, statusLabel, fileName}: ResultsItemProps): JSX.Element {
    return(<li className="file-item">
            <p className="file-name">{fileName}</p>
              <div className={`status-badge ${status}`}>
                <div className="status-bg">{statusLabel}</div>
              </div>      
          </li>);
}
export{ResultsItem}