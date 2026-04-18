import type { JSX } from "react";
import { HistoryResultsList } from "../../components/history-result-list/history-result-list";
import { FilterComponent } from "../../components/filter-component/filter-component";
import { HeaderComponent } from "../../components/header/header-component";


function HistoryPage(): JSX.Element {
    return(<div>
      <HeaderComponent/>
      <section className="content-container">
    <div className="file-list-container">
    <HistoryResultsList></HistoryResultsList>
    <div className="clear-btn">
        <div className="btn-bg">Очистить</div>
      </div> 
    </div>
    <FilterComponent></FilterComponent>
    </section></div>);
}
export{HistoryPage}