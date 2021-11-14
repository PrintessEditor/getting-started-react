import React from "react";
import { Printess } from '../../editor';

import "./button-bar.css";

interface Props {
    printess: Printess | null
}

export class ButtonBar extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
        this.createThumbnail = this.createThumbnail.bind(this);
        this.saveJson = this.saveJson.bind(this);
        this.loadJson = this.loadJson.bind(this);
        this.changeTemplate = this.changeTemplate.bind(this);
    }

    createThumbnail() {
        document.getElementById('message')!.textContent = "Creating Thumbnail, Please allow Popups ...";
        setTimeout(() => document.getElementById("message")!.textContent = "", 2000);

        const fileName = "thumb_" + new Date().getTime() + ".png";
        const documentName = "!PREVIEW!"; // optional set a specific document-name here or leave it empty
        const width = 400; // max is 400
        const height = 400; // max is 400

        this.props.printess?.renderFirstPageImage(fileName, documentName, width, height).then((thumbnailUrl: any) => {
            window.open(thumbnailUrl);
        });
    }

    async saveJson() {
        this.props.printess?.saveJson().then((token: string) => {
            prompt("Template stored with token:", token);
        });
    }

    loadJson() {
        const token = prompt("Load template with token:", "Paste token here");
        token && this.props.printess?.loadJson(token)
            .then(() => {
                alert("Template Loaded");
            })
            .catch((msg: string) => {
                alert(msg)
            });
    }

    changeTemplate(event: { target: HTMLSelectElement }) {
        const value = event.target.value;
        this.props.printess?.loadTemplate(value);
    }

    render() {
        return (
            <div className="button-bar">
                <select id="loadTemplate" defaultValue="Sign" onChange={this.changeTemplate}>
                    <option disabled>Load Template ...</option>
                    <option value="Sign">Retro Sign</option>
                    <option value="Business-Card">Business Card</option>
                    <option value="Greeting Card">Greeting Card</option>
                    <option value="Chocolate Bar">Chocolate Bar</option>
                    <option value="T-Shirt">T-Shirt</option>
                </select>
                <div id="message"></div>
                <button id="btnCreateThumbnail" onClick={this.createThumbnail}>Create<br />Thumbnail</button>
                <button id="btnSaveJson" onClick={this.saveJson}>Save State</button>
                <button id="btnLoadJson" onClick={this.loadJson}>Load State</button>
            </div>
        )
    }
}
