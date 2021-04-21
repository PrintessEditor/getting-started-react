import React from 'react';
import { ButtonBar } from '../../components/button-bar/button-bar';
import { PrintessEditor } from '../../components/printess-editor/printess-editor';
import { TokenWarning } from '../../components/token-warning/token-warning';
import { Printess, PrintessLoader } from '../../editor';

import './Printess.css';

interface PrintessState {
  printess: Printess | null
}

class PrintessUi extends React.Component<{}, PrintessState> {
  state = { 
    printess: null
  }

  componentDidMount() {
    const token = process.env.REACT_APP_PRINTESS_TOKEN === 'ToBeReplaced' ? process.env.REACT_APP_TEST_TOKEN : process.env.REACT_APP_PRINTESS_TOKEN;
    let printessLoader: PrintessLoader | null = null;
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
            console.log('retrying', retryCount+1);
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
    
    async function attachPrintessToDiv() {
      if (printessLoader === null) {
        throw new Error ('Printess library has not been loaded');
      } else {
        const div = document.getElementById('printess') as HTMLDivElement;
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
              templateName: 'Sign'
            })
          })
        }
      }
    };
  }
  render() {
    return (
      <>
        <ButtonBar printess={this.state.printess} />
        <PrintessEditor />
        {process.env.REACT_APP_PRINTESS_TOKEN === 'ToBeReplaced' && <TokenWarning />}
      </>
    );
  }
}

export default PrintessUi;
