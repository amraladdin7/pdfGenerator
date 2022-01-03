import { LightningElement } from 'lwc';

export default class AppContract extends LightningElement {
    src;
    text;
    description;

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