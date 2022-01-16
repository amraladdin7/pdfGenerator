public with sharing class InvoiceGetter {
    @AuraEnabled(cacheable = true)
    public static Opportunity InvoiceToGet(String invoiceId) {
        try {
            String query = 'SELECT '
                     + 'Name, OrderNumber__c, VAT_No__c, Amount, Owner.Name, Account.Name, ' 
                     + '(SELECT Quantity, Description, ListPrice, Subtotal, Discount, TotalPrice, UnitPrice, Product2.Name, Product2.ProductCode, Product2.Publisher__c FROM OpportunityLineItems) '
                     + 'FROM Opportunity';
            if (String.isNotBlank(invoiceId)) {
                query += ' WHERE Id = :invoiceId';
            }
            return Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}