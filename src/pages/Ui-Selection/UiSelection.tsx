import React from 'react';
import PrintessLogo from '../../assets/img/PrintessLogoS.png'

import 'bootstrap/dist/css/bootstrap.min.css';
import PrintessUi from '../Printess-Ui/Printess';
import PrintessIframe from '../Printess-Iframe/Printess-Iframe';

interface PrintessState {
  displayTarget: string
}

class UiSelection extends React.Component<{}, PrintessState> {
  state = {
    displayTarget: "overview"
  }

  render() {
    const { displayTarget } = this.state;
    return (
      <>
        {displayTarget === "overview" &&
          <div style={{ padding: "20px" }}>
            <img src={PrintessLogo} alt="Printess Logo" style={{ width: "200px", marginBottom: "20px", display: "block" }} />
            <h5>Embedding the Printess Editor</h5>
            <p>Here you can test run various Printess integrations from our <a href="https://github.com/PrintessEditor/getting-started-react">getting started react repo</a>.</p>
            <div className="list-group list-group-flush">
              <h5 className="list-group-item list-group-item-action active">1. Basic <i style={{ color: "rgba(255,255,255,0.6)" }}>iframe-ui</i></h5>
              <a className="list-group-item list-group-item-action" href="# " onClick={() => this.setDisplayTarget("iframe")}>Simple and Plain <small>(iframe-ui/plain.html)</small></a>

              {/* <h5 className="list-group-item list-group-item-action active">2. Advanced <i style={{ color: "rgba(255,255,255,0.6)" }}>custom-ui</i></h5>
              <a className="list-group-item list-group-item-action" href="custom-ui/plain.html">Simple and Plain <small>(custom-ui/plain.html)</small></a>
              <a className="list-group-item list-group-item-action" href="# " onClick={() => this.setDisplayTarget("with toolbar")}>With toolbar to test various api calls  <small>(custom-ui/with-toolbar.html)</small></a> */}
              {/* <a className="list-group-item list-group-item-action" href="custom-ui/auto-scale-no-zoom.html">No zoom and pan in auto-scale container  <small>(custom-ui/auto-scale-no-zoom.html)</small></a> */}
            </div>
          </div>
        }
        {displayTarget === "with toolbar" && <PrintessUi />}
        {displayTarget === "iframe" && <PrintessIframe />}
      </>

    );
  }

  setDisplayTarget = (target: string): void => {
    this.setState({ displayTarget: target });
  }
}

export default UiSelection;
