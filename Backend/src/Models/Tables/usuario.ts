import db from '../Database'; 


async function getDatadforlogin(name: string): Promise<{ password_hash: string, id_user: number } | null> {
    // Validate input
    if (!name || name.trim().length === 0) {
        throw new Error('Invalid username');
    }

    const query = `SELECT password_hash, id_user FROM Users WHERE name = ? LIMIT 1`; 

    try {
        const [result]: any = await db.query(query, [name.trim()]);  
        if (result.length === 0) {
            return null;  
        }
       
        return {
            password_hash: result[0].password_hash,
            id_user: result[0].id_user
        };  
    } catch (err) {
        console.error('Error fetching user data:', err);
        throw new Error('Error searching for the username');
    }
}


async function AddINbase(name: string, password: string, email: String): Promise<{success: boolean,userId:number}> {
    if (!name || !password) {
        throw new Error('Nome de usuário e senha são obrigatórios');
    }
    const query = `INSERT INTO Users (name, password_hash, email) VALUES (?, ?, ?)`;
    const querygetID = `select id_user from Users where name = ? limit 1`;
    try {
        await db.query(query, [name, password, email]);
        const [result]: any = await db.query(querygetID, [name]);
        return {success: true, userId: result[0].id_user}; 
    } catch (err) {
        console.error('Erro ao adicionar usuário:', err);
        throw new Error('Erro ao criar usuário');
    }
}

async function getUserByEmail(email: string): Promise<{success: boolean, email: string, name: string, userId: number | null}>{
    if (!email || email.trim().length === 0) {
        throw new Error('Invalid email');
    }

    const query = `SELECT email, id_user, name FROM Users WHERE email = ? LIMIT 1`;

    try {
        const [result]: any = await db.query(query, [email.trim()]);
        if (result.length === 0) {
            return {
                success: false,
                email: '',
                name: '',
                userId: null
            };
        }

        return {
            success: true,
            email: result[0].email,
            name: result[0].name,
            userId: result[0].id_user
        };
    } catch (err) {
        console.error('Error fetching user by email:', err);
        throw new Error('Error searching for the email');
    }
}

export { getDatadforlogin, AddINbase, getUserByEmail };
