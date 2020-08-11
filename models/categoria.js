var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var categoriaSchema = new Schema({
    nombre: { type: String, unique: true, required: [true, 'El nombre de la categoria es obligatorio.'] },
    descripcion: { type: String },
    grupo: { type: Schema.Types.ObjectId, ref: 'Grupo', required: [true, 'El grupo es obligatorio.'] }
}, { collection: 'categorias' });

categoriaSchema.plugin(uniqueValidator, { message: 'El nombre de la categoria debe ser único.' });

module.exports = mongoose.model('Categoria', categoriaSchema);