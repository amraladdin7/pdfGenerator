public with sharing class ProductsGetter {
    @AuraEnabled(cacheable = true)
    public static List<Product2> ProductsToGet() {
        try{
            String query = 'SELECT Name, ProductCode, Publisher__c, Description FROM Product2';
            return Database.query(query);
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
}
