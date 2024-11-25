"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatadforlogin = getDatadforlogin;
exports.AddINbase = AddINbase;
const Database_1 = __importDefault(require("../Database"));
function getDatadforlogin(name) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!name || name.trim().length === 0) {
            throw new Error('Nome de usuário inválido');
        }
        const query = `SELECT PASS_HASH FROM usuario WHERE USERNAME LIKE ? LIMIT 1`;
        try {
            const [result] = yield Database_1.default.query(query, [`%${name}%`]);
            if (result.length === 0) {
                return null;
            }
            return result[0].PASS_HASH;
        }
        catch (err) {
            console.error('Erro na consulta:', err);
            throw new Error('Erro ao buscar nome');
        }
    });
}
function AddINbase(name, password, email) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!name || !password) {
            throw new Error('Nome de usuário e senha são obrigatórios');
        }
        const query = `INSERT INTO usuario (USERNAME, PASS_HASH, EMAIL) VALUES (?, ?, ?)`;
        try {
            yield Database_1.default.query(query, [name, password, email]);
            return true;
        }
        catch (err) {
            console.error('Erro ao adicionar usuário:', err);
            throw new Error('Erro ao criar usuário');
        }
    });
}
