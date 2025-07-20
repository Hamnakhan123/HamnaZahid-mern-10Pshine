const Note = require('../models/Note');
const logger = require('../utils/logger');

exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.create({ title, content, userId: req.user.id });
    logger.info(`Note created by user ${req.user.id}`);
    res.status(201).json(note);
  } catch (err) {
    logger.error('Create Note Error:', err);
    res.status(500).json({ message: 'Error creating note' });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.findAll({ where: { userId: req.user.id } });
    res.json(notes);
  } catch (err) {
    logger.error('Get Notes Error:', err);
    res.status(500).json({ message: 'Error fetching notes' });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    logger.error('Get Note by ID Error:', err);
    res.status(500).json({ message: 'Error fetching note' });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.title = title;
    note.content = content;
    await note.save();

    logger.info(`Note updated by user ${req.user.id}`);
    res.json(note);
  } catch (err) {
    logger.error('Update Note Error:', err);
    res.status(500).json({ message: 'Error updating note' });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const deleted = await Note.destroy({ where: { id: req.params.id, userId: req.user.id } });
    if (!deleted) return res.status(404).json({ message: 'Note not found' });

    logger.info(`Note deleted by user ${req.user.id}`);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    logger.error('Delete Note Error:', err);
    res.status(500).json({ message: 'Error deleting note' });
  }
};
