export async function generateId() {
    const characters = 'abcdefghijklmnopqrstuvwxyz123456789';
    let length = 6;
    let uniqueId = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uniqueId += characters.charAt(randomIndex);
    }

    return uniqueId;
}