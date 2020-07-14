var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var perfilSchema = new Schema({
    nombre: { type: String, unique: true, required: [true, 'El nombre es obligatorio'] },
    descripcion: { type: String },
    estado: { type: String, default: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'perfiles' });

perfilSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser único.' });

module.exports = mongoose.model('Perfil', perfilSchema);