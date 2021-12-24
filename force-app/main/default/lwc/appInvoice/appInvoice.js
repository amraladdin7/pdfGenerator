import { LightningElement } from 'lwc';

export default class AppInvoice extends LightningElement {
    language;
    src;

    handleLanguageChange(event) {
        this.language = event.detail.language;
        console.log(this.language);
    }

    handleSrcChange(event) {
        this.src = event.detail.src;
    }
}