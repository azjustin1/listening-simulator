const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partSchema = new Schema({
    title: { type: String },
    description: { type: String },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
}, { timestamps: true });

module.exports = mongoose.model('Part', partSchema);
