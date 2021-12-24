import { LightningElement } from 'lwc';

export default class AppContract extends LightningElement {
    language;
    src;
    text;
    description;

    handleLanguageChange(event) {
        this.language = event.detail.language;
        console.log(this.language);
    }

    handleTextChange(event) {
        this.text = event.detail.text;
    }
    
    handleDescriptionChange(event) {
        this.description = event.detail.description;
        console.log(this.description)
    }

    handleSrcChange(event) {
        this.src = event.detail.src;
    }
}