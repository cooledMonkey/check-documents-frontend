import type { JSX } from "react";

function HistoryDivider(): JSX.Element {
    return(<li>
            <svg className="divider" width="762" height="3" viewBox="0 0 762 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.999999 0.999985L760.391 1.0977" stroke="#B4B4B4" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </li>);
}
export{HistoryDivider}