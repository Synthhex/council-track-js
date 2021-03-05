export interface ServerConfig {
    port: number,
    sql: {
        host: string,
        user: string,
        password: string,
        database: string,
        port: number
    }
}