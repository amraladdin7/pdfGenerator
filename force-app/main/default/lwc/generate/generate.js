import { LightningElement, api, track, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import jspdf from '@salesforce/resourceUrl/jspdf';
import tradoFont from '@salesforce/resourceUrl/trado';
import QuoteToGenerate from '@salesforce/apex/QuoteGetter.QuoteToGenerate';
import logo from '@salesforce/resourceUrl/logo';

export default class Generate extends LightningElement {
    
    // @api disabled;
    @track isLoading = false;
    @api language;
    @api tem;
    @track startX = 10;
    Quote;
    quoteId;
    QuoteLineItems;

    @wire(QuoteToGenerate, {quoteId: '$quoteId'})
    wiredQuote(result) {
        if(result.data) {
            this.Quote = result.data;
            this.QuoteLineItems = this.Quote.QuoteLineItems;
            this.secondTableData = this.generateDataValues();
            console.log(this.Quote)
        } else {
            console.log(result.error);
        }
    }

    secondTableHeader = [{id:'No.', name:'No.', prompt:'No.', width:20, align:'center', padding:0},
                        {id:'Quantity.', name:'Quantity.', prompt:'Quantity.', width:70, align:'center', padding:0},
                        {id:'Product Name', name:'Product Name', prompt:'Product Name', width:70, align:'center', padding:0},
                        {id:'Unit Price',name:'Unit Price', prompt:'Unit Price', width:70, align:'center', padding:0}
                    ];
    secondTableHeaderArabic = [{id:'Unit Price',name:'Unit Price', prompt:'          ', width:70, align:'center', padding:0},
                    {id:'Product Name', name:'Product Name', prompt:'           ', width:70, align:'center', padding:0},
                    {id:'Quantity.', name:'Quantity.', prompt:'          ', width:70, align:'center', padding:0},
                    {id:'No.', name:'No.', prompt:'     ', width:20, align:'center', padding:0}  
                ];
    
    secondTableData = [];

    renderedCallback() {
        // this.isLoading = false;
        if(this.jspdfLoaded)
            return;
        this.jspdfLoaded = true;
        Promise.all([loadScript(this,jspdf)])
        .then(() => {
            let pathname = window.location.pathname;
            console.log(pathname)
            this.quoteId = pathname.substring(19, 37);
            console.log(this.quoteId);
        });
    }


    generate() {
        this.isLoading = true;
        try{
            const {jsPDF} = window.jspdf;
            const doc = new jsPDF({
                format: "a4"
            });
            
            if(this.language == undefined) {
                this.language = 'Arabic';
            }

            let title, delivery, note, number = "";
            let releasedDate, postCode, sampleName, sampleFor, dateX = "";
            let createdBy, vatNo, sampleAmount, customerName, printName, alignment = "";
            let x,x1,ix,dx;
            let invoiceTo, deliverTo;

            if(this.language == "Arabic"){
                doc.addFont(tradoFont, "trado", "normal");
                doc.setFont("trado");
                this.startX = 150; 
                doc.setFontSize(24)
                title = "تهامة القابضة";
                x = 150;
                x1 = 60;
                delivery = "مذكرة";
                note = "رقم";
                number = this.Quote.Name;
                releasedDate = " تاريخ النشر";
                sampleName = " اسم المذكرة";
                createdBy = "انشأ من قبل";
                vatNo = "الرقم الضريبى";
                sampleAmount = " اجمالى كمية المذكرة";
                customerName = 'توقيع العميل';
                printName = "اسم العميل";
                dateX = "تاريخ";
                invoiceTo = 'المذكرة الى';
                deliverTo = 'توصيل الى';
                ix = 70;
                dx = 169;
                this.secondTableData = this.generateDataValuesArabic();
                doc.table(12.5,150, this.secondTableData, this.secondTableHeaderArabic, {'autosize':true,'fontSize':0});
                this.generateDescription(doc);
                doc.setFontSize(18); 
                doc.setFont("trado");
                let no = 'رقم';
                let qu = 'الكمية';
                let na = 'اسم المنتج';
                let price = 'سعر المنتج';
                doc.text(no ,173,157);
                doc.text(qu ,120,157);
                doc.text(na ,70,157);
                doc.text(price, 25, 157)
                alignment = "right";
                doc.setFontSize(10);
                doc.text(sampleName, x + 5, 45, {align: alignment});
                doc.text(this.Quote.Name, x - 10, 45, {align: alignment});
                doc.text(sampleAmount + this.Quote.TotalPrice, x1, 255)
                doc.text("$", x1, 255)
                doc.text(createdBy, x + 5, 50, {align: alignment});
                doc.text(this.Quote.Account.Name, x - 10, 50, {align:alignment})
                
                if(this.Quote.VAT_No__c){
                    doc.text(vatNo, x + 5, 55, {align: alignment});
                    doc.text(this.Quote.VAT_No__c, x - 10, 55, {align:alignment})
                }
                // doc.text(this.parsedData.Name, x, 50)
                // doc.text(this.parsedData.Account__c, x-30, 55)
                // doc.text(this.parsedData.OwnerId, x -30, 60)
                // doc.text(this.parsedData.Total_Amount__c, x1 - 10, 255);
            } else {
                this.startX = 40;
                x = 12.5;
                x1 = 110;
                title = 'Tihama Holding';
                delivery = (this.tem =='Invoice') ? "INVOICE" : "QUOTE";
                note = "NO.";
                number = this.Quote.Name;
                releasedDate = 'Released Date: ';
                sampleName = 'Quote Name: ';
                createdBy = 'Created to: ';
                vatNo = 'VAT No.';
                sampleAmount = 'Total Quote Amount: ' ;
                customerName = 'Customer Signature: ......................................';
                printName = 'Print Name: ...................................';
                dateX = 'Date: ................';
                invoiceTo = 'Invoice to:';
                deliverTo = 'Deliver to:';
                ix = 14;
                dx = 113;
                alignment = "left";
                // doc.text(this.parsedData.Name, x, 50)
                // doc.text(this.parsedData.Account__c, x, 55)
                // doc.text(this.parsedData.OwnerId, x, 60)
                // doc.text(this.parsedData.Total_Amount__c, x1 - 10, 255);
                this.secondTableData = this.generateDataValues();
                doc.setFontSize(10);
                doc.text(sampleName + this.Quote.Name, x + 5, 45, {align: alignment});
                doc.table(12.5,150, this.secondTableData, this.secondTableHeader, {'autosize':true,'fontSize':12})
                doc.text(sampleAmount + this.Quote.TotalPrice + "$", x1, 255)
                doc.text(createdBy + this.Quote.Account.Name, x + 5, 50, {align: alignment});
                if(this.Quote.VAT_No__c)
                doc.text(vatNo + this.Quote.VAT_No__c, x + 5, 55, {align: alignment});
               
            }

            doc.setFont("trado");

            doc.setFontSize(24)
            doc.text(title, x, 35);
            doc.text(delivery, x1, 35, {'maxWidth':50});
            var img = new Image();
            img.src = logo;
            doc.addImage(img, 'png', 150,0,45,25);
            doc.text(note, x1, 42, {'maxWidth':50});
            doc.text(number, x1, 54, {'maxWidth':50});
            
            doc.setFontSize(10);
            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            doc.text(releasedDate + date, x + 5, 40, {align: alignment});
           
            
            doc.rect(12.5, 70, 70,50);
            doc.text(invoiceTo, ix, 75, {"maxWidth":45})
            doc.rect(110, 70, 70, 50);
            doc.text(deliverTo, dx, 75, {"maxWidth":45});

            // doc.table(12.5,145, this.firstTableData, this.firstTableHeader, {'autosize':true,'fontSize':12})
            
            // doc.text(dots, x1-30, 255);
            doc.text(customerName, x + 20, 275, {'maxWidth':150});
            // doc.text(dots, x-10, 275);
            doc.text(printName, x + 20, 285, {'maxWidth':150});
            // doc.text(dots, x - 10, 285);
            doc.text(dateX, x1, 285, {'maxWidth':150})
            // doc.text(dots, x1-30, 285);
            
            doc.save(this.Quote.Name + '.pdf');
            setTimeout(() =>{
                this.isLoading = false;
            }, 500);
            // this.isLoading = false;
        }
        catch(error){
            console.log(error);
        }
    }

    generateDataValues(){
        try {
            var result = [];
        for(let i = 0; i<this.QuoteLineItems.length; i++){
            console.log(this.QuoteLineItems[i]);
            result.push({
                "No.": `${i+1}`,
                "Quantity.": `${this.QuoteLineItems[i].Quantity}`,
                "Product Name": `${this.QuoteLineItems[i].Product2.Name}`,
                "Unit Price" : `${this.QuoteLineItems[i].ListPrice}` + "$"
            })
        }
            return result;
        } 
        catch(e) {
            console.log(e);
        }
    }
    generateDataValuesArabic(){
        try {
            var result = [];
        for(let i = 0; i<this.QuoteLineItems.length; i++){
            result.push({
                "No.": `${i+1}`,
                "Quantity.": `${this.QuoteLineItems[i].Quantity}`,
                "Product Name": `${this.QuoteLineItems[i].Product2.Name}`,
                "Unit Price" : `${this.QuoteLineItems[i].ListPrice}` + "$"
            })
        }
            return result;
        } 
        catch(e) {
            console.log(e);
        }
    }
    generateDescription(context) {
        let descriptionYPosition = 167;
        context.setFont("trado");
        context.setFontSize(14);
        for(let i = 0; i<this.QuoteLineItems.length; i++) { 
            if(this.QuoteLineItems[i].Description)
            context.text(this.QuoteLineItems[i].Description, 43, descriptionYPosition);
            descriptionYPosition += 11;
        }
    }
}