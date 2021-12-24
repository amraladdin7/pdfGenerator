import { LightningElement, api, track, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import jspdf from '@salesforce/resourceUrl/jspdf';
import tradoFont from '@salesforce/resourceUrl/trado';
import SampleToGet from '@salesforce/apex/SampleGetter.SampleToGet';
import logo from '@salesforce/resourceUrl/logo';

export default class GenerateSample extends LightningElement {
    @track isLoading = false;
    @api text;
    @api language;
    @api tem;
    @track startX = 10;
    sampleId;
    Sample;

    @wire(SampleToGet, {sampleId: '$sampleId'})
    wiredPdf(result) {
        if(result.data) {
            this.Sample = result.data;
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
            this.sampleId = pathname.substring(31, 49);
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
                delivery ="فاتورة";
                note = "رقم";
                number = this.Sample.Name;
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
                delivery = "SAMPLE"
                note = "NO.";
                number = this.Sample.Name;
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
                // this.secondTableData = this.generateDataValues();
                // doc.table(12.5,150, this.secondTableData, this.secondTableHeader, {'autosize':true,'fontSize':12})
            }

            doc.setFont("trado");

            doc.setFontSize(24)
            doc.text(title, x, 35);
            doc.text(delivery, x1, 35, {'maxWidth':50});
            var img = new Image();
            img.src = logo;
            doc.setFontSize(20);
            doc.addImage(img, 'png', 150,0,45,25);
            doc.text(note, x1, 42, {'maxWidth':50});
            doc.text(number, x1, 54, {'maxWidth':50});
            
            doc.setFontSize(10);
            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            doc.text(releasedDate + " " + date, x + 10, 40);
            doc.text(postCode, x + 10, 45);
            doc.text(sampleName + " " + this.Sample.Name, x + 10, 50);
            doc.text(sampleFor, x + 10, 55);
            doc.text(createdBy, x + 10, 60);
            doc.text(vatNo, x + 10, 65);
            doc.rect(12.5, 70, 70,50);
            doc.text(invoiceTo, ix, 75, {"maxWidth":45})
            doc.rect(110, 70, 70, 50);
            doc.text(deliverTo, dx, 75, {"maxWidth":45});

            // doc.table(12.5,145, this.firstTableData, this.firstTableHeader, {'autosize':true,'fontSize':12})
            doc.text(sampleAmount + " " + this.Sample.List_Price__c, x1, 255)
            // doc.text(dots, x1-30, 255);
            doc.text(customerName, x + 20, 275, {'maxWidth':150});
            // doc.text(dots, x-10, 275);
            doc.text(printName, x + 20, 285, {'maxWidth':150});
            // doc.text(dots, x - 10, 285);
            doc.text(dateX, x1, 285, {'maxWidth':150})
            // doc.text(dots, x1-30, 285);
            
            doc.save('Sample.pdf');
            setTimeout(() =>{
                this.isLoading = false;
            }, 500);
            // this.isLoading = false;
        }
        catch(error){
            console.log(error);
        }
    }
}