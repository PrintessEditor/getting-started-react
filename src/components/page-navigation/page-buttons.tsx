import React from "react";
import { PageItem, Pagination } from "react-bootstrap";
import { Printess } from "../../editor";
import { iExternalSpreadInfo } from "../../types";

import "./page-navigation.css";

interface Props {
  printess: Printess | null,
  spreads: Array<iExternalSpreadInfo> | undefined
}

interface State {
  count: number | undefined,
  lastPos: "start" | "current" | "end" | "skip",
  pageNo: number,
  info: { current: number, max: number, isFirst: boolean, isLast: boolean, spreadId: string }
}

export class PageButtons extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.getCurrentSpreadPosition = this.getCurrentSpreadPosition.bind(this);

    this.state = {
      count: this.props.spreads?.reduce((prev, cur) => prev + cur.pages, 0),
      lastPos: "start",
      pageNo: 1,
      info: { current: 0, max: 0, isFirst: true, isLast: false, spreadId: "0" }
    }
  }

  async componentDidMount(): Promise<void> {
    this.getCurrentSpreadPosition();

    this.props.printess?.pageInfo().then(info => this.setState({ info: info }));
  }

  render() {
    return (
      <>
        <Pagination className="justify-content-center">
          {this.getCurrentSpreadPosition()}
        </Pagination>
      </>
    )
  }

  changePage(pageNo: number, spreadIndex: number, page: "entire" | "left-page" | "right-page" | undefined) {
    this.setState({ pageNo });
    this.props.printess?.selectSpread(spreadIndex, page);
  }

  goPrevPage() {
    this.props.printess?.previousPage();
    this.setState({ pageNo: this.state.pageNo - 1 });
  }

  goNextPage() {
    this.props.printess?.nextPage();
    this.setState({ pageNo: this.state.pageNo + 1 });
  }

  getCurrentSpreadPosition() {
    const spreads = this.props.spreads;
    const items = [];
    let pageNo = 0;
    if (spreads) {
      if (spreads.length > 1) {
        items.push(
          <PageItem key="prev" onClick={() => this.goPrevPage()} className={this.state.pageNo < 2 ? "me-2 disabled" : "me-2"}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512" style={{ height: "1.3em" }}><path fill="currentColor" d="M192 127.338v257.324c0 17.818-21.543 26.741-34.142 14.142L29.196 270.142c-7.81-7.81-7.81-20.474 0-28.284l128.662-128.662c12.599-12.6 34.142-3.676 34.142 14.142z"></path></svg>
          </PageItem>
        )
      }

      for (const spread of spreads) {
        for (let pageIndex = 0; pageIndex < spread.pages; pageIndex++) {
          const page = pageNo + 1;
          pageNo++;

          items.push(
            <PageItem key={page} onClick={() => this.changePage(page, spread.index, pageIndex === 0 ? "left-page" : "right-page")} className={this.state.info.max === page ? "me-2" : ""} active={this.state.pageNo === pageNo}>
              {pageNo}
            </PageItem>
          )
        }
      }

      if (spreads.length > 1) {
        items.push(
          <PageItem key="next" onClick={() => this.goNextPage()} className={this.state.info.max === this.state.pageNo ? "disabled" : ""}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512" style={{ height: "1.3em" }}><path fill="currentColor" d="M0 384.662V127.338c0-17.818 21.543-26.741 34.142-14.142l128.662 128.662c7.81 7.81 7.81 20.474 0 28.284L34.142 398.804C21.543 411.404 0 402.48 0 384.662z"></path></svg>
          </PageItem>
        )
      }
    }
    return items;
  }
}
