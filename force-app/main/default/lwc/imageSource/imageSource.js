import { LightningElement, track } from 'lwc';

export default class ImageSource extends LightningElement {
    @track src;

    handleChange(event) {
        this.src = event.target.value;
        this.dispatchEvent(new CustomEvent('srcchange', {detail: {src: this.src}}));
    }
}