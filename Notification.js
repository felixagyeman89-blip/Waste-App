// JavaScript Example: Reading Entities
// Filterable fields: title, message, type, recipient_user_type, is_read, link_to
async function fetchNotificationEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/68ab1a3a658d59a8d4fb3e8a/entities/Notification`, {
        headers: {
            'api_key': 'c95b214954694e54a68f052c06b0c9d1', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: title, message, type, recipient_user_type, is_read, link_to
async function updateNotificationEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/68ab1a3a658d59a8d4fb3e8a/entities/Notification/${entityId}`, {
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