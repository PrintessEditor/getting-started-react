import React from 'react';
import UiSelection from '../Ui-Selection/UiSelection';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Printess-Iframe.css';

interface PrintessState {
  displayTarget: string
}

class PrintessIframe extends React.Component<{}, PrintessState> {
  state = {
    displayTarget: "iframe"
  }

  componentDidMount(): void {
    const iframe = document.getElementsByTagName("iframe")[0];
    if (iframe) {
      iframe.onload = () => {

        /* **************************** */
        /* listen to printess callbacks */
        /* **************************** */
        window.addEventListener("message", (event) => {
          switch (event.data.cmd) {

            case "back":
              this.setState({ displayTarget: "overview" })
              break;

            case "basket":
              prompt("Proceed to checkout.\n\nsave-token:\n" + event.data.token + "\n\nThumbnailUrl:", event.data.thumbnailUrl);
              break;

            case "formFieldChanged":
              /* You can react to changes of price-relevant form fields here */
              const msg = document.getElementById("message");
              if (msg) {
                msg.style.display = "flex";
                msg.textContent = "Form Field: [" + event.data.name + "] changed to '" + event.data.value + "'";
                setTimeout(() => {
                  const msgUpdated = document.getElementById("message")
                  if (msgUpdated) msgUpdated.style.display = "none"
                }, 2000);
              }
          }
        });

        /* *************************** */
        /*    load Printess editor     */
        /* *************************** */
        iframe.contentWindow?.postMessage({
          cmd: "attach", properties: {

            /* Paste your Printess shop-token here */
            token: "", // 

            /* Name of the template to load. You can also pass a save-token from "basket" or "back" callback here to load previously saved work. */
            templateName: "Greeting Card",

            /* A unique ID to identify this session, can later be used to connect to a UserID once the user has logged in or createdan account */
            basketId: "Some-Unique-Basket-Or-Session-Id",

            /* Optional if available: the ID of the current shop-user to keep all uploaded resources together and display for reccuring users */
            shopUserId: ""
          }
        }, "*");
      }


      /* *************************** */
      /*   Forward Visual Viewport   */
      /* *************************** */
      if (window.visualViewport) {
        window.visualViewport.addEventListener("scroll", () => {
          // unfortunately an iframe on iOS is not able to receive the correct visual-viewport, so we forward it. 
          iframe.contentWindow?.postMessage({ cmd: "viewportScroll", height: window.visualViewport.height, offsetTop: window.visualViewport.offsetTop }, "*")
        })
      }
    }
  }

  componentWillUnmount(): void {
    const iframe = document.getElementsByTagName("iframe")[0];
    if (iframe) {
      iframe.onload = null;
    }
  }

  render() {
    const displayTarget = this.state.displayTarget;
    return (
      <>
        {displayTarget === "overview" && <UiSelection />}
        {displayTarget === "iframe" &&
          <>
            <iframe title="printess editor" id="printess" src="https://editor.printess.com/printess-editor/embed.html"></iframe>
            <div id="message"></div>
          </>
        }
      </>

    );
  }
}

export default PrintessIframe;
