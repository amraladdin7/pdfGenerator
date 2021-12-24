public with sharing class InvoiceGetter {
    @AuraEnabled(cacheable = true)
    public static Invoice__c InvoiceToGet(String invoiceId) {
        try {
            String query = 'SELECT '
                     + 'Name '
                     + 'FROM Invoice__c';
            if (String.isNotBlank(invoiceId)) {
                query += ' WHERE Id = :invoiceId';
            }
            query += ' WITH SECURITY_ENFORCED ';
            return Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
