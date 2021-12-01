import { LightningElement } from 'lwc';

export default class App extends LightningElement {
    text;
    language;
    src;
    tem;

    handleTextChange(event) {
        this.text = event.detail.text;
    }

    handleLanguageChange(event) {
        this.language = event.detail.language;
        console.log(this.language);
    }

    handleTemplateChange(event) {
        this.tem = event.detail.tem;
        console.log(this.tem);
    }

    handleSrcChange(event) {
        this.src = event.detail.src;
    }
}