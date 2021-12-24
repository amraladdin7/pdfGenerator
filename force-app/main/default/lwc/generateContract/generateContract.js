import { LightningElement, api, track, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import jspdf from '@salesforce/resourceUrl/jspdf';
import tradoFont from '@salesforce/resourceUrl/trado';
import ContractToGet from '@salesforce/apex/ContractGetter.ContractToGet';

export default class GenerateContract extends LightningElement {
     // @api disabled;
     @track isLoading = false;
     @api text;
     @api language;
     @api tem;
     @api description;
     @track startX = 10;
     contractId;
     Contract
 
     @wire(ContractToGet, {contractId: '$contractId'})
     wiredPdf(result) {
        if(result.data) {
            this.Contract = result.data; 
            console.log(this.description) 
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
             this.contractId = pathname.substring(22, 40);
             console.log(this.contractId)
         });
     }
 
     generate() {
         this.isLoading = true;
         try{
             const {jsPDF} = window.jspdf;
             const doc = new jsPDF({
                 format: "a4"
             });
             
             if(this.language == 'English'){
                 doc.setFontSize(24);
                 doc.text("CONTRACT TEMPLATE",55,35);
                 doc.setFontSize(10);
                 let firstparagraph = "  This contract in entered into by and between Tihama, [AN INDIVIDUAL, OR TYPE OF BUSINESS ENTITY] ('First Party'), and " + this.Contract.Account.Name + ", [AN INDIVIDUAL, OR TYPE OF BUSINESS ENTITY] ('Second Party'). The term of this Agreemant shall begin on " + this.Contract.StartDate + " and shall continue through its termination date of " + this.Contract.EndDate + ".";
                 doc.text(firstparagraph, 20, 50, {maxWidth:170})
                 doc.text("The specific terms of this contract are as follows:", 25, 75)
                 doc.text(this.text, 25, 82.5)
                 let secondparagraph = "  In consideration of the mutual promises set forth herein, the First Party convenants and agrees it shall ";
                 doc.text(secondparagraph + this.description, 25, 130, {maxWidth:170})
                 
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
             }
             if(this.language == 'Arabic'){
                 doc.addFont(tradoFont, "trado", "normal");
                 doc.setFont('trado')
                 doc.setFontSize(24);
                 doc.text("نموذج العقد",110,35);
                 doc.setFontSize(14);
                 let underscore = "____________"
                 let firstparagraph = "تم إبرام هذا العقد بين تهامة، و ___________________ . تبدأ مدة هذه الاتفاقية في  ";
                 let endpara = " وتستمر حتى تاريخ انتهائها في"
                 doc.text(firstparagraph + this.Contract.StartDate, 180, 50, {maxWidth:190, align:"right"})
                 doc.text(endpara + this.Contract.EndDate, 180, 55, {align:"right"})
                
                 let conditions = "الشروط المحددة لهذا العقد هي كما يلي"
                 doc.text(conditions, 180, 70, {align:"right"})
                 let secondparagraph = "بالنظر إلى الوعود المتبادلة المنصوص عليها في هذه الوثيقة ، يقر الطرف الأول ويوافق على ذلك"
                 doc.text(secondparagraph + this.description, 180, 130, {maxWidth:170, align:"right"})
            
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
             }
             doc.save(this.Contract.ContractNumber + ".pdf")
             setTimeout(() =>{
                this.isLoading = false;
            }, 500);
         }
         catch(error){
             console.log(error);
         }
     }
}