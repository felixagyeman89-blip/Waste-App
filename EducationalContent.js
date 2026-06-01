// JavaScript Example: Reading Entities
// Filterable fields: title, content, category, media_type, media_url, target_audience, difficulty_level, is_featured, view_count, tags
async function fetchEducationalContentEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/68ab1a3a658d59a8d4fb3e8a/entities/EducationalContent`, {
        headers: {
            'api_key': 'c95b214954694e54a68f052c06b0c9d1', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: title, content, category, media_type, media_url, target_audience, difficulty_level, is_featured, view_count, tags
async function updateEducationalContentEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/68ab1a3a658d59a8d4fb3e8a/entities/EducationalContent/${entityId}`, {
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