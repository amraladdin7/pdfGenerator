public with sharing class ContractGetter {
    @AuraEnabled(cacheable = true)
    public static Contract ContractToGet(string contractId) {
        try {
            String query = 'SELECT '
                     + 'Name '
                     + 'FROM Contract';
            if (String.isNotBlank(contractId)) {
                query += ' WHERE Id = :contractId';
            }
            query += ' WITH SECURITY_ENFORCED ';
            return Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
