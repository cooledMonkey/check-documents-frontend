import type { JSX } from "react";
import { FileStatus, FileStatusLabel } from "../../const";
import { HistoryResultsItem } from "../history-result-item/history-result-item";
import { HistoryDivider } from "../history-divider/history-divider";

function HistoryResultsList(): JSX.Element {
    return(<ul className="file-list-bg">
          <HistoryResultsItem status={FileStatus.Valid} statusLabel={FileStatusLabel.Valid} 
          fileName="PRF123999848123676481sdfhy7654dfg...123877.xml" ></HistoryResultsItem>
          <HistoryDivider></HistoryDivider>
        <HistoryResultsItem status={FileStatus.IncorrectFile} statusLabel={FileStatusLabel.IncorrectFile} 
          fileName="PRF123999848123676481sdfhy7654dfg...123877.xml" ></HistoryResultsItem>
      <HistoryDivider></HistoryDivider>
      <HistoryResultsItem status={FileStatus.Invalid} statusLabel={FileStatusLabel.Invalid} 
          fileName="PRF123999848123676481sdfhy7654dfg...123877.xml" ></HistoryResultsItem>
    </ul>);
}
export{HistoryResultsList}