public with sharing class PdfGeneratorGetter {
    @AuraEnabled(cacheable = true)
    public static List<PDF_Generator__c> PdfToGenerate(String genId) {
        try {
            String query = 'SELECT '
                     + 'Image__c, Image2__c, Invoice__c, Quote__c '
                     + 'FROM PDF_Generator__c';
            if (String.isNotBlank(genId)) {
                query += ' WHERE Id = :genId';
            }
            return Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
