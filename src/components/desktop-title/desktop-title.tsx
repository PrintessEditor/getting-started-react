import React from "react";
import { Printess } from "../../editor";

import "./desktop-title.css";

interface Props {
  printess: Printess | null
}

interface State {
  title: string
}

export class DesktopTitle extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      title: ""
    }
  }

  render() {
    const printess = this.props.printess;
    return (
      <>
        <div>
          <div className="desktop-title-bar mb-2">
            <h2>{printess?.gl(printess.getTemplateTitle())}</h2>
            <button onClick={() => alert(printess?.gl("ui.addToBasketCallback"))} className="btn btn-primary">{printess?.gl("ui.buttonBasket")}</button>
          </div>
          <hr />
        </div>
      </>
    )
  }
}
