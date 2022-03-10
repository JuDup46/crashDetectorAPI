import {Connection, ResultSetHeader, RowDataPacket} from "mysql2/promise";

interface UserAllOptions {
    limit?: number;
    offset?: number;
}

export class UserController {

    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async getAllUsers(options?: UserAllOptions): Promise<Object[]> {
        //récupération des options
        const limit = options?.limit || 20;
        const offset = options?.offset || 0;

        //récupération des utilisateurs
        const res = await this.connection.query(`SELECT *
                                                 FROM users LIMIT ${offset}, ${limit}`);

        const data = res[0];
        if (Array.isArray(data)) {
            return (data as RowDataPacket[]).map(function (row: any) {
                return new Object({
                    id: Number.parseInt(row["idusers"]),
                    nom : row["nom"],
                    prenom : row["prenom"],
                    email: row["email"],
                    tel : row["tel"],
                    idgoogle : row["idgoogle"],
                    idscooter : row["idscooter"],
                });
            });
        }

        return [];
    }

}