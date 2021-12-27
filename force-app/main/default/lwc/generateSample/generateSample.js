import { LightningElement, api, track, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import jspdf from '@salesforce/resourceUrl/jspdf';
import tradoFont from '@salesforce/resourceUrl/trado';
import SampleToGet from '@salesforce/apex/SampleGetter.SampleToGet';
import logo from '@salesforce/resourceUrl/logo';
import UserPermissionsCallCenterAutoLogin from '@salesforce/schema/User.UserPermissionsCallCenterAutoLogin';

export default class GenerateSample extends LightningElement {
    @track isLoading = false;
    @api text;
    @api language;
    @api tem;
    @track startX = 10;
    sampleId;
    Sample;
    sampleProducts;

    @wire(SampleToGet, {sampleId: '$sampleId'})
    wiredPdf(result) {
        if(result.data) {
            this.Sample = result.data;
            this.sampleProducts = this.Sample.Sample_Products__r;
            console.log(this.sampleProducts)
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
            this.sampleId = pathname.substring(23, 41);
        });
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
                delivery ="نموذج";
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
                invoiceTo = 'النموذج الى';
                deliverTo = 'توصيل الى';
                ix = 70;
                dx = 169;
                // doc.setFontSize(18)
                // let no = 'رقم';
                // let na = 'اسم المنتج';
                // doc.text(no ,173,157);
                // doc.text(na ,70,157);
                alignment = "right"
                doc.setFontSize(10);
                doc.text(sampleName, x + 20, 45, {align: alignment});
                doc.text(this.Sample.Name, x, 45, {align: alignment});
                doc.text(createdBy, x + 20, 50, {align: alignment});
                doc.text(this.Sample.Account__r.Name, x, 50, {align:alignment})
                var today = new Date();
                var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                doc.text(releasedDate + " " + date, x + 20, 40, {align:alignment});
                doc.table(12.5,150, this.secondTableData, this.secondTableHeaderArabic, {'autosize':true,'fontSize':0});
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
                createdBy = 'Created to: ';
                vatNo = 'VAT No.';
                sampleAmount = 'Total Sample Amount: ' ;
                customerName = 'Customer Signature: ......................................';
                printName = 'Print Name: ...................................';
                dateX = 'Date: ................';
                invoiceTo = 'Sample to:';
                deliverTo = 'Deliver to:';
                ix = 14;
                dx = 113;
                alignment = "left"
                doc.setFontSize(10);
                doc.text(sampleName + " " + this.Sample.Name, x, 45);
                doc.text(createdBy + this.Sample.Account__r.Name, x, 50);
                var today = new Date();
                var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                doc.text(releasedDate + " " + date, x, 40, {align:alignment});
                doc.table(12.5,150, this.secondTableData, this.secondTableHeader, {'autosize':true,'fontSize':12})
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
            
            doc.save(this.Sample.Name + '.pdf');
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
        for(let i = 0; i<this.sampleProducts.length; i++){
            console.log(this.sampleProducts[i]);
            result.push({
                "No.": `${i+1}`,
                "Quantity.": `${this.sampleProducts[i].Quantity__c}`,
                "Product Name": `${this.sampleProducts[i].Product__r.Name}`
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
        for(let i = 0; i<this.sampleProducts.length; i++){
            result.push({
                "No.": `${i+1}`,
                "Quantity.": `${this.sampleProducts[i].Quantity__c}`,
                "Product Name": `${this.sampleProducts[i].Product__r.Name}`
            })
        }
            return result;
        } 
        catch(e) {
            console.log(e);
        }
    }
}