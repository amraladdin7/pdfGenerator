public without sharing class ImageLogo {
    @AuraEnabled
    public static boolean ImageLogoUpdate(Id genId, String logo) {
        try { 
            String query = 'SELECT '
                     + 'Logo__c '
                     + 'FROM PDF_Generator__c';
            if (String.isNotBlank(genId)) {
                query += ' WHERE Id = :genId';
            } 
            PDF_Generator__c pdfGen = Database.query(query);
            System.Debug(genId + logo);
            pdfGen.Logo__c = logo;
            update pdfGen;
            return true;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
