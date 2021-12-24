public with sharing class ContractGetter {
    @AuraEnabled(cacheable = true)
    public static Contract ContractToGet(string contractId) {
        try {
            String query = 'SELECT '
                     + 'Name, ContractNumber, Account.Name, EndDate, StartDate '
                     + 'FROM Contract';
            if (String.isNotBlank(contractId)) {
                query += ' WHERE Id = :contractId';
            }
            
            return Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
