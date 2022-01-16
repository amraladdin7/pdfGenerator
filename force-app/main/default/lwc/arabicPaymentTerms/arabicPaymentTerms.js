import { LightningElement, track } from 'lwc';

export default class ArabicPaymentTerms extends LightningElement {
    @track arabicText;

    handleChange(event) {
        this.arabicText = event.target.value;
        this.dispatchEvent(new CustomEvent('textchange', {detail: {text:this.arabicText}}));
    }
}