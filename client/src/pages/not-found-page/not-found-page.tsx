import type { JSX } from "react";
import { HeaderComponent } from "../../components/header/header-component";

function NotFoundPage(): JSX.Element {
    return(<div><HeaderComponent/>
    <div>
        404</div></div>);
}
export{NotFoundPage}