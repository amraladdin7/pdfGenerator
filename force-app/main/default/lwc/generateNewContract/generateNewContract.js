import { LightningElement, api, track, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import jspdf from '@salesforce/resourceUrl/jspdf';
import tradoFont from '@salesforce/resourceUrl/trado';
import ContractToGet from '@salesforce/apex/ContractGetter.ContractToGet';

export default class GenerateNewContract extends LightningElement {
    @track isLoading = false;
    @api text;
    @api tem;
    @api description;
    @track startX = 10;
    contractId;
    Contract
 
    @wire(ContractToGet, {contractId: '$contractId'})
    wiredPdf(result) {
        if(result.data) {
            this.Contract = result.data; 
            console.log(this.Contract) 
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
    generate(){
        this.isLoading = true;
        try {
            const {jsPDF} = window.jspdf;
            const doc = new jsPDF({
                format: "a4"
            });
            doc.addFont(tradoFont, "trado", "normal");
            //Title
            doc.setFontSize(24);
            doc.text("CONTRACT TEMPLATE",60,35);
            doc.setFont('trado');
            doc.setFontSize(30);
            doc.text("نموذج العقد",100,20);

            console.log("generate")
            //First Paragraph
            doc.setFontSize(10);
            
            let firstparagraph = "  This contract in entered into by and between Tihama, [AN INDIVIDUAL, OR TYPE OF BUSINESS ENTITY] ('First Party'), and " + this.Contract.Account.Name + ", [AN INDIVIDUAL, OR TYPE OF BUSINESS ENTITY] ('Second Party'). The term of this Agreemant shall begin on " + this.Contract.StartDate + " and shall continue through its termination date of " + this.Contract.EndDate + ".";
            doc.text(firstparagraph, 20, 50, {maxWidth:170})
            doc.text("The specific terms of this contract are as follows:", 25, 85);
            let firstparagrapharabic = "تم إبرام هذا العقد بين تهامة، و";
            let sec = " تبدأ مدة هذه الاتفاقية في"
            let endpara = " وتستمر حتى تاريخ انتهائها في";
            doc.text(firstparagrapharabic, 180, 70, {maxWidth:190, align:"right"})
            doc.text(this.Contract.Account.Name, 125, 70)
            doc.text(sec + this.Contract.StartDate, 120, 70, {maxWidth:190, align:"right"})
            doc.text(endpara + this.Contract.EndDate, 70, 70, {align:"right"})
            let conditions = "الشروط المحددة لهذا العقد هي كما يلي"
            doc.text(conditions, 180, 90, {align:"right"})
            this.Contract.SpecialTerms != undefined ? doc.text(this.Contract.SpecialTerms, 30, 100, {maxWidth:170}) : doc.text("", 30, 100);
            this.Contract.Description != undefined ? doc.text(this.Contract.Description, 25, 140, {maxWidth:170}) : doc.text("", 25,140);


            doc.text("______________________________", 40, 200);
            doc.text("(Signature) (التوقيع)", 50, 205);
            doc.text("______________________________", 110, 200);
            doc.text("(Signature) (التوقيع)", 120, 205);
            doc.text("______________________________", 40, 215);
            doc.text("(Printed Name) (الاسم)", 50, 220);
            doc.text("______________________________", 110, 215);
            doc.text("(Printed Name) (الاسم)", 120, 220);
            doc.text("______________________________", 40, 230);
            doc.text("(Address) (العنوان)", 50, 235);
            doc.text("______________________________", 110, 230);
            doc.text("(Address) (العنوان)", 120, 235);
            doc.text("Date: ________________, 20___", 40, 250);
            doc.text("Date: ________________, 20___", 110, 250);
            doc.save(this.Contract.ContractNumber + ".pdf");
             setTimeout(() =>{
                this.isLoading = false;
            }, 500);
        }
        catch(error){
            console.log(error);
        }
    }
}