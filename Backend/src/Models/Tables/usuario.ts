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


async function AddINbase(name: string, password: string, email: String): Promise<boolean> {
    if (!name || !password) {
        throw new Error('Nome de usuário e senha são obrigatórios');
    }
    const query = `INSERT INTO Users (name, password_hash, email) VALUES (?, ?, ?)`;

    try {
        await db.query(query, [name, password, email]);
        return true; 
    } catch (err) {
        console.error('Erro ao adicionar usuário:', err);
        throw new Error('Erro ao criar usuário');
    }
}

export { getDatadforlogin, AddINbase };
