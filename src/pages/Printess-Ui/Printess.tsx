import React from 'react';
import { Toolbar } from '../../components/toolbar/toolbar';
import { PrintessEditor } from '../../components/printess-editor/printess-editor';
import { TokenWarning } from '../../components/token-warning/token-warning';
import { Printess, PrintessLoader } from '../../editor';
import { iExternalProperty, iExternalPropertyKind, iExternalSnippetCluster, iExternalSpreadInfo, iPrintessApi } from '../../types';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Printess.css';
import UiSelection from '../Ui-Selection/UiSelection';

interface PrintessState {
  printess: Printess | null,
  properties: Array<iExternalProperty>,
  isMobile: boolean,
  displayTarget: string
}

class PrintessUi extends React.Component<{}, PrintessState> {
  state = {
    printess: null,
    properties: [],
    isMobile: false,
    displayTarget: "with-toolbar"
  }

  componentDidMount(): void {
    const token = process.env.REACT_APP_PRINTESS_TOKEN === 'ToBeReplaced' ? process.env.REACT_APP_TEST_TOKEN : process.env.REACT_APP_PRINTESS_TOKEN;
    let printess: iPrintessApi | null = this.state.printess;
    let printessLoader: PrintessLoader | null = null;
    let currentGroupSnippets: Array<iExternalSnippetCluster> = [];
    let self: this = this;

    function loadPrintessEditor(): Promise<boolean> {
      return new Promise(async resolve => {
        console.log('PrintessEditor loading');

        async function loadEditor() {
          try {
            printessLoader = await (window as any).loadPrintessEditor();
            return true;
          } catch {
            return false;
          }
        }

        let loadResult = await loadEditor();
        if (!loadResult) {
          const timer = (ms: number) => new Promise(res => setTimeout(res, ms));
          let retryCount = 0;

          while (!loadResult && retryCount < 5) {
            console.log('retrying', retryCount + 1);
            await timer(1000);
            loadResult = await loadEditor();
            retryCount++;
          }

          if (!loadResult) {
            resolve(false);
            return;
          }
        }

        resolve(true);

        attachPrintessToDiv();
      });
    };

    loadPrintessEditor();


    const loadingDoneCallback = function (spreads?: Array<iExternalSpreadInfo>, title?: string): void {
      // remove your progress overlay here
    }

    const spreadChangeCallback = (groupSnippets: Array<iExternalSnippetCluster>, layoutSnippets: Array<iExternalSnippetCluster>): void => {
      console.warn("Spread Change!");
    }

    const selectionChangeCallback = (properties: Array<iExternalProperty>, state: "document" | "frames" | "text"): void => {
      // state is "document" or "frames"
      console.warn("Selection Change!");
      this.setState({ properties });

      if (printess && printess.isMobile()) {
        this.setState({ isMobile: true });
        console.log('printess is mobile');
      } else {
        this.setState({ isMobile: false });
        console.log('printess is NOT mobile');
      }
    }

    const getOverlayCallback = (properties: Array<{ kind: iExternalPropertyKind }>): HTMLDivElement => {
      console.log("Getting Overlay");
      const div = document.createElement('div') as HTMLDivElement;
      return div;
    }

    const backButtonCallback = (): void => {
      this.setState({ displayTarget: "overview" })
    }

    async function attachPrintessToDiv() {
      if (printessLoader === null) {
        throw new Error('Printess library has not been loaded');
      } else {
        const div = document.getElementById('desktop-printess-container') as HTMLDivElement;
        if (div) {
          self.setState({
            printess: await printessLoader?.attachPrintess({
              resourcePath: "https://editor.printess.com/printess-editor", // needs to be always set
              domain: 'api.printess.com',
              div: div,
              basketId: 'CurrentShopBasketId',
              shopUserId: 'CurrentShopCustomerId',
              token: token,
              showBuyerSide: true,
              templateName: 'Newborn Card',
              templateVersion: 'published',
              formFields: [],

              loadingDoneCallback: loadingDoneCallback,
              selectionChangeCallback: selectionChangeCallback,
              getOverlayCallback: getOverlayCallback,
              backButtonCallback: backButtonCallback
            })
          })
          printess = self.state.printess;
        }
      }
    };
  }

  render() {
    const { printess, properties, isMobile, displayTarget } = this.state;
    return (
      <>
        {displayTarget === "overview" && <UiSelection />}
        {displayTarget === "with-toolbar" &&
          <>
            {!isMobile && <Toolbar printess={printess} />}
            {/* <ButtonBar printess={printess} /> */}
            {isMobile ? <div></div> : <PrintessEditor printess={printess} properties={properties} />}
            {process.env.REACT_APP_PRINTESS_TOKEN === 'ToBeReplaced' && <TokenWarning />}
          </>}
      </>
    );
  }
}

export default PrintessUi;
