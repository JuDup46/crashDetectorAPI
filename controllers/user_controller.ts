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

    /**
     * Récupération d'un utilisateur depuis son email :
     * @param email
     */
    async getUserByEmail(email: string): Promise<Object | null> {
        //récupération de l'utilisateur
        const res = await this.connection.query(`SELECT *
                                                 FROM users
                                                 where email = '${email}'`);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                return new Object({
                    id: Number.parseInt(row["idusers"]),
                    nom : row["nom"],
                    prenom : row["prenom"],
                    email: row["email"],
                    tel : row["tel"],
                    idgoogle : row["idgoogle"],
                    idscooter : row["idscooter"],
                });
            }
        }
        return null;
    }

    async getUserTelWithEmail(email: string): Promise<string|null>{
        //récupération de l'utilisateur
        const res = await this.connection.query(`SELECT *
                                                 FROM users
                                                 where email = '${email}'`);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                return row["tel"];
            }
        }
        return null;
    }

    async getUserByEmailAndidScooter(email: string, idScooter: string): Promise<Object | null> {
        //récupération de l'utilisateur
        const res = await this.connection.query(`SELECT *
                                                 FROM users
                                                 where email = '${email}'`);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                return new Object({
                    id: Number.parseInt(row["idusers"]),
                    nom : row["nom"],
                    prenom : row["prenom"],
                    email: row["email"],
                    tel : row["tel"],
                    idgoogle : row["idgoogle"],
                    idscooter : row["idscooter"],
                });
            }
        }
        return null;
    }
    /**
     * Création d'un user
     * @param options
     */
    async createUser( nom:string, prenom:string, email:string, tel:string, idgoogle:string, idscooter:string): Promise<Object | null | string> {

        if (nom === undefined || prenom === undefined ||
            email === undefined || tel === undefined ||
            idgoogle === undefined || idscooter === undefined) {
            return null;
        }

        if (await this.getUserByEmail(email) !== null) {
            return "Their is already an user associated to this email";
        }

        const res = await this.connection.execute(`INSERT INTO users (nom, prenom, email, tel, idgoogle, idscooter)
                                                   VALUES (?, ?, ?, ?, ?, ?)`,
            [
                nom,
                prenom,
                email,
                tel,
                idgoogle,
                idscooter
            ]);
        const headers = res[0] as ResultSetHeader;
        if (headers.affectedRows === 1) {
            return this.getUserByEmail(email);
        }
        return null;
    }



    async deleteUserById(idUser: string): Promise<Object | null | string> {
        const res = await this.connection.execute(`DELETE from users where idusers = '${idUser}'`);
        await this.connection.commit();
        return null;
    }



}
