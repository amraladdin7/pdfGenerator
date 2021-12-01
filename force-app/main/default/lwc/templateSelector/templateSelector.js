import { LightningElement, track } from 'lwc';

export default class LanguageSelector extends LightningElement {
    @track value;

    get options() {
        return [
            { label: 'Invoice', value: 'Invoice'},
            { label: 'Quote', value: 'Quote'}
        ];
    }

    handleChange(event) {
        this.value = event.target.value;
        console.log(this.value);
        this.dispatchEvent(new CustomEvent('templatechange', {detail:{tem: this.value}}));
    }
}