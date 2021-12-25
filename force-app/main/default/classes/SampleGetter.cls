public with sharing class SampleGetter {
    @AuraEnabled(cacheable = true)
    public static Sample__c SampleToGet(String sampleId) {
        try {
            String query = 'SELECT '
                     + 'Name, Total_Amount__c,OwnerId, '
                     + '(SELECT Product__r.Name FROM Sample_Products__r) '
                     + 'FROM Sample__c ';
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
