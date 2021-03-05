export function generateToken() {
    const pool = "abcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    while(id.length < 36) {
        id += pool[Math.floor(Math.random() * pool.length)];
    }
    return id;
}