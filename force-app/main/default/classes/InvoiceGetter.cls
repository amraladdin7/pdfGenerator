public with sharing class InvoiceGetter {
    @AuraEnabled(cacheable = true)
    public static Order InvoiceToGet(String invoiceId) {
        try {
            String query = 'SELECT '
                     + 'TotalAmount, Name, OrderNumber, OwnerId, ' 
                     + '(SELECT Quantity, TotalPrice, UnitPrice, Product2.Name FROM OrderItems) '
                     + 'FROM Order';
            if (String.isNotBlank(invoiceId)) {
                query += ' WHERE Id = :invoiceId';
            }
            return Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
