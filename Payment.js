// JavaScript Example: Reading Entities
// Filterable fields: pickup_id, customer_id, amount, provider, channel, phone_number, transaction_id, status, payment_date, retry_count, failure_reason, receipt_url
async function fetchPaymentEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/68ab1a3a658d59a8d4fb3e8a/entities/Payment`, {
        headers: {
            'api_key': 'c95b214954694e54a68f052c06b0c9d1', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: pickup_id, customer_id, amount, provider, channel, phone_number, transaction_id, status, payment_date, retry_count, failure_reason, receipt_url
async function updatePaymentEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/68ab1a3a658d59a8d4fb3e8a/entities/Payment/${entityId}`, {
        method: 'PUT',
        headers: {
            'api_key': 'c95b214954694e54a68f052c06b0c9d1', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    console.log(data);
}