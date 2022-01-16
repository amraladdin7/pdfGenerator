import { LightningElement } from 'lwc';

export default class AppSample extends LightningElement {
    language;
    src;
    englishText;
    arabicText;

    handleEnglishTextChange(event){
        this.englishText = event.detail.text;
    }
    handleArabicTextChange(event){
        this.arabicText = event.detail.text;
    }

    handleLanguageChange(event) {
        this.language = event.detail.language;
        console.log(this.language);
    }

    handleSrcChange(event) {
        this.src = event.detail.src;
    }
}