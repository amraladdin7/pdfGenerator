import { LightningElement, api, track, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import jspdf from '@salesforce/resourceUrl/jspdf';
import tradoFont from '@salesforce/resourceUrl/trado';
import InvoiceToGet from '@salesforce/apex/InvoiceGetter.InvoiceToGet';
import logo from '@salesforce/resourceUrl/logo';

export default class GenerateInvoice extends LightningElement {
    
    @track isLoading = false;
    @api text;
    @api language;
    @api tem;
    @track startX = 10;
    invoiceId;
    Invoice;
    orderItems;

    @wire(InvoiceToGet, {invoiceId: '$invoiceId'})
    wiredPdf(result) {
        if(result.data) {
            this.Invoice = result.data;
            this.orderItems = this.Invoice.OrderItems;
            this.secondTableData = this.generateDataValues();
        }
        else {
            console.log(result.error)
        }
    }

    renderedCallback() {
        // this.isLoading = false;
        if(this.jspdfLoaded)
            return;
        this.jspdfLoaded = true;
        Promise.all([loadScript(this,jspdf)])
        .then(() => {
            console.log(this);
            let pathname = window.location.pathname;
            this.invoiceId = pathname.substring(19, 37);
        });
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
                alignment = "right"
                doc.setFontSize(24)
                title = "تهامة القابضة";
                x = 160;
                x1 = 60;
                delivery ="طلب";
                note = "رقم";
                number = this.Invoice.OrderNumber;
                releasedDate = " تاريخ النشر";
                postCode = " الرمز البريدي";
                sampleName = " اسم الطلب";
                sampleFor = 'عينة لـ';
                createdBy = "انشأ من قبل";
                vatNo = "الرقم الضريبى";
                sampleAmount = "اجمالى سعر الطلب ";
                customerName = 'توقيع العميل';
                printName = "اسم العميل";
                dateX = "تاريخ";
                invoiceTo = 'المذكرة الى';
                deliverTo = 'توصيل الى';
                ix = 70;
                dx = 169;
                this.secondTableData = this.generateDataValuesArabic();
                doc.table(12.5,150, this.secondTableData, this.secondTableHeaderArabic, {'autosize':true,'fontSize':0});
                doc.setFont("trado");
                doc.setFontSize(18); 
                let no = 'رقم';
                let qu = 'الكمية';
                let na = 'اسم المنتج';
                let price = 'سعر المنتج';
                doc.text(no ,173,157);
                doc.text(qu ,120,157);
                doc.text(na ,70,157);
                doc.text(price, 25, 157)
                doc.setFontSize(10);
                doc.text(sampleName, x, 50);
                doc.text(this.Invoice.OrderNumber, x - 20, 50)
                doc.text(sampleAmount + this.Invoice.TotalAmount, x1, 255)
                doc.text("$", x1 - 3, 255)
                doc.text(createdBy, x + 12.5, 45, {align: alignment});
                doc.text(this.Invoice.Account.Name, x, 45, {align:alignment})
                var today = new Date();
                var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                doc.text(releasedDate + date, x+12.5, 40, {align: alignment});
                doc.text(vatNo, x, 55);
                if(this.Invoice.VAT_No__c)
                doc.text(this.Invoice.VAT_No__c, x - 10, 55)
                // doc.text(this.parsedData.Name, x, 50)
                // doc.text(this.parsedData.Account__c, x-30, 55)
                // doc.text(this.parsedData.OwnerId, x -30, 60)
                // doc.text(this.parsedData.Total_Amount__c, x1 - 10, 255);
            } else {
                this.startX = 40;
                alignment = "left"
                x = 12.5;
                x1 = 110;
                title = 'Tihama Holding';
                delivery = "ORDER"
                note = "NO.";
                number = this.Invoice.OrderNumber;
                releasedDate = 'Released Date: ';
                sampleName = 'Invoice Name: ';
                createdBy = 'Created to: ';
                vatNo = 'VAT No.';
                sampleAmount = 'Total Order Amount: ' ;
                customerName = 'Customer Signature: ......................................';
                printName = 'Print Name: ...................................';
                dateX = 'Date: ................';
                invoiceTo = 'Invoice to:';
                deliverTo = 'Deliver to:';
                ix = 14;
                dx = 113;
                doc.setFontSize(10);
                doc.text(sampleName + this.Invoice.OrderNumber, x, 50);
                doc.table(12.5,150, this.secondTableData, this.secondTableHeader, {'autosize':true,'fontSize':12})
                doc.text(sampleAmount + this.Invoice.TotalAmount + "$", x1, 255)
                doc.text(createdBy + this.Invoice.Account.Name, x, 45);
                var today = new Date();
                var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                doc.text(releasedDate + date, x, 40, {align: alignment});
                if(this.Invoice.VAT_No__c)
                doc.text(vatNo + this.Invoice.VAT_No__c, x,55)
                else
                doc.text(vatNo, x,55)
                // doc.text(this.parsedData.Name, x, 50)
                // doc.text(this.parsedData.Account__c, x, 55)
                // doc.text(this.parsedData.OwnerId, x, 60)
                // doc.text(this.parsedData.Total_Amount__c, x1 - 10, 255);
                // this.secondTableData = this.generateDataValues();
                // doc.table(12.5,150, this.secondTableData, this.secondTableHeader, {'autosize':true,'fontSize':12})
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
            
            doc.save(this.Invoice.OrderNumber + '.pdf');
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
        for(let i = 0; i<this.orderItems.length; i++){
            console.log(this.orderItems[i]);
            result.push({
                "No.": `${i+1}`,
                "Quantity.": `${this.orderItems[i].Quantity}`,
                "Product Name": `${this.orderItems[i].Product2.Name}`,
                "Unit Price" : `${this.orderItems[i].UnitPrice}` + "$"
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
        for(let i = 0; i<this.orderItems.length; i++){
            result.push({
                "No.": `${i+1}`,
                "Quantity.": `${this.orderItems[i].Quantity}`,
                "Product Name": `${this.orderItems[i].Product2.Name}`,
                "Unit Price" : `${this.orderItems[i].UnitPrice}` +  "$"
            })
        }
            return result;
        } 
        catch(e) {
            console.log(e);
        }
    }
}