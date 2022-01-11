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
            //Getting ISBNs & Quantities
            //Format: ISBN_Quantity_Discount%
            //Format: ISBN_Quantity_
            //_ is a space 
            let tmp = "";
            const splittedtext = this.text.split('\n');
            for(let i = 0; i<splittedtext.length; i++){
                for(let j = 0; j<splittedtext[i].length; j++)
                if(splittedtext[i][j] != " " && splittedtext[i][j] != "%"){
                    tmp += splittedtext[i][j];
                }
                else if(tmp.length == 13){
                    this.ISBNs.push(tmp);
                    tmp = "";
                }
                else if(splittedtext[i][j] == " "){
                    this.Quantities.push(tmp);
                    tmp = "";
                }
                else if(splittedtext[i][j] == "%"){
                    this.Discounts.push(tmp);
                    tmp = "";
                }
            }

            //Getting the Products with matching ISBNs
            let ISBNCounter = 0;
            this.ISBNs.forEach((element)=>{
                this.ProductsData.push(this.Products.find(isbn => isbn.ProductCode == element))
            })
            // for(let i = 0; i<this.Products.length; i++){
            //     if(this.Products[i].ProductCode == this.ISBNs[ISBNCounter] && this.Products[i].ProductCode){
            //         this.ProductsData.push(this.Products[i]);
            //         ISBNCounter ++;
            //     }
            // }
            console.log(this.ProductsData);
    }
    catch(e){
        console.log(e);
    }
    }
}