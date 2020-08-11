var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Categoria = require('../models/categoria');
var Grupo = require('../models/grupo');

// =====================================================
// Obtener todas las categorias
// =====================================================
app.get('/', (req, res, next) => {

    Categoria.find({})
        .populate('grupo', 'nombre')
        .exec(
            (err, categorias) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar los categorias',
                        erros: err
                    });
                }

                Categoria.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        categorias: categorias,
                        total: conteo
                    });

                });
            });

});

// =====================================================
// Obtener Categoría
// =====================================================

app.get('/:id', (req, res) => {

    var id = req.params.id;

    Categoria.findById(id)
        .exec(
            (err, categoria) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar el categoria.',
                        errors: err
                    });
                }

                if (!categoria) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'La categoría con el id ' + id + ' no existe.',
                        errors: { message: 'No existe ningun grupo con ese ID' }
                    });
                }

                res.status(200).json({
                    ok: true,
                    categoria: categoria
                });
            });

});

// =====================================================
// Actualizar Categoría
// =====================================================

app.put('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdmin], (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Categoria.findById(id, (err, categoria) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar la categoría.',
                errors: err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La categoria con el id ' + id + ' no existe.',
                errors: { message: 'No existe ninguna categoría con ese ID' }
            });
        }

        categoria.nombre = body.nombre;
        categoria.descripcion = body.descripcion;
        categoria.grupo = body.grupo;



        categoria.save((err, categoriaGuardada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar categoria.',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                categoria: categoriaGuardada
            });
        });

        Grupo.updateOne({ _id: categoria.grupo }, { relacionado: true }, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Grupo Actualizado desde Categoría");
            }
        })
    });



});

// =====================================================
// Crear un nueva Categoría
// =====================================================

app.post('/', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdmin], (req, res) => {

    var body = req.body;

    var categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        grupo: body.grupo,
    });

    categoria.save((err, categoriaGuardada) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear Categoría',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            categoria: categoriaGuardada
        });
    });

});

// =====================================================
// Eliminar un Categoria
// =====================================================

app.delete('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdmin], (req, res) => {

    var id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, grupoEliminado) => {
        // Categoria.findByIdAndRemove(id, (err, grupoEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar Categoria',
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
    });
});


module.exports = app;