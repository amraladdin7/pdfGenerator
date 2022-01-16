import { LightningElement, track } from 'lwc';

export default class EnglishPaymentTerms extends LightningElement {
    @track englishText;

    handleChange(event) {
        this.englishText = event.target.value;
        this.dispatchEvent(new CustomEvent('textchange', {detail: {text:this.englishText}}));
    }
}