public with sharing class QuoteGetter {
    @AuraEnabled(cacheable = true)
    public static Quote QuoteToGenerate(String quoteId){
        try {
            String query = 'SELECT '
                     + 'Name, Profit_Margin__c, '
                     + '(SELECT Description, English_Name__c, Quantity FROM QuoteLineItems) '
                     + 'FROM Quote';
            if (String.isNotBlank(quoteId)) {
                query += ' WHERE Id = :quoteId';
            }
            query += ' WITH SECURITY_ENFORCED ';
            return Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
