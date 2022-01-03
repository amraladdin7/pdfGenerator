import { LightningElement, api, track, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import jspdf from '@salesforce/resourceUrl/jspdf';
import tradoFont from '@salesforce/resourceUrl/trado';
import QuoteToGenerate from '@salesforce/apex/QuoteGetter.QuoteToGenerate';
import tihamaLogo from '@salesforce/resourceUrl/tihamaLogo';
import harcourt from '@salesforce/resourceUrl/harcourt';

export default class GenerateNewQuote extends LightningElement {
    @track isLoading = false;
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
            this.tableData = this.generateTableData();
        } else {
            console.log(result.error);
        }
    }

    renderedCallback() {
        if(this.jspdfLoaded)
            return;
        this.jspdfLoaded = true;
        Promise.all([loadScript(this,jspdf)])
        .then(() => {
            let pathname = window.location.pathname;
            this.quoteId = pathname.substring(19, 37);
        });
    }

    tableHeader = [{id:'SN', name:'SN', prompt:'SN', width:20, align:'center', padding:0},
                {id:'ISBN', name:'ISBN', prompt:'ISBN', width:30, align:"center", padding:0},
                {id:'Edition', name:'Edition', prompt:'Edition', width:30, align:'center', padding:0},
                {id:'Description', name:'Description', prompt:'Description', width:45, align:'center', padding:0},
                {id:'Unit', name:'Unit', prompt:'Unit', width:25, align:'center', padding:0},
                {id:'Publisher', name:'Publisher', prompt:'Publisher', width:35, align:'center', padding:0},
                {id:'Grade', name:'Grade', prompt:'Grade', width:25, align:'center', padding:0},
                {id:'Qty', name:'Qty', prompt:'Qty', width:20, align:'center', padding:0},
                {id:'KSA Price List', name:'KSA Price List', prompt:'KSA Price List', width:45, align:'center', padding:0},
                {id:'Discount %', name:'Discount %', prompt:'Discount %', width:30, align:'center', padding:0},
                {id:'Net Price', name:'Net Price', prompt:'Net Price', width:35, align:'center', padding:0},
                {id:'Amount SR', name:'Amount SR', prompt:'Amount SR', width:35, align:'center', padding:0}];

    tableHeaderArabic = [{id:'SN', name:'SN', prompt:'   ', width:20, align:'center', padding:0},
                    {id:'ISBN', name:'ISBN', prompt:'   ', width:30, align:"center", padding:0},
                    {id:'Edition', name:'Edition', prompt:'   ', width:30, align:'center', padding:0},
                    {id:'Description', name:'Description', prompt:'   ', width:45, align:'center', padding:0},
                    {id:'Unit', name:'Unit', prompt:'   ', width:25, align:'center', padding:0},
                    {id:'Publisher', name:'Publisher', prompt:'   ', width:35, align:'center', padding:0},
                    {id:'Grade', name:'Grade', prompt:'   ', width:25, align:'center', padding:0},
                    {id:'Qty', name:'Qty', prompt:'   ', width:20, align:'center', padding:0},
                    {id:'KSA Price List', name:'KSA Price List', prompt:'   ', width:45, align:'center', padding:0},
                    {id:'Discount %', name:'Discount %', prompt:'   ', width:30, align:'center', padding:0},
                    {id:'Net Price', name:'Net Price', prompt:'   ', width:35, align:'center', padding:0},
                    {id:'Amount SR', name:'Amount SR', prompt:'   ', width:35, align:'center', padding:0}];

    tableData = []
    height = 126.5;

    generateTableData(){
        try{
            let result = [];
            for(let i = 0; i<this.QuoteLineItems.length; i++){
                result.push({
                    "SN":`${i+1}`,
                    "ISBN": this.QuoteLineItems[i].Product2.ISBN__c == undefined ? ` ` : `${this.QuoteLineItems[i].Product2.ISBN__c}`,
                    "Edition": this.QuoteLineItems[i].Product2.Edition__c == undefined ? ` ` : `${this.QuoteLineItems[i].Product2.Edition__c}`,
                    "Description": this.QuoteLineItems[i].Description == undefined ? ` ` : `${this.QuoteLineItems[i].Description}`,
                    "Unit":` `,
                    "Publisher": this.QuoteLineItems[i].Product2.Publisher__c == undefined ? ` ` : `${this.QuoteLineItems[i].Product2.Publisher__c}`,
                    "Grade": this.QuoteLineItems[i].Product2.Grade__c == undefined ? ` ` : `${this.QuoteLineItems[i].Product2.Grade__c}`,
                    "Qty":  this.QuoteLineItems[i].Quantity == undefined ? ` ` : `${this.QuoteLineItems[i].Quantity}`,
                    "KSA Price List": this.QuoteLineItems[i].Subtotal == undefined ? ` ` : `${this.QuoteLineItems[i].Subtotal}` + "SR",
                    "Discount %": this.QuoteLineItems[i].Discount == undefined ? ` ` : `${this.QuoteLineItems[i].Discount}` + "%",
                    "Net Price":this.QuoteLineItems[i].ListPrice == undefined ? ` ` : `${this.QuoteLineItems[i].ListPrice}` + "SR",
                    "Amount SR":this.QuoteLineItems[i].TotalPrice == undefined ? ` ` : `${this.QuoteLineItems[i].TotalPrice}` + "SR"
                });
                this.height += 10;
            }
            return result;
        }
        catch(error){
            console.log(error);
        }
    }

    generateQuote(){
        this.isLoading = true;
        try {
            const {jsPDF} = window.jspdf;
            const doc = new jsPDF({
                orientation: 'l',
                format: "a4"
            });

            //Logos
            const tihama = new Image();
            tihama.src = tihamaLogo;
            const har = new Image();
            har.src = harcourt;
            const date = new Date();
            const today = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();

            //Header
            doc.setFontSize(10);
            doc.text("Tihama Distribution Company", 12.5, 15);
            doc.text("Ltd Company - C.R. Number: 4030032382", 12.5, 20);
            doc.text("VAT Registration Number: 300249061500003", 12.5, 25);
            doc.text("Head Office: Riyadh - AlMohamadia - Kind Fahad Road - AlAoula Building P.O.Box: 4681 - Riyadh 11412", 12.5,30, {maxWidth:90});
            doc.text("Branch: Jeddah - AlAndalus Street, South West of AlHamra District P.O.Box: 5455 - Jeddah 21422",12.5,40, {maxWidth:90});
            doc.text("Tel.: +966 11 207 9767 - Fax: +966 11 207 9604", 12.5, 50);
            doc.addImage(tihama, 'png', 110, 15, 40, 25);
            doc.addImage(har, 'png', 150, 15, 40, 25);

            doc.addFont(tradoFont, "trado", "normal");
            doc.setFont("trado");
            doc.text("شركة تهامة للتوزيع", 285, 15, {align:"right"});
            doc.text("شركة ذات مسئولية محدودة - سجل تجاري : 4030032382", 285, 20, {align:"right"});
            doc.text("رقم التسجيل فى ضربية القيمة المضافة: 300249061500003", 285, 25, {align:"right"});
            doc.text("الإدارة - الرياض - حي المحمدية- بناية الأولى- طريق الملك فهد", 285, 30, {maxWidth:90, align:"right"});
            doc.text("فرع جدة: جدة - حى الحمراء - شارع الاندلس - جنوب غرب قصر الحمراء ص.ب: 5455 - جدة 21422", 285, 35, {maxWidth:90, align:"right"});
            doc.text("هاتف :  9767 207 11 00966    -  فاكس :  9604 207 11 00966 ", 285, 45, {align:"right"})

            //Header Tables 
            doc.setFillColor(255, 182, 193);
            doc.setFontSize(8);
            //Left Hand Side
            doc.rect(12.5, 60, 70, 30);
            doc.rect(52.5, 60, 30, 30, "FD");
            
            doc.rect(12.5, 60, 70, 10);
            doc.rect(12.5, 70, 70, 10);
            doc.rect(12.5, 80, 70, 10);
            doc.text(this.Quote.Id, 30, 65, {align:"center"});
            doc.text(today, 30, 75, {align:"center"});
            doc.text(this.Quote.Owner.Name, 30, 85, {align:"center"});

            doc.rect(52.5, 60, 30, 5);
            doc.rect(52.5, 70, 30, 5);
            doc.rect(52.5, 80, 30, 5);
            doc.text("رقم العرض", 70, 63, {align:"center"});
            doc.text("Quote Number", 70, 68, {align:"center"});
            doc.text("تاريخ", 70, 73, {align:"center"});
            doc.text("Date", 70, 78, {align:"center"});
            doc.text("البائع", 70, 83, {align:"center"});
            doc.text("Salesman", 70, 88, {align:"center"});
            //Right Hand Side
            doc.setFillColor(255, 182, 193);
            doc.rect(215, 60, 70, 30);
            doc.rect(255, 60, 30, 30, "FD");
            
            doc.rect(215, 60, 70, 10);
            doc.rect(215, 70, 70, 10);
            doc.rect(215, 80, 70, 10);
            doc.text(this.Quote.AccountId, 235, 65, {align:"center"});
            doc.text(this.Quote.Account.Name, 235, 75, {align:"center"});
            doc.text(this.Quote.ShippingName, 235, 85, {align:"center"});
            
            doc.rect(255, 60, 30, 5);
            doc.rect(255, 70, 30, 5);
            doc.rect(255, 80, 30, 5);
            doc.text("رقم العميل", 270, 63, {align:"center"});
            doc.text("Customer A/C", 270, 68, {align:"center"});
            doc.text("اسم العميل", 270, 73, {align:"center"});
            doc.text("Customer Name", 270, 78, {align:"center"});
            doc.text("العنوان", 270, 83, {align:"center"});
            doc.text("Address", 270, 88, {align:"center"});

            //Title
            doc.setFontSize(24);
            doc.text("عرض الاسعار", 130, 70);
            doc.text("Quotation", 130, 80);

            //Main Table
            doc.setFontSize(16);
            doc.table(8,100, [], this.tableHeaderArabic);
            doc.setFont("trado");
            doc.text("التسلسل", 10, 105);
            doc.text("رقم الصنف الدولي", 23, 105);
            doc.text("الطبعة", 55, 105);
            doc.text("البيان", 85, 105);
            doc.text("الوحدة", 110, 105);
            doc.text("الناشر", 130, 105);
            doc.text("الصف", 155, 105);
            doc.text("الكمية", 172, 105);
            doc.text("السعر قبل الخصم ", 190, 105);
            doc.text("نسبة الخصم", 220, 105);
            doc.text("السعر بعد الخصم ", 240, 105);
            doc.text("المبلغ", 270, 105);
            doc.table(8, 110, this.tableData, this.tableHeader);

            // Check on Height
            if(this.height + 40 > 160){
                doc.addPage({format:"a4", orientation:"l"});
                this.height = 15;
            }
            console.log(this.height);
            //Total Table
            doc.setFillColor(255, 182, 193);
            doc.rect(169, this.height, 120, 20, 'FD');
            doc.rect(169, this.height, 120, 10);
            doc.rect(169, this.height + 10, 120, 10, 'FD');
            doc.rect(169, this.height + 30, 120, 10, 'FD');
            
            doc.setFillColor(220,220,220);
            doc.rect(169, this.height + 20, 120, 10, 'FD');
            doc.rect(169, this.height + 40, 120, 10, 'FD');
            
            doc.rect(169, this.height, 50, 50);
            doc.rect(219, this.height, 50, 50);
            doc.rect(269, this.height, 20, 50);
            
            doc.setFontSize(10);
            doc.setFont("trado");
            doc.text("Total", 180, this.height + 5);
            doc.text("الاجمالى", 230, this.height +5);
            this.Quote.Total_with_VAT__c == undefined ? doc.text( "", 270, this.height + 5) : doc.text(this.Quote.Total_with_VAT__c + "", 272, this.height + 5);
            doc.text("Sub. Total Before VAT", 175, this.height + 25);
            doc.text("الصافى قبل ضربية القيمة المضافة", 225, this.height + 25);
            this.Quote.Subtotal == undefined ? doc.text( "", 270, this.height + 5) : doc.text(this.Quote.Subtotal + "", 270, this.height + 25);
            doc.text("VAT 15%", 180, this.height + 35);
            doc.text("ضربية القيمة المضافة %15", 230, this.height + 35);
            this.Quote.VAT_Amount__c == undefined ? doc.text( "", 270, this.height + 5) : doc.text(this.Quote.VAT_Amount__c + "", 272, this.height + 35);
            doc.text("Total Amount Including VAT", 172, this.height + 45);
            doc.text("إجمالي القيمة شاملا ضريبة القيمة المضافة", 225, this.height + 45);
            this.Quote.Total_with_VAT__c == undefined ? doc.text( "", 270, this.height + 5) : doc.text(this.Quote.Total_with_VAT__c + "", 272, this.height + 45);

            if(this.height + 135 > 195){
                doc.addPage({format:"a4",orientation:"l"});
                this.height = 15;
            }

            //Confirmation
            doc.setFontSize(12);
            doc.text("We confirm the above prices and below terms - نعمدكم على الاسعار والشروط المرفقة", 12.5, this.height + 20, {maxWidth:150});
            doc.rect(12.5, this.height + 30, 135, 100);
            doc.setFillColor(255, 182, 193);
            doc.rect(12.5, this.height + 30, 60, 100, 'FD');
            doc.rect(12.5, this.height + 30, 135, 20);
            doc.rect(12.5, this.height + 50, 135, 20);
            doc.rect(12.5, this.height + 70, 135, 20);
            doc.rect(12.5, this.height + 90, 135, 20);
            doc.rect(12.5, this.height + 110, 135, 20);

            doc.text("الاسم", 35, this.height + 35);
            doc.text("Name", 35, this.height + 45);
            doc.text("التاريخ", 35, this.height + 55);
            doc.text("Date", 35, this.height + 65);
            doc.text("التوقيع", 35, this.height + 75);
            doc.text("Signature", 35, this.height + 85);
            doc.text("تاريخ التوريد المطلوب", 20, this.height + 95);
            doc.text("Requested delivery date", 20, this.height + 105);
            doc.text("الختم", 35, this.height + 115);
            doc.text("Stamp", 35, this.height + 125);
            this.height += 140;

            if(this.height + 20 > 160){
                doc.addPage({format:"a4", orientation:"l"});
                this.height = 15;
            }

            //Terms and Conditions
            doc.setFontSize(14);
            doc.text("General Terms and Conditions الشروط العامة", 115, this.height);
            doc.setFontSize(12);
            doc.text("1- It is the school's responsibility to confirm ISBNs and quantities ordered.", 12.5, this.height + 10);
            doc.text("2- The quotation has to be signed and stamped by an authorized person in the school.", 12.5, this.height + 15);
            doc.text("3- Payment terms : 50% In advance on approval and 50% before delivery.", 12.5, this.height + 20);
            doc.text("4- Delivery period is 60 days from the order confirmation date, unless agreed otherwise by both parties.", 12.5, this.height + 25);
            doc.text("5- The value of returned books should not exceed 3% of the total value of the quotation.", 12.5, this.height + 30);
            doc.text("6- Returns must be made within 45 days of delivery, unused and in their original condition.", 12.5, this.height + 35);
            doc.text("7- There are no returns for digital editions or packages.", 12.5, this.height + 40);
            doc.text("8- This quotation is subject to the above terms and conditions.", 12.5, this.height + 45);

            doc.text("مسئولية تحديد رقم الكتاب الدولي والكميات  هي مسئولية العميل .", 285, this.height + 50, {align:"right"});
            doc.text("يكون الاعتماد عن طريق توقيع وختم عرض الأسعار بواسطة الشخص المفوض من قبل العميل .", 285, this.height + 55, {align:"right"});
            doc.text("شروط الدفع : 50% مقدما و 50% قبل التسليم.", 285, this.height + 60, {align:"right"});
            doc.text("فترة التوريد 60 يوم  من تاريخ التعميد مع استيفاء شروط الدفع واتفاق الطرفين .", 285, this.height + 65, {align:"right"});
            doc.text("القيمة المسترجعة يجب الاتزيد عن 3% من قيمة الكتب المباعة وأقصى فترة قبول الارتجاعات هي 45 يوم من تاريخ التوريد.", 285, this.height + 70, {align:"right"});
            doc.text("لا تقبل إرتجاعات للمنتجات الرقمية (ديجيتال) والنسخ المفعلة عبر الشبكة العنكوبتية (أونلاين) ولا للحقائب (باكج).", 285, this.height + 75, {align:"right"});
            doc.text("الكتب المطلوب إسترجاعها يجب أن تكون في حالتها  الأصلية.", 285, this.height + 80, {align:"right"});
            doc.text("إن الشروط المذكورة تعتبر جزء أساسي من من عملية البيع.", 285, this.height + 85, {align:"right"});
            this.height += 85;


            doc.save("Quote.pdf");
            setTimeout(() =>{
                this.isLoading = false;
            }, 500);
        }
        catch(error){
            console.log(error)
        }
    }
}