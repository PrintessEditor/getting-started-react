import React, { ReactNode } from "react";
import { Printess } from "../../editor";
import { iExternalFieldListEntry, iExternalListMeta, iExternalProperty } from "../../types";

import { ButtonGroup, Dropdown } from "react-bootstrap";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";

interface Props {
  printess: Printess | null,
  p: iExternalProperty,
  asList: boolean,
  fullWidth?: boolean
}

interface State {
  isOpen: boolean
}

export class DropDown extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: false
    }
  }

  getImageUrl(meta: iExternalListMeta, entry: iExternalFieldListEntry): ReactNode {
    if (entry.imageUrl) {
      let tw = meta.thumbWidth;
      let th = meta.thumbHeight;
      const aspect = tw / th;
      if (th > 50) { // max for mobile
        th = 50;
        tw = th * aspect;
      }

      return (
        <div className="dropdown-list-image" style={{ backgroundImage: `url('${entry.imageUrl}')`, width: tw + 'px', height: th + 'px', marginRight: '10px' }}></div>
      )
    }
    return '';
  }

  getDropdownItemContent(entry: iExternalFieldListEntry | null): ReactNode {
    const { printess, p } = this.props;
    // const selectedItem = p.listMeta?.list.filter(itm => itm.key === p.value)[0] ?? null;

    if (entry && p.listMeta) {
      return (
        <div className="dropdown-list-entry">

          {this.getImageUrl(p.listMeta, entry)}

          <div className="dropdown-list-label">{printess?.gl(entry.label)}</div>
        </div>
      )
    }
    return '';
  }

  setPrintessProperty(entry: iExternalFieldListEntry) {
    const { printess, p } = this.props;
    printess?.setProperty(p.id, entry.key);
  }

  render(): ReactNode {
    const { isOpen } = this.state;
    const { p, asList, fullWidth } = this.props;
    const selectedItem = p.listMeta?.list.filter(itm => itm.key === p.value)[0] ?? null;
    return (
      <>
        <ButtonGroup className={!asList ? 'form-control' : ''} id={'inp_' + p.id}>
          <DropdownToggle onClick={() => this.setState({ isOpen: !isOpen })} variant="light" className={`${fullWidth ? 'full-width' : ''}`} data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
            {this.getDropdownItemContent(selectedItem)}
          </DropdownToggle>
          <ul className={`${asList ? 'list-group' : 'dropdown-menu'} ${isOpen ? 'show' : ''}`} aria-labelledby={asList ? '' : 'defaultDropdown'} style={{ width: asList ? '' : '100%' }}>
            {p.listMeta?.list.map(entry => (
              <li key={entry.key} className={`${asList ? 'list-group-item' : ''} ${entry === selectedItem ? 'active' : ''}`}>
                <Dropdown.Item onClick={() => this.setPrintessProperty(entry)}>
                  {this.getDropdownItemContent(entry)}
                </Dropdown.Item>
              </li>
            ))}
          </ul>
        </ButtonGroup>
      </>
    )
  }
}
