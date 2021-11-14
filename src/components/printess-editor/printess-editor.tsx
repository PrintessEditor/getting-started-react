import React from "react";
import { Printess } from "../../editor";
import { iExternalProperty } from "../../types";

import { PageNavigation } from "../page-navigation/page-navigation";
import { DesktopTitle } from "../desktop-title/desktop-title";
import { DesktopProperties } from "../desktop-properties/desktop-properties";

interface Props {
    printess: Printess | null,
    properties: Array<iExternalProperty>
}

export class PrintessEditor extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

        this.state = {
            show: false
        }
    }

    render() {
        const { printess, properties } = this.props;
        return (
            <div id="printess-desktop-grid" style={{ top: "60px" }}>
                <PageNavigation printess={printess} />
                <div id="desktop-properties">
                    <DesktopTitle printess={printess} />
                    <DesktopProperties printess={printess} properties={properties} forMobile={false} />
                </div>
                <div id="desktop-printess-container"></div>
            </div>
        )
    }
}
