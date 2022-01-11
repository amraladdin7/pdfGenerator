import { LightningElement, track, api, wire } from 'lwc';
import ProductsToGet from '@salesforce/apex/ProductsGetter.ProductsToGet';

export default class ListViewProducts extends LightningElement {

    @track isLoading = false;
    text;
    Products;

    handleTextChange(event) {
        this.text = event.detail.text;
    }

    @wire(ProductsToGet, {})
    wiredPdf(result){
        if(result.data){
            this.Products = result.data;
            console.log(this.Products);
        }
        else {
            console.log(result.error)
        }
    }

    ISBNs = [];
    Quantities = [];
    Discounts = [];
    ProductsData = [];

    search(){
        try{
            console.log("search")
            //Getting ISBNs & Quantities
            //Format ISBN Quantity Discount%
            let tmp = "";
            console.log(this.text.length)
            for(let i = 0; i<this.text.length; i++){
                if(this.text[i] != " " && this.text[i] != "%"){
                    tmp += this.text[i];
                    console.log(tmp);
                }
                else if(tmp.length == 13){
                    this.ISBNs.push(tmp);
                    console.log(tmp);
                    tmp = "";
                }
                else if(this.text[i] == " "){
                    this.Quantities.push(tmp);
                    console.log(tmp)
                    tmp = "";
                }
                else if(this.text[i] == "%"){
                    this.Discounts.push(tmp);
                    tmp = "";
                }
            }
            console.log(this.ISBNs + " " + this.Quantities + " " + this.Discounts);
            //Getting the Products with matching ISBNs
            let ISBNCounter = 0;
            for(let i = 0; i<this.Products.length; i++){
                if(this.Products[i].ProductCode == this.ISBNs[ISBNCounter] && this.Products[i].ProductCode){
                    console.log(this.Products[i].ProductCode == this.ISBNs[ISBNCounter]);
                    this.ProductsData.push(this.Products[i]);
                    ISBNCounter ++;
                }
            }
            console.log(this.ProductsData);
    }
    catch(e){
        console.log(e);
    }
    }
}