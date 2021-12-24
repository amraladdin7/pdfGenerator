public with sharing class SampleGetter {
    @AuraEnabled(cacheable = true)
    public static Sample_Product__c SampleToGet(String sampleId) {
        try {
            String query = 'SELECT '
                     + 'Name, Quantity__c, List_Price__c, Product__R.Name '
                     + 'FROM Sample_Product__c ';
                     if (String.isNotBlank(sampleId)) {
                        query += 'WHERE Id = :sampleId';
                    }
            query += ' WITH SECURITY_ENFORCED ';
            return Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
