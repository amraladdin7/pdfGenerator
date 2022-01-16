import { LightningElement, api, track, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import jspdf from '@salesforce/resourceUrl/jspdf';
import tradoFont from '@salesforce/resourceUrl/trado';
import SampleToGet from '@salesforce/apex/SampleGetter.SampleToGet';
import logo from '@salesforce/resourceUrl/logo';
import UserPermissionsCallCenterAutoLogin from '@salesforce/schema/User.UserPermissionsCallCenterAutoLogin';

export default class GenerateSample extends LightningElement {
    @track isLoading = false;
    @api englishtext;
    @api arabictext;
    @track startX = 10;
    sampleId;
    Sample;
    sampleProducts;

    @wire(SampleToGet, {sampleId: '$sampleId'})
    wiredPdf(result) {
        if(result.data) {
            this.Sample = result.data;
            this.sampleProducts = this.Sample.Sample_Products__r;
            this.tableData = this.generateTableData();
            console.log(this.Sample)
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
            this.sampleId = pathname.substring(23, 41);
        });
    }
    tableHeader = [{id:'SN', name:'SN', prompt:'SN', width:20, align:'center', padding:0},
                {id:'ISBN', name:'ISBN', prompt:'ISBN', width:70, align:"center", padding:0},
                {id:'Edition', name:'Edition', prompt:'Edition', width:35, align:'center', padding:0},
                {id:'Description', name:'Description', prompt:'Description', width:70, align:'center', padding:0},
                {id:'Unit', name:'Unit', prompt:'Unit', width:22, align:'center', padding:0},
                {id:'Publisher', name:'Publisher', prompt:'Publisher', width:50, align:'center', padding:0},
                {id:'Grade', name:'Grade', prompt:'Grade', width:25, align:'center', padding:0},
                {id:'Qty', name:'Qty', prompt:'Qty', width:20, align:'center', padding:0},
                {id:'Notes', name:'Notes', prompt:'Notes', width:60, align:'center', padding:0}];

    tableHeaderArabic = [{id:'SN', name:'SN', prompt:'   ', width:20, align:'center', padding:0},
                    {id:'ISBN', name:'ISBN', prompt:'   ', width:70, align:"center", padding:0},
                    {id:'Edition', name:'Edition', prompt:'   ', width:35, align:'center', padding:0},
                    {id:'Description', name:'Description', prompt:'   ', width:70, align:'center', padding:0},
                    {id:'Unit', name:'Unit', prompt:'   ', width:22, align:'center', padding:0},
                    {id:'Publisher', name:'Publisher', prompt:'   ', width:50, align:'center', padding:0},
                    {id:'Grade', name:'Grade', prompt:'   ', width:25, align:'center', padding:0},
                    {id:'Qty', name:'Qty', prompt:'   ', width:20, align:'center', padding:0},
                    {id:'Notes', name:'Notes', prompt:'     ', width:60, align:'center', padding:0}];

    tableData = []
    height = 97;

    generateTableData(){
        try{
            let result = [];
            for(let i = 0; i<this.sampleProducts.length; i++){
                result.push({
                    "SN":`${i+1}`,
                    "ISBN": this.sampleProducts[i].Product__r.ProductCode == undefined ? ` ` : `${this.sampleProducts[i].Product__r.ProductCode}`,
                    "Edition": this.sampleProducts[i].Product__r.Name == undefined ? ` ` : `${this.sampleProducts[i].Product__r.Name}`,
                    "Description": this.sampleProducts[i].Description == undefined ? ` ` : `${this.sampleProducts[i].Description}`,
                    "Unit":` `,
                    "Publisher": this.sampleProducts[i].Product__r.Publisher__c == undefined ? ` ` : `${this.sampleProducts[i].Product__r.Publisher__c}`,
                    "Grade": this.sampleProducts[i].Product__r.Grade__c == undefined ? ` ` : `${this.sampleProducts[i].Product__r.Grade__c}`,
                    "Qty":  this.sampleProducts[i].Quantity == undefined ? ` ` : `${this.sampleProducts[i].Quantity}`
                });
                this.height += 20;
            }
            console.log(result)
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
            doc.text(this.Sample.Name, 30, 40, {align:"center"});
            doc.text(today, 30, 50, {align:"center"});
            doc.text(this.Sample.Owner.Name, 30, 60, {align:"center"});

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
            doc.text(this.Sample.Account__r.Id + "", 235, 40, {align:"center"});
            doc.text(this.Sample.Account__r.Name, 235, 50, {align:"center"});
            
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
            doc.text("No. " + this.Sample.Id, 115, 65);

            //Main Table
            doc.setFontSize(16);
            doc.table(8, 70, [], this.tableHeaderArabic);
            doc.setFont("trado");
            doc.text("التسلسل", 10, 75);
            doc.text("رقم الصنف الدولي", 35, 75);
            doc.text("الطبعة", 85, 75);
            doc.text("البيان", 125, 75);
            doc.text("الوحدة", 160, 75);
            doc.text("الناشر", 185, 75);
            doc.text("الصف", 215, 75);
            doc.text("الكمية", 232, 75);
            doc.text("ملاحظات", 253, 75);
            doc.table(8, 80, [], this.tableHeader);
            
            if(this.height > 170){
                doc.addPage({format:"a4", orientation:"l"});
                this.height = 15;
            }
            
            doc.setFontSize(12);
            doc.setFont("trado");
            doc.text("General Terms and Conditions الشروط العامة", 115, this.height);
            doc.setFontSize(8);
            doc.text("1- The signature of one of your employees on the delivery documentation means you have received and accepted all the delivered items in good condition.", 12.5, this.height + 5, {maxWidth:100});
            doc.text("2- For items containing online components, the Activation Codes will be sent separately to the nominated authorized person.", 12.5, this.height + 12);
            doc.text("3- If there is a difference between quantities per the delivery documentation and those physically received, please notify us within 48 hours of receipt, otherwise the quantities per the delivery documentation will be considered correct.", 12.5, this.height + 15, {maxWidth:100});
            doc.text("4- Sample Quantities to be returned to Tihama, if there is no Sales/Order against received Sample Books", 12.5, this.height + 25);
            doc.text("ان توقيع احد مندوبيكم على المستند يعنى استلامكم لكامل الكميات المذكورة بحالة البيع.", 285, this.height + 5, {align:"right"});
            doc.text("الاصناف التى تحتوى على مكونات اونلاين سيتم ارسال اكواد التفعيل الى المفوض من قبلكم.", 285, this.height + 10, {align:"right"});
            doc.text("فى حالة وجود اختلاف فى الكميات المذكورة اعلاه عن المستلمة فعليا, يرجى افادتنا خلال 48 ساعة من الاستلام والا اعتبرت الكميات صحيحة.", 285, this.height + 15, {align:"right", maxWidth:150});
            doc.text("بخصوص العينات, لتتم اعادتها بحالة البيع فى حالة عدم الشراء من تهامة خلال 20 يوم من استلامها.", 285, this.height + 20, {align:"right"});
            
            this.height += 50;
            doc.setFontSize(12);
            doc.text("Name اسم المتسلم", 12.5, this.height);
            doc.text("__________________", 12.5, this.height + 7);
            doc.text("Sign توقيع المستلم", 150, this.height);
            doc.text("__________________", 150, this.height + 7);
            doc.text("Stamp الختم", 220, this.height);
            doc.text("__________________", 220, this.height + 7);
            doc.text("Mobile No. رقم الجوال", 12.5, this.height + 20);
            doc.text("__________________", 50, this.height + 20);

            doc.save(this.Sample.Name + '.pdf');
            setTimeout(() =>{
                this.isLoading = false;
                this.height = 97;
            }, 500);
            // this.isLoading = false;
        }
        catch(error){
            console.log(error);
        }
    }
}