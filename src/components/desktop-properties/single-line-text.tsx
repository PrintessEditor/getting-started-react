import React, { ReactNode } from "react";
import { Printess } from "../../editor";
import { iExternalProperty } from "../../types";

interface Props {
  printess: Printess | null,
  p: iExternalProperty,
  forMobile: boolean
}

interface State {
  isOpen: boolean
}

export class SingleLineText extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: false
    }
  }

  onTextInput(e: { target: HTMLInputElement }) {
    const { printess, p } = this.props;

    printess?.setProperty(p.id, e.target.value);
    p.value = e.target.value;
  }

  onTextFocus(e: { target: HTMLInputElement }) {
    const p = this.props.p;

    if (e.target.value && p.validation && p.validation.clearOnFocus && e.target.value === p.validation.defaultValue) {
      e.target.value = "";
    } else {
      window.setTimeout(() => e.target.select(), 0);
    }
  }

  render(): ReactNode {
    const { p, forMobile } = this.props;
    return (
      <>
        <input onFocus={(e: { target: HTMLInputElement }) => this.onTextFocus(e)} onInput={(e: React.ChangeEvent<HTMLInputElement>) => this.onTextInput(e)} id={'inp_' + p.id} type="text" className={forMobile ? '' : 'form-control'} defaultValue={p.value.toString()} autoComplete="off" autoCapitalize="off" spellCheck="false"></input>
      </>
    )
  }
}
