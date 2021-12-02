public with sharing class PdfGeneratorGetter {
    @AuraEnabled(cacheable = true)
    public static List<PDF_Generator__c> PdfToGenerate(String genId) {
        try {
            String query = 'SELECT '
                     + 'Image__c, Invoice__c, Quote__c '
                     + 'FROM PDF_Generator__c';
            if (String.isNotBlank(genId)) {
                query += ' WHERE Id = :genId';
            }
            query += ' WITH SECURITY_ENFORCED ';
            return Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
