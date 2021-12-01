import { LightningElement, track } from 'lwc';

export default class LanguageSelector extends LightningElement {
    @track value;

    get options() {
        return [
            { label: 'Arabic', value: 'Arabic'},
            { label: 'English', value: 'English'}
        ];
    }

    handleChange(event) {
        this.value = event.target.value;
        console.log(this.value);
        this.dispatchEvent(new CustomEvent('languagechange', {detail:{language: this.value}}));
    }
}