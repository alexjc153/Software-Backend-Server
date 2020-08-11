var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Grupo = require('../models/grupo');
var Categoria = require('../models/categoria');

// =====================================================
// Obtener todos los grupos
// =====================================================
app.get('/', (req, res, next) => {

    Grupo.find({})
        .exec(
            (err, grupos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar los grupos',
                        erros: err
                    });
                }

                Grupo.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        grupos: grupos,
                        total: conteo
                    });

                });
            });

});

// =====================================================
// Obtener Grupo
// =====================================================

app.get('/:id', (req, res) => {

    var id = req.params.id;

    Grupo.findById(id)
        .exec(
            (err, grupo) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar el grupo.',
                        errors: err
                    });
                }

                if (!grupo) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El grupo con el id ' + id + ' no existe.',
                        errors: { message: 'No existe ningun grupo con ese ID' }
                    });
                }

                res.status(200).json({
                    ok: true,
                    grupo: grupo
                });
            });

});

// =====================================================
// Actualizar Grupo
// =====================================================

app.put('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdmin], (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Grupo.findById(id, (err, grupo) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar el grupo.',
                errors: err
            });
        }

        if (!grupo) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El grupo con el id ' + id + ' no existe.',
                errors: { message: 'No existe ningun grupo con ese ID' }
            });
        }

        grupo.nombre = body.nombre;
        grupo.descripcion = body.descripcion;
        grupo.estado = body.estado;

        grupo.save((err, grupoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar grupo.',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                grupo: grupoGuardado
            });
        });
    });



});

// =====================================================
// Crear un nuevo grupo
// =====================================================

app.post('/', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdmin], (req, res) => {

    var body = req.body;

    var grupo = new Grupo({
        nombre: body.nombre,
        descripcion: body.descripcion,
        estado: body.estado,
    });

    grupo.save((err, grupoGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear Grupo',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            grupo: grupoGuardado
        });
    });

});

// =====================================================
// Eliminar un Grupo
// =====================================================

app.delete('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdmin], (req, res) => {

    var id = req.params.id;

    Categoria.findOne({ grupo: id }, (err, relacionado) => {
        if (!relacionado) {
            Grupo.findByIdAndRemove(id, (err, grupoEliminado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al eliminar Grupo',
                        errors: err
                    });
                }

                if (!grupoEliminado) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El grupo con el id ' + id + ' no existe.',
                        errors: { message: 'No existe ningun grupo con ese ID' }
                    });
                }


                res.status(200).json({
                    ok: true,
                    grupo: grupoEliminado
                });
            })
        } else {
            return res.status(423).json({
                ok: false,
                mensaje: 'El registro está relacionado con Categorías',
                errors: { message: 'El registro está relacionado con Categorías' }
            });
        }
    })






});


module.exports = app;