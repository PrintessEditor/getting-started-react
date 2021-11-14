import React from "react";
import { Dropdown, Nav, Offcanvas } from "react-bootstrap";
import { Printess } from "../../editor";

type Templates = Array<Template>

interface Template {
  href: string,
  value: string
}

const templates: Templates = [{
  href: "#Children%27s%20book",
  value: "Children's book"
}, {
  href: "#Retro%20Sign",
  value: "Retro Sign"
}, {
  href: "#Business%20Card",
  value: "Business Card"
}, {
  href: "#Greeting%20Card",
  value: "Greeting Card"
}, {
  href: "#Chocolate%20Bar",
  value: "Chocolate Bar"
}, {
  href: "#Photo-Calendar%201",
  value: "Photo-Calendar 1"
}, {
  href: "#Calendar",
  value: "Calendar"
}, {
  href: "#Newborn%20Card",
  value: "Newborn Card"
}, {
  href: "#Phone-Case",
  value: "Phone-Case"
}, {
  href: "#Puzzle",
  value: "Puzzle"
}, {
  href: "#T-shirt%202",
  value: "T-Shirt"
}, {
  href: "#Coffee%20Mug",
  value: "Coffee Mug"
}]

interface Props {
  printess: Printess | null
}

interface State {
  show: boolean
}

export class TemplateNavigation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.openTemplate = this.openTemplate.bind(this);

    this.state = {
      show: false
    }
  }

  openTemplate(value: string) {
    this.props.printess?.loadTemplate(value);
    this.setState({ show: false });
  }

  render() {
    return (
      <>
        <Offcanvas show={this.state.show} onHide={() => this.setState({ show: false })}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Load Template</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {templates.map(t => <Dropdown.Item key={t.value} href={t.href} onClick={() => this.openTemplate(t.value)}>{t.value}</Dropdown.Item>)}
          </Offcanvas.Body>
        </Offcanvas>

        <Nav.Item key="showTemplates" onClick={() => this.setState({ show: true })}>
          <Nav.Link id="btnShowTemplates" title="Open Templates" data-bs-toggle="offcanvas"
            data-bs-target="#templateOffcanvas">
            open
          </Nav.Link>
        </Nav.Item>
      </>
    )
  }
}
