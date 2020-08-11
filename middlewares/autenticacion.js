var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// =====================================================
// Verificar Token
// =====================================================

exports.verificaToken = function(req, res, next) {


    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto.',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();

    });

};

// =====================================================
// Verificar Admin
// =====================================================

exports.verificaAdmin = function(req, res, next) {

    var usuario = req.usuario;

    if (usuario.perfil === '5eec36ac4b823413f0aa6f88') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - No es Administrador',
            errors: { mensaje: 'No es Administrador, no puede realizar esta acción' }
        });
    }

};