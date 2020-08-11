var express = require('express');
var bcrypt = require('bcryptjs');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../models/usuario');

// =====================================================
// Obtener todos los Usuarios
// =====================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre username img perfil')
        .skip(desde)
        .limit(10)
        .populate('perfil', 'nombre')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar los usuarios.',
                        errors: err
                    });
                }

                Usuario.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });

                });

            });

});

// =====================================================
// Verifica Username
// =====================================================

app.post('/verificarUsernameNotTaken', (req, res) => {

    var id = req.body.id;

    Usuario.findOne({ username: req.body.username })
        .then(usuario => {
            // Si el username no existe en la Base de Datos
            if (!usuario) {
                return res.json({
                    usernameNotTaken: true
                });
            }

            // Validar el formulario de edición
            if (usuario) {
                if (usuario === usuario._id.toString()) {
                    return res.json({
                        usernameNotTaken: true
                    });
                } else {
                    return res.json({
                        usernameNotTaken: false
                    });
                }
            }
            // Validar el formulario para crear
            else {
                res.json({
                    usernameNotTaken: false
                });
            }
        })
        .catch(error => {
            res.json({
                usernameNotTaken: true
            })
        })
});

// =====================================================
// Obtener Usuario
// =====================================================

app.get('/:id', (req, res) => {

    var id = req.params.id;

    Usuario.findById(id)
        .populate('perfil')
        .exec(
            (err, usuario) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar el usuario.',
                        errors: err
                    });
                }

                if (!usuario) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El usuario con el id ' + id + ' no existe.',
                        errors: { message: 'No existe ningun usuario con ese ID' }
                    });
                }

                res.status(200).json({
                    ok: true,
                    usuario: usuario
                });
            });

});



// =====================================================
// Actualizar Usuario
// =====================================================

app.put('/:id', [mdAutenticacion.verificaToken], (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar el usuario.',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe.',
                errors: { message: 'No existe ningun usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.username = body.username;
        usuario.perfil = body.perfil;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario.',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });



});

// =====================================================
// Crear un nuevo usuario
// =====================================================

app.post('/', [mdAutenticacion.verificaToken], (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        username: body.username,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        perfil: body.perfil

    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear Usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });
    });

});

// =====================================================
// Eliminar un Usuario
// =====================================================

app.delete('/:id', [mdAutenticacion.verificaToken], (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar Usuario',
                errors: err
            });
        }

        if (!usuarioEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe.',
                errors: { message: 'No existe ningun usuario con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioEliminado
        });
    });
});



module.exports = app;