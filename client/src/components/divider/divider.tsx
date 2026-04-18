import type { JSX } from "react";

function Divider(): JSX.Element {
    return(<li>
            <svg className="divider" width="664" height="3" viewBox="0 0 664 3" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="0.999979" y1="1" x2="662.999" y2="1.99699" stroke="#B4B4B4" stroke-width="2" stroke-linecap="round"></line>
            </svg>
          </li>);
}
export{Divider}