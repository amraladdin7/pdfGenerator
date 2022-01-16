import { LightningElement, api, track, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import jspdf from '@salesforce/resourceUrl/jspdf';
import tradoFont from '@salesforce/resourceUrl/trado';
import InvoiceToGet from '@salesforce/apex/InvoiceGetter.InvoiceToGet';
import logo from '@salesforce/resourceUrl/logo';

export default class GenerateInvoice extends LightningElement {
    
    @track isLoading = false;
    @api text;
    @api englishtext;
    @api arabictext;
    @track startX = 10;
    invoiceId;
    Invoice;
    orderItems;

    @wire(InvoiceToGet, {invoiceId: '$invoiceId'})
    wiredPdf(result) {
        if(result.data) {
            this.Invoice = result.data;
            this.orderItems = this.Invoice.OpportunityLineItems;
            this.tableData = this.generateTableData();
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
            let pathname = window.location.pathname;
            this.invoiceId = pathname.substring(25, 43);
        });
    }

    tableHeader = [{id:'SN', name:'SN', prompt:'SN', width:20, align:'center', padding:0},
                    {id:'ISBN', name:'ISBN', prompt:'ISBN', width:48, align:"center", padding:0},
                    {id:'Edition', name:'Edition', prompt:'Edition', width:30, align:'center', padding:0},
                    {id:'Description', name:'Description', prompt:'Description', width:40, align:'center', padding:0},
                    {id:'Unit', name:'Unit', prompt:'Unit', width:22, align:'center', padding:0},
                    {id:'Publisher', name:'Publisher', prompt:'Publisher', width:35, align:'center', padding:0},
                    {id:'Grade', name:'Grade', prompt:'Grade', width:25, align:'center', padding:0},
                    {id:'Qty', name:'Qty', prompt:'Qty', width:20, align:'center', padding:0},
                    {id:'KSA Price List', name:'KSA Price List', prompt:'KSA Price List', width:45, align:'center', padding:0},
                    {id:'Discount %', name:'Discount %', prompt:'Discount', width:30, align:'center', padding:0},
                    {id:'Net Price', name:'Net Price', prompt:'Net Price', width:35, align:'center', padding:0},
                    {id:'Amount SR', name:'Amount SR', prompt:'Amount', width:30, align:'center', padding:0}];
    
    tableHeaderArabic = [{id:'SN', name:'SN', prompt:'   ', width:20, align:'center', padding:0},
                        {id:'ISBN', name:'ISBN', prompt:'   ', width:48, align:"center", padding:0},
                        {id:'Edition', name:'Edition', prompt:'   ', width:30, align:'center', padding:0},
                        {id:'Description', name:'Description', prompt:'   ', width:40, align:'center', padding:0},
                        {id:'Unit', name:'Unit', prompt:'   ', width:22, align:'center', padding:0},
                        {id:'Publisher', name:'Publisher', prompt:'   ', width:35, align:'center', padding:0},
                        {id:'Grade', name:'Grade', prompt:'   ', width:25, align:'center', padding:0},
                        {id:'Qty', name:'Qty', prompt:'   ', width:20, align:'center', padding:0},
                        {id:'KSA Price List', name:'KSA Price List', prompt:'   ', width:45, align:'center', padding:0},
                        {id:'Discount %', name:'Discount %', prompt:'   ', width:30, align:'center', padding:0},
                        {id:'Net Price', name:'Net Price', prompt:'   ', width:35, align:'center', padding:0},
                        {id:'Amount SR', name:'Amount SR', prompt:'   ', width:30, align:'center', padding:0}];
    tableData = []
    height = 77;

    generateTableData(){
        try{
            let result = [];
            for(let i = 0; i<this.Invoice.OpportunityLineItems.length; i++){
                result.push({
                    "SN":`${i+1}`,
                    "ISBN": this.Invoice.OpportunityLineItems[i].Product2.ProductCode == undefined ? ` ` : `${this.Invoice.OpportunityLineItems[i].Product2.ProductCode}`,
                    "Edition": this.Invoice.OpportunityLineItems[i].Product2.Name == undefined ? ` ` : `${this.Invoice.OpportunityLineItems[i].Product2.Name}`,
                    "Description": this.Invoice.OpportunityLineItems[i].Description == undefined ? ` ` : `${this.Invoice.OpportunityLineItems[i].Description}`,
                    "Unit":` `,
                    "Publisher": this.Invoice.OpportunityLineItems[i].Product2.Publisher__c == undefined ? ` ` : `${this.Invoice.OpportunityLineItems[i].Product2.Publisher__c}`,
                    "Grade": this.Invoice.OpportunityLineItems[i].Product2.Grade__c == undefined ? ` ` : `${this.Invoice.OpportunityLineItems[i].Product2.Grade__c}`,
                    "Qty":  this.Invoice.OpportunityLineItems[i].Quantity == undefined ? ` ` : `${this.Invoice.OpportunityLineItems[i].Quantity}`,
                    "KSA Price List": this.Invoice.OpportunityLineItems[i].Subtotal == undefined ? ` ` : `${this.Invoice.OpportunityLineItems[i].Subtotal}` + "SR",
                    "Discount %": this.Invoice.OpportunityLineItems[i].Discount == undefined ? ` ` : `${this.Invoice.OpportunityLineItems[i].Discount}` + "%",
                    "Net Price":this.Invoice.OpportunityLineItems[i].TotalPrice == undefined ? ` ` : `${this.Invoice.OpportunityLineItems[i].TotalPrice}` + "SR",
                    "Amount SR":this.Invoice.OpportunityLineItems[i].TotalPrice == undefined ? ` ` : `${this.Invoice.OpportunityLineItems[i].TotalPrice}` + "SR"
                });
                this.height += 20;
            }
            return result;
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
                format: "a4",
                orientation:"l"
            });

            //Logo
            const tihama = new Image();
            tihama.src = logo;
            const date = new Date();
            const today = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();

            //Header
            doc.setFontSize(8);
            doc.text("Tihama Distribution Company", 12.5, 12.5);
            doc.text("Ltd Company - C.R. Number: 4030032382", 12.5, 15);
            doc.text("VAT Registration Number: 300249061500003", 12.5, 17.5);
            doc.text("Head Office: Riyadh - AlMohamadia - Kind Fahad Road - AlAoula Building P.O.Box: 4681 - Riyadh 11412", 12.5,20, {maxWidth:90});
            doc.text("Branch: Jeddah - AlAndalus Street, South West of AlHamra District P.O.Box: 5455 - Jeddah 21422",12.5,27, {maxWidth:90});
            doc.text("Tel.: +966 11 207 9767 - Fax: +966 11 207 9604", 12.5, 33);
            doc.addImage(tihama, 'png', 135, 12.5, 40, 25);
            // doc.addImage(har, 'png', 150, 15, 40, 25);

            doc.addFont(tradoFont, "trado", "normal");
            doc.setFont("trado");
            doc.text("شركة تهامة للتوزيع", 285, 12.5, {align:"right"});
            doc.text("شركة ذات مسئولية محدودة - سجل تجاري : 4030032382", 285, 15, {align:"right"});
            doc.text("رقم التسجيل فى ضربية القيمة المضافة: 300249061500003", 285, 17.5, {align:"right"});
            doc.text("الإدارة - الرياض - حي المحمدية- بناية الأولى- طريق الملك فهد", 285, 20, {maxWidth:90, align:"right"});
            doc.text("فرع جدة: جدة - حى الحمراء - شارع الاندلس - جنوب غرب قصر الحمراء ص.ب: 5455 - جدة 21422", 285, 22.5, {maxWidth:90, align:"right"});
            doc.text("هاتف :  9767 207 11 00966    -  فاكس :  9604 207 11 00966 ", 285, 27.5, {align:"right"})

            //Header Tables 
            doc.setFillColor(255, 182, 193);
            doc.setFontSize(8);

            //Left Hand Side
            doc.rect(12.5, 35, 70, 30);
            doc.rect(52.5, 35, 30, 30, "FD");
            
            doc.rect(12.5, 35, 70, 10);
            doc.rect(12.5, 45, 70, 10);
            doc.rect(12.5, 55, 70, 10);
            doc.text(this.Invoice.Name, 30, 40, {align:"center"});
            doc.text(today, 30, 50, {align:"center"});
            doc.text(this.Invoice.Owner.Name, 30, 60, {align:"center"});

            doc.rect(52.5, 35, 30, 5);
            doc.rect(52.5, 45, 30, 5);
            doc.rect(52.5, 55, 30, 5);
            doc.text("رقم امر البيع", 70, 38, {align:"center"});
            doc.text("Sales Order Reference", 68, 43, {align:"center"});
            doc.text("تاريخ", 70, 48, {align:"center"});
            doc.text("Date", 70, 53, {align:"center"});
            doc.text("البائع", 70, 58, {align:"center"});
            doc.text("Salesman", 70, 63, {align:"center"});

            //Right Hand Side
            doc.setFillColor(255, 182, 193);
            doc.rect(215, 35, 70, 30);
            doc.rect(255, 35, 30, 30, "FD");
            
            doc.rect(215, 35, 70, 10);
            doc.rect(215, 45, 70, 10);
            doc.rect(215, 55, 70, 10);
            doc.text(this.Invoice.AccountId, 235, 40, {align:"center"});
            doc.text(this.Invoice.Account.Name, 235, 50, {align:"center"});
            
            doc.rect(255, 35, 30, 5);
            doc.rect(255, 45, 30, 5);
            doc.rect(255, 55, 30, 5);
            doc.text("رقم العميل", 270, 38, {align:"center"});
            doc.text("Customer A/C", 270, 43, {align:"center"});
            doc.text("اسم العميل", 270, 48, {align:"center"});
            doc.text("Customer Name", 270, 53, {align:"center"});
            doc.text("العنوان", 270, 58, {align:"center"});
            doc.text("Address", 270, 63, {align:"center"});
           
            doc.setFontSize(20);
            doc.text("فاتورة مبيعات", 115, 45);
            doc.text("Sales Invoice", 115, 55);
            doc.text("No. " + this.Invoice.Id, 115, 65);

            //Main Table
            doc.setFontSize(16);
            doc.table(8, 70, [], this.tableHeaderArabic);
            doc.setFont("trado");
            doc.text("التسلسل", 10, 75);
            doc.text("رقم الصنف الدولي", 27, 75);
            doc.text("الطبعة", 63, 75);
            doc.text("البيان", 95, 75);
            doc.text("الوحدة", 115, 75);
            doc.text("الناشر", 135, 75);
            doc.text("الصف", 157, 75);
            doc.text("الكمية", 175, 75);
            doc.text("السعر قبل الخصم ", 192, 75);
            doc.text("نسبة الخصم", 225, 75);
            doc.text("السعر بعد الخصم ", 245, 75);
            doc.text("المبلغ", 275, 75);
            doc.table(8, 80, this.tableData, this.tableHeader, {fontSize:12});
            
            doc.setFillColor(255, 182, 193);
            doc.rect(169, this.height + 5, 120, 20, 'FD');
            doc.rect(169, this.height + 5, 120, 10);
            doc.rect(169, this.height + 15, 120, 10, 'FD');
            doc.rect(169, this.height + 35, 120, 10, 'FD');
            
            doc.setFillColor(220,220,220);
            doc.rect(169, this.height + 25, 120, 10, 'FD');
            doc.rect(169, this.height + 45, 120, 10, 'FD');
            
            doc.rect(169, this.height + 5, 50, 50);
            doc.rect(219, this.height + 5 , 50, 50);
            doc.rect(269, this.height + 5, 20, 50);
            
            doc.setFontSize(10);
            doc.setFont("trado");
            doc.text("Total", 180, this.height + 10);
            doc.text("الاجمالى", 230, this.height +10);
            this.Invoice.Total_with_VAT__c == undefined ? doc.text( "", 270, this.height + 10) : doc.text(this.Invoice.Total_with_VAT__c + "", 272, this.height + 10);
            doc.text("Shipping / Freight Charges", 175, this.height + 20);
            doc.text("مصاريف الشحن", 225, this.height + 20);
            this.Invoice.ShippingHandling == undefined ? doc.text("", 270, this.height + 20) : doc.text(this.Invoice.ShippingHandling + "", 272, this.height + 20);
            doc.text("Sub. Total Before VAT", 175, this.height + 30);
            doc.text("الصافى قبل ضربية القيمة المضافة", 225, this.height + 30);
            this.Invoice.TotalPrice == undefined ? doc.text( "", 270, this.height + 30) : doc.text(this.Invoice.TotalPrice + "", 272, this.height + 30);
            doc.text("VAT 15%", 180, this.height + 40);
            doc.text("ضربية القيمة المضافة %15", 230, this.height + 40);
            this.Invoice.VAT_Amount__c == undefined ? doc.text( "", 270, this.height + 40) : doc.text(this.Invoice.VAT_Amount__c + "", 272, this.height + 40);
            doc.text("Total Amount Including VAT", 172, this.height + 50);
            doc.text("إجمالي القيمة شاملا ضريبة القيمة المضافة", 225, this.height + 50);
            this.Invoice.Total_with_VAT__c == undefined ? doc.text( "", 270, this.height + 50) : doc.text(this.Invoice.Total_with_VAT__c + "", 272, this.height + 50);
            
            //Confirmation
            doc.setFontSize(10);
            doc.text("We confirm the above prices and below terms - نعمدكم على الاسعار والشروط المرفقة", 12.5, this.height + 8, {maxWidth:150});
            doc.rect(12.5, this.height + 10, 135, 50);
            doc.setFillColor(255, 182, 193);
            doc.rect(12.5, this.height + 10, 60, 50, 'FD');
            doc.rect(12.5, this.height + 10, 135, 10);
            doc.rect(12.5, this.height + 20, 135, 10);
            doc.rect(12.5, this.height + 30, 135, 10);
            doc.rect(12.5, this.height + 40, 135, 10);
            doc.rect(12.5, this.height + 50, 135, 10);

            doc.text("الاسم", 35, this.height + 13);
            doc.text("Name", 35, this.height + 18);
            doc.text("التاريخ", 35, this.height + 23);
            doc.text("Date", 35, this.height + 28);
            doc.text("التوقيع", 35, this.height + 33);
            doc.text("Signature", 35, this.height + 38);
            doc.text("تاريخ التوريد المطلوب", 20, this.height + 43);
            doc.text("Requested delivery date", 20, this.height + 48);
            doc.text("الختم", 35, this.height + 53);
            doc.text("Stamp", 35, this.height + 58);
            this.height += 65;

            if(this.height > 170){
                doc.addPage({format:"a4", orientation:"l"});
                this.height = 15;
            }

            //Terms and Conditions
            doc.setFontSize(12);
            doc.text("General Terms and Conditions الشروط العامة", 115, this.height);
            doc.setFontSize(8);
            doc.text("1- Payment terms : " + this.englishtext , 12.5, this.height + 5);
            doc.text("2- The value of returned books should not exceed 3% of the total value of the quotation.", 12.5, this.height + 10);
            doc.text("3- Returns must be made within 45 days of delivery, unused and in their original condition.", 12.5, this.height + 15);
            doc.text("4- There are no returns for digital editions or packages.", 12.5, this.height + 20);
            doc.text("5- This quotation is subject to the above terms and conditions.", 12.5, this.height + 25);

            doc.text("شروط الدفع : " +this.arabictext , 285, this.height + 5, {align:"right"});
            doc.text("القيمة المسترجعة يجب الاتزيد عن 3% من قيمة الكتب المباعة وأقصى فترة قبول الارتجاعات هي 45 يوم من تاريخ التوريد.", 285, this.height + 10, {align:"right"});
            doc.text("لا تقبل إرتجاعات للمنتجات الرقمية (ديجيتال) والنسخ المفعلة عبر الشبكة العنكوبتية (أونلاين) ولا للحقائب (باكج).", 285, this.height + 15, {align:"right"});
            doc.text("الكتب المطلوب إسترجاعها يجب أن تكون في حالتها  الأصلية.", 285, this.height + 20, {align:"right"});
            doc.text("إن الشروط المذكورة تعتبر جزء أساسي من من عملية البيع.", 285, this.height + 25, {align:"right"});
            this.height += 85;

            doc.save(this.Invoice.Name + '.pdf');
            setTimeout(() =>{
                this.isLoading = false;
                this.height = 77;
            }, 500);
            // this.isLoading = false;
        }
        catch(error){
            console.log(error);
        }
    }

}