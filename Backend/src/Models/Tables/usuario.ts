import db from '../Database'; 


async function getDatadforlogin(name: string): Promise<string | null> {
    if (!name || name.trim().length === 0) {
        throw new Error('Nome de usuário inválido');
    }

    const query = `SELECT PASS_HASH FROM usuario WHERE USERNAME LIKE ? LIMIT 1`;
    try {
        const [result]: any = await db.query(query, [`%${name}%`]);
        if (result.length === 0) {
            return null; 
        }
       
        return result[0].PASS_HASH;
    } catch (err) {
        console.error('Erro na consulta:', err);
        throw new Error('Erro ao buscar nome');
    }
}


async function AddINbase(name: string, password: string, email: String): Promise<boolean> {
    if (!name || !password) {
        throw new Error('Nome de usuário e senha são obrigatórios');
    }
    const query = `INSERT INTO usuario (USERNAME, PASS_HASH, EMAIL) VALUES (?, ?, ?)`;

    try {
        await db.query(query, [name, password, email]);
        return true; 
    } catch (err) {
        console.error('Erro ao adicionar usuário:', err);
        throw new Error('Erro ao criar usuário');
    }
}

export { getDatadforlogin, AddINbase };
