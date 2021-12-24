import { LightningElement, track } from 'lwc';

export default class Description extends LightningElement {
    @track description;

    handleChange(event) {
        this.description = event.target.value;
        console.log(this.description);
        this.dispatchEvent(new CustomEvent('descriptionchange', {detail: {description:this.description}}));
    }
}