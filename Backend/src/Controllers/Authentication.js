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
exports.MiddleJWTverify = exports.AuthenticationSignUp = exports.AuthenticationLogin = void 0;
const usuario_1 = require("../Models/Tables/usuario");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.configDotenv();
const SECRET = process.env.SECRET || 'defaultsecret';
const nodeEnv = process.env.NODE_ENV;
const AuthenticationLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Usuário e senha são obrigatórios');
    }
    try {
        const pass = yield (0, usuario_1.getDatadforlogin)(username);
        if (!pass) {
            return res.status(400).send('Usuário não encontrado');
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, pass);
        if (!isPasswordValid) {
            return res.status(400).send('Usuário ou senha inválidos');
        }
        const token = jsonwebtoken_1.default.sign({ username }, SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: nodeEnv === 'production',
            sameSite: 'strict',
            maxAge: 3600000,
        });
        return res.json({ message: "Login bem Sucedido!" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('Erro ao realizar login');
    }
});
exports.AuthenticationLogin = AuthenticationLogin;
const AuthenticationSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { username, password, email } = req.body;
    if (!username || !password) {
        return res.status(400).send('Usuário e senha são obrigatórios');
    }
    try {
        const hashPass = yield bcryptjs_1.default.hash(password, 10);
        yield (0, usuario_1.AddINbase)(username, hashPass, email);
        return res.status(201).json({ message: 'Usuário criado com sucesso' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao criar usuário' });
    }
});
exports.AuthenticationSignUp = AuthenticationSignUp;
const MiddleJWTverify = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies.token;
        if (!token) {
            res.status(403).json({ message: "Token não fornecido" });
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, SECRET);
            req.user = { username: decoded.username };
            next();
        }
        catch (err) {
            res.status(401).json({ message: 'Token inválido ou expirado' });
        }
    });
};
exports.MiddleJWTverify = MiddleJWTverify;
