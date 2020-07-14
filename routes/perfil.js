var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Perfil = require('../models/perfil');

// =====================================================
// Obtener todos los perfiles
// =====================================================
app.get('/', (req, res, next) => {

    Perfil.find({})
        .populate('usuario', 'nombre username')
        .exec(
            (err, perfiles) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar los perfiles',
                        erros: err
                    });
                }

                Perfil.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        perfiles: perfiles,
                        total: conteo
                    });

                });
            });

});

// =====================================================
// Obtener Perfil
// =====================================================

app.get('/:id', (req, res) => {

    var id = req.params.id;

    Perfil.findById(id)
        .exec(
            (err, perfil) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar el perfil.',
                        errors: err
                    });
                }

                if (!perfil) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El perfil con el id ' + id + ' no existe.',
                        errors: { message: 'No existe ningun perfil con ese ID' }
                    });
                }

                res.status(200).json({
                    ok: true,
                    perfil: perfil
                });
            });

});

// =====================================================
// Actualizar Perfil
// =====================================================

app.put('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdmin], (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Perfil.findById(id, (err, perfil) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar el perfil.',
                errors: err
            });
        }

        if (!perfil) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El perfil con el id ' + id + ' no existe.',
                errors: { message: 'No existe ningun perfil con ese ID' }
            });
        }

        perfil.nombre = body.nombre;
        perfil.descripcion = body.descripcion;
        perfil.estado = body.estado;
        perfil.usuario = req.usuario._id;

        perfil.save((err, perfilGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar perfil.',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                perfil: perfilGuardado
            });
        });
    });



});

// =====================================================
// Crear un nuevo perfil
// =====================================================

app.post('/', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdmin], (req, res) => {

    var body = req.body;

    var perfil = new Perfil({
        nombre: body.nombre,
        descripcion: body.descripcion,
        perfil: body.perfil,
        usuario: req.usuario._id
    });

    perfil.save((err, perfilGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear Perfil',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            perfil: perfilGuardado
        });
    });

});

// =====================================================
// Eliminar un Perfil
// =====================================================

app.delete('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdmin], (req, res) => {

    var id = req.params.id;

    Perfil.findByIdAndRemove(id, (err, perfilEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar Perfil',
                errors: err
            });
        }

        if (!perfilEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El perfil con el id ' + id + ' no existe.',
                errors: { message: 'No existe ningun perfil con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            perfil: perfilEliminado
        });
    });
});


module.exports = app;