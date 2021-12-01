import { LightningElement, track } from 'lwc';

export default class InputText extends LightningElement {
    @track text;

    handleChange(event) {
        this.text = event.target.value;
        console.log(this.text);
        this.dispatchEvent(new CustomEvent('textchange', {detail: {text:this.text}}));
    }
}