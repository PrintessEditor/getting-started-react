import React, { ReactNode } from "react";
import { Button } from "react-bootstrap";
import { Printess } from "../../editor";
import { PageButtons } from "./page-buttons";

interface Props {
  printess: Printess | null
}

interface State {
  backButtonDisabled: boolean,
  undoButtonDisabled: boolean,
  redoButtonDisabled: boolean
}

export class PageNavigation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.getBackButtonCallback = this.getBackButtonCallback.bind(this);

    this.state = {
      backButtonDisabled: false,
      undoButtonDisabled: true,
      redoButtonDisabled: true
    }
  }

  componentDidMount(): void {
    if (!this.props.printess?.getBackButtonCallback()) {
      this.setState({ backButtonDisabled: true });
    }

    if (this.props.printess && this.props.printess?.undoCount() === 0) {
      this.setState({ undoButtonDisabled: true });
    } else if (this.props.printess && this.props.printess?.undoCount() > 0) {
      this.setState({ undoButtonDisabled: false })
    }

    if (this.props.printess?.redoCount() === 0) {
      this.setState({ redoButtonDisabled: true });
    } else if (this.props.printess && this.props.printess?.redoCount() > 0) {
      this.setState({ redoButtonDisabled: false })
    }
  }

  getBackButtonCallback(): void {
    const callback = this.props.printess?.getBackButtonCallback();
    if (callback) {
      if (this.props.printess?.isInDesignerMode()) {
        // do not save in designer mode.
        callback("");
      } else {
        this.props.printess?.save().then(token => {
          callback(token);
        })
      }
    } else {
      // button was disabled, so this is never reached
      alert(this.props.printess?.gl("ui.backButtonCallback"));
    }
  }

  render(): ReactNode {
    const printess = this.props.printess;

    return (
      <>
        <nav id="desktop-pagebar">
          <div className="undo-redo-bar">
            <Button onClick={this.getBackButtonCallback} variant="outline-secondary" size="sm">{printess?.gl('ui.buttonBack')}</Button>
            <Button onClick={printess?.undo} variant="outline-secondary" className={`undo-button ${this.state.undoButtonDisabled ? 'disabled' : ''}`} size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="icon">
                <path fill="currentColor" d="M20 8h10c6.627 0 12 5.373 12 12v110.625C85.196 57.047 165.239 7.715 256.793 8.001 393.18 8.428 504.213 120.009 504 256.396 503.786 393.181 392.834 504 256 504c-63.926 0-122.202-24.187-166.178-63.908-5.113-4.618-5.354-12.561-.482-17.433l7.069-7.069c4.503-4.503 11.749-4.714 16.482-.454C150.782 449.238 200.935 470 256 470c117.744 0 214-95.331 214-214 0-117.744-95.331-214-214-214-82.862 0-154.737 47.077-190.289 116H180c6.627 0 12 5.373 12 12v10c0 6.627-5.373 12-12 12H20c-6.627 0-12-5.373-12-12V20c0-6.627 5.373-12 12-12z"></path>
              </svg>
            </Button>
            <Button onClick={printess?.redo} variant="outline-secondary" className={`undo-button me-2 ${this.state.redoButtonDisabled ? 'disabled' : ''}`} size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="icon">
                <path fill="currentColor" d="M492 8h-10c-6.627 0-12 5.373-12 12v110.625C426.804 57.047 346.761 7.715 255.207 8.001 118.82 8.428 7.787 120.009 8 256.396 8.214 393.181 119.166 504 256 504c63.926 0 122.202-24.187 166.178-63.908 5.113-4.618 5.354-12.561.482-17.433l-7.069-7.069c-4.503-4.503-11.749-4.714-16.482-.454C361.218 449.238 311.065 470 256 470c-117.744 0-214-95.331-214-214 0-117.744 95.331-214 214-214 82.862 0 154.737 47.077 190.289 116H332c-6.627 0-12 5.373-12 12v10c0 6.627 5.373 12 12 12h160c6.627 0 12-5.373 12-12V20c0-6.627-5.373-12-12-12z"></path>
              </svg>
            </Button>
          </div>

          {printess && printess?.getAllSpreads().length > 1 && <PageButtons printess={printess} spreads={printess?.getAllSpreads()} />}
        </nav>
      </>
    )
  }
}
