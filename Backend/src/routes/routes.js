"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authentication_1 = require("../Controllers/Authentication");
const router = (0, express_1.Router)();
router.post('/auth/login', Authentication_1.AuthenticationLogin);
router.post('/auth/signUp', Authentication_1.AuthenticationSignUp);
router.get('/auth/check', Authentication_1.MiddleJWTverify, (req, res) => {
    if (req.user) {
        res.json({ authenticated: true, user: req.user });
    }
    else {
        res.json({ authenticated: false });
    }
});
exports.default = router;
