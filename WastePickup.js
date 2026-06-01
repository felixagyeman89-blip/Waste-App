// JavaScript Example: Reading Entities
// Filterable fields: customer_id, collector_id, scheduled_date, scheduled_time, waste_type, estimated_weight, pickup_address, pickup_location, status, priority, payment_status, amount, payment_method, special_instructions, actual_weight, completion_notes, customer_rating, photos
async function fetchWastePickupEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/68ab1a3a658d59a8d4fb3e8a/entities/WastePickup`, {
        headers: {
            'api_key': 'c95b214954694e54a68f052c06b0c9d1', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: customer_id, collector_id, scheduled_date, scheduled_time, waste_type, estimated_weight, pickup_address, pickup_location, status, priority, payment_status, amount, payment_method, special_instructions, actual_weight, completion_notes, customer_rating, photos
async function updateWastePickupEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/68ab1a3a658d59a8d4fb3e8a/entities/WastePickup/${entityId}`, {
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