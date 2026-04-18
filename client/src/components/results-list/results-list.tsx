import type { JSX } from "react";
import { Divider } from "../divider/divider";
import { ResultsItem } from "../result-item/result-item";
import { FileStatus, FileStatusLabel } from "../../const";

function ResultsList(): JSX.Element {
    return(<ul className="file-list-bg">
          <ResultsItem status={FileStatus.Valid} statusLabel={FileStatusLabel.Valid} 
          fileName="PRF123999848123676481sdfhy7654dfg...123877.xml" ></ResultsItem>
          <Divider></Divider>

      <ResultsItem status={FileStatus.IncorrectFile} statusLabel={FileStatusLabel.IncorrectFile} 
          fileName="PRF123999848123676481sdfhy7654dfg...123877.xml" ></ResultsItem>
      <Divider></Divider>
      <ResultsItem status={FileStatus.Invalid} statusLabel={FileStatusLabel.Invalid} 
          fileName="PRF123999848123676481sdfhy7654dfg...123877.xml" ></ResultsItem>
    </ul>);
}
export{ResultsList}