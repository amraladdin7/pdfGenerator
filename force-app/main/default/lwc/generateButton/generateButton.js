import { LightningElement, api, track, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import jspdf from '@salesforce/resourceUrl/jspdf';
import tradoFont from '@salesforce/resourceUrl/trado';
import PdfToGenerate from '@salesforce/apex/PdfGeneratorGetter.PdfToGenerate';
import QuoteToGenerate from '@salesforce/apex/QuoteGetter.QuoteToGenerate';
import logo from '@salesforce/resourceUrl/logo';

export default class GeneratePDF extends LightningElement {
   
    // @api disabled;
    @track isLoading = false;
    @api text;
    @api language;
    @api tem;
    @track startX = 10;
    genId='';
    Generator;
    Invoice;
    Quote;
    quoteId;
    QuoteLineItems;

    @wire(PdfToGenerate, {genId: '$genId'})
    wiredPdf(result) {
        if(result.data) {
            this.Generator = result.data[0];
            this.pdfImage = this.Generator.Image__c;
            console.log(this.Generator);
            this.Invoice = this.Generator.Invoice__c;
            this.quoteId = this.Generator.Quote__c;
            console.log(this.quoteId);
            let span = document.createElement('span');
            span.innerHTML = this.pdfImage;
            this.finalImage = span.querySelector('img');
            console.log(this.finalImage);
        }
    }

    @wire(QuoteToGenerate, {quoteId: '$quoteId'})
    wiredQuote(result) {
        if(result.data) {
            console.log(result.data);
            this.Quote = result.data;
            this.QuoteLineItems = this.Quote.QuoteLineItems;
            console.log('Quote: ', this.Quote);
            console.log('Items: ' + this.QuoteLineItems);
            this.secondTableData = this.generateDataValues();
            console.log(this.secondTableData);
        } else {
            console.log(result.error);
        }
    }

    secondTableHeader = [{id:'No.', name:'No.', prompt:'No.', width:20, align:'center', padding:0},
                        {id:'Quantity.', name:'Quantity.', prompt:'Quantity.', width:105, align:'center', padding:0},
                        {id:'Product Name', name:'Product Name', prompt:'Product Name', width:105, align:'center', padding:0}
                    ];
    secondTableHeaderArabic = [{id:'Product Name', name:'Product Name', prompt:'           ', width:105, align:'center', padding:0},
                    {id:'Quantity.', name:'Quantity.', prompt:'          ', width:105, align:'center', padding:0},
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
            console.log(this);
            let pathname = window.location.pathname;
            this.genId = pathname.substring(30, 48);
            console.log(this.genId);
        });
    }

    generateContract(){
        try{
            
            doc.save('table.pdf');
        }
        catch(error){
            console.log(error);
        }
    }

    generate() {
        this.isLoading = true;
        try{
            const {jsPDF} = window.jspdf;
            const doc = new jsPDF({
                // encryption:{
                //     userPassword: "user",
                //     ownerPassword: "owner",
                //     userPermission: ["print", "modify", "copy", "annot-forms"]
                // },
                format: "a4"
            });
            
            if(this.tem == 'Contract' && this.language == 'English'){
                doc.setFontSize(24);
                doc.text("CONTRACT TEMPLATE",55,35);
                doc.setFontSize(10);
                let firstparagraph = "  This contract in entered into by and between __________________, [AN INDIVIDUAL, OR TYPE OF BUSINESS ENTITY] ('First Party'), and ___________________, [AN INDIVIDUAL, OR TYPE OF BUSINESS ENTITY] ('Second Party'). The term of this Agreemant shall begin on _______________ and shall continue through its termination date of ________________.";
                doc.text(firstparagraph, 20, 50, {maxWidth:170})
                doc.text("The specific terms of this contract are as follows:", 25, 75)
                let secondparagraph = "  In consideration of the mutual promises set forth herein, the First Party convenants and agrees it shall __________"
                let underscores = "______________________________________________________________________________________________________________________________________________________________________"
                doc.text(secondparagraph + underscores, 25, 130, {maxWidth:170})
                doc.text("  The Second party covenants and agrees that it shall __________________________________________________________"+underscores, 25, 150, {maxWidth:170})
                let thirdparagraph = "  This contract may not be modified in any manner unless in writing and signed by both parties. This document and any attachments hereto constitute the entire agreement between the parties. This contract shall be binding upon the parties, their successors, heirs and assigns shall be enforced under the laws of the State of ______________.";
                doc.text(thirdparagraph, 25, 175, {maxWidth:170})
                doc.text("______________________________", 40, 200)
                doc.text("(Signature)", 50, 205)
                doc.text("______________________________", 110, 200)
                doc.text("(Signature)", 120, 205)
                doc.text("______________________________", 40, 215)
                doc.text("(Printed Name)", 50, 220)
                doc.text("______________________________", 110, 215)
                doc.text("(Printed Name)", 120, 220)
                doc.text("______________________________", 40, 230)
                doc.text("(Address)", 50, 235)
                doc.text("______________________________", 110, 230)
                doc.text("(Address)", 120, 235)
                doc.text("Date: ________________, 20___", 40, 250)
                doc.text("Date: ________________, 20___", 110, 250)
                doc.save('contract.pdf')
            }
            if(this.tem == 'Contract' && this.language == 'Arabic'){
                doc.addFont(tradoFont, "trado", "normal");
                doc.setFont('trado')
                doc.setFontSize(24);
                doc.text("نموذج العقد",110,35);
                doc.setFontSize(14);
                let underscore = "____________"
                let firstparagraph = "تم إبرام هذا العقد بين __________________، و ___________________ . تبدأ مدة هذه الاتفاقية في _______________ وتستمر حتى تاريخ انتهائها في";
                doc.text(firstparagraph, 180, 50, {maxWidth:170, align:"right"})
                doc.text(underscore, 50, 55.5)
                let conditions = "الشروط المحددة لهذا العقد هي كما يلي"
                doc.text(conditions, 180, 70, {align:"right"})
                let secondparagraph = "بالنظر إلى الوعود المتبادلة المنصوص عليها في هذه الوثيقة ، يقر الطرف الأول ويوافق على ذلك"
                let underscores = "______________________________________________________________________________________________________________________________________________________________________"
                doc.text(secondparagraph + underscores, 180, 130, {maxWidth:170, align:"right"})
                let secondparty = "                                                                                     يتعهد الطرف الثاني ويوافق على ذلك"
                doc.text(secondparty + underscores, 180, 160, {maxWidth:170, align:"right"})
                let thirdparagraph = "لا يجوز تعديل هذا العقد بأي شكل من الأشكال إلا إذا كان مكتوبًا وموقعًا من قبل الطرفين. تشكل هذه الوثيقة وأي مرفقات بها الاتفاقية الكاملة بين الطرفين. يجب أن يكون هذا العقد ملزمًا للأطراف وخلفائهم وورثتهم والمتنازل لهم بموجب قوانين ولاية";
                doc.text(thirdparagraph, 180, 185, {maxWidth:170, align:"right"})
                doc.text(underscore, 65, 197)
                doc.text("__________________________", 40, 205)
                doc.text("(توقيع)", 80, 210, {align:"right"})
                doc.text("__________________________", 110, 205)
                doc.text("(توقيع)", 140, 210, {align:"right"})
                doc.text("__________________________", 40, 220)
                doc.text("(الاسم)", 80, 225, {align:"right"})
                doc.text("__________________________", 110, 220)
                doc.text("(الاسم)", 140, 225, {align:"right"})
                doc.text("__________________________", 40, 235)
                doc.text("(العنوان)", 80, 240, {align:"right"})
                doc.text("__________________________", 110, 235)
                doc.text("(العنوان)", 140, 240, {align:"right"})
                doc.text("التاريخ", 180, 260, {align:"right"})
                doc.text(underscore, 165, 260, {align:"right"})
                doc.text("التاريخ", 80, 260, {align:"right"})
                doc.text(underscore, 65, 260, {align:"right"})
                doc.save('contract.pdf')
            }
            if(this.template == undefined) {
                this.template = 'Invoice';
            }
            if(this.language == undefined) {
                this.language = 'Arabic';
            }

            let title, delivery, note, number = "";
            let releasedDate, postCode, sampleName, sampleFor, dateX = "";
            let createdBy, vatNo, sampleAmount, customerName, printName = "";
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
                delivery =(this.tem =='Invoice') ? "فاتورة" : "مذكرة";
                note = "رقم";
                number = this.Quote.Name;
                releasedDate = " تاريخ النشر";
                postCode = " الرمز البريدي";
                sampleName = " اسم النموذج";
                sampleFor = 'عينة لـ';
                createdBy = "انشأ من قبل";
                vatNo = "الرقم الضريبى";
                sampleAmount = "اجمالى كمية النموذج";
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
                doc.text(no ,173,157);
                doc.text(qu ,127,157);
                doc.text(na ,43,157);
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
                postCode = 'Postcode';
                sampleName = 'Sample Name: ';
                sampleFor = 'Sample for: ';
                createdBy = 'Created by: ';
                vatNo = 'VAT No.';
                sampleAmount = 'Total Sample Amount: ' ;
                customerName = 'Customer Signature: ......................................';
                printName = 'Print Name: ...................................';
                dateX = 'Date: ................';
                invoiceTo = 'Invoice to:';
                deliverTo = 'Deliver to:';
                ix = 14;
                dx = 113;
                // doc.text(this.parsedData.Name, x, 50)
                // doc.text(this.parsedData.Account__c, x, 55)
                // doc.text(this.parsedData.OwnerId, x, 60)
                // doc.text(this.parsedData.Total_Amount__c, x1 - 10, 255);
                this.secondTableData = this.generateDataValues();
                doc.table(12.5,150, this.secondTableData, this.secondTableHeader, {'autosize':true,'fontSize':12})
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
            doc.text(releasedDate, x + 20, 40);
            doc.text(postCode, x + 20, 45);
            doc.text(sampleName, x + 20, 50);
            doc.text(sampleFor, x + 20, 55);
            doc.text(createdBy, x + 20, 60);
            doc.text(vatNo, x + 20, 65);
            doc.rect(12.5, 70, 70,50);
            doc.text(invoiceTo, ix, 75, {"maxWidth":45})
            doc.rect(110, 70, 70, 50);
            doc.text(deliverTo, dx, 75, {"maxWidth":45});

            // doc.table(12.5,145, this.firstTableData, this.firstTableHeader, {'autosize':true,'fontSize':12})
            doc.text(sampleAmount, x1, 255)
            // doc.text(dots, x1-30, 255);
            doc.text(customerName, x + 20, 275, {'maxWidth':150});
            // doc.text(dots, x-10, 275);
            doc.text(printName, x + 20, 285, {'maxWidth':150});
            // doc.text(dots, x - 10, 285);
            doc.text(dateX, x1, 285, {'maxWidth':150})
            // doc.text(dots, x1-30, 285);
            
            var currText = this.text;
            var currX = this.startX;

            doc.text(currText, currX, 250, {'maxWidth':175});
            console.log(this.finalImage);
            doc.addImage(this.finalImage, 'png', 150,0,45,25);
            doc.save('table.pdf');
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
                "Product Name": `${this.QuoteLineItems[i].English_Name__c}`,
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
                "Product Name": ` `
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