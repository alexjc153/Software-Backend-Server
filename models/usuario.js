var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio.'] },
    username: { type: String, unique: true, required: [true, 'El nombre de usuario es obligatorio.'] },
    password: { type: String, required: [true, 'La contraseña es obligatoria.'] },
    img: { type: String },
    perfil: { type: Schema.Types.ObjectId, ref: 'Perfil', required: [true, 'El perfil es obligatorio.'] }
}, { collection: 'usuarios' });

usuarioSchema.plugin(uniqueValidator, { message: 'El nombre de usuario debe ser único.' });

module.exports = mongoose.model('Usuario', usuarioSchema);