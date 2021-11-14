import React, { ReactNode } from "react";
import { Printess } from "../../editor";
import { iExternalProperty } from "../../types";

import { DropDown } from "./drop-down";
import { SingleLineText } from "./single-line-text";

interface Props {
  printess: Printess | null,
  properties: Array<iExternalProperty>,
  forMobile: boolean
}

interface State {
  title: string
}

export class DesktopProperties extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      title: ""
    }
  }

  getPropertyControl(p: iExternalProperty): ReactNode {
    const { printess, forMobile } = this.props;
    switch (p.kind) {
      case "single-line-text":
        return <SingleLineText printess={printess} p={p} forMobile={forMobile} />;
      case "select-list":
        return <DropDown key={p.id} printess={printess} p={p} asList={forMobile} fullWidth={true} />;
    }
  }

  render(): ReactNode {
    const { printess, properties, forMobile } = this.props;
    return (
      <>
        <div>
          {properties.map(p => (
            <div key={p.id} className="mb-3" id={'cnt_' + p.id}>
              <label htmlFor={'inp_' + p.id} className="form-label" style={{ display: forMobile ? 'none' : 'inline-block' }}>{printess?.gl(p.label) || ""}</label>
              {this.getPropertyControl(p)}
              <div id={'val_' + p.id} className="invalid-feedback">{printess?.gl("errors.textMissingInline")}</div>
            </div>
          ))}
        </div>
      </>
    )
  }
}
