const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all complaints (admin) or user's complaints (student)
router.get('/', auth, async (req, res) => {
  try {
    let query = `
      SELECT c.*, u.name as student_name 
      FROM complaints c 
      JOIN users u ON c.student_id = u.id
    `;
    let params = [];

    if (req.user.role === 'student') {
      query += ' WHERE c.student_id = ?';
      params.push(req.user.userId);
    }

    query += ' ORDER BY c.created_at DESC';

    const [complaints] = await db.execute(query, params);

    res.json(complaints);
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new complaint
router.post('/', [
  auth,
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').notEmpty().withMessage('Category is required'),
  body('priority').isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can create complaints' });
    }

    const { title, description, category, priority } = req.body;

    const [result] = await db.execute(
      'INSERT INTO complaints (title, description, category, priority, student_id) VALUES (?, ?, ?, ?, ?)',
      [title, description, category, priority, req.user.userId]
    );

    // Get the created complaint with student name
    const [complaint] = await db.execute(`
      SELECT c.*, u.name as student_name 
      FROM complaints c 
      JOIN users u ON c.student_id = u.id 
      WHERE c.id = ?
    `, [result.insertId]);

    res.status(201).json({
      message: 'Complaint created successfully',
      complaint: complaint[0]
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update complaint status (admin only)
router.patch('/:id/status', [
  auth,
  body('status').isIn(['pending', 'in-progress', 'resolved', 'rejected']).withMessage('Invalid status'),
  body('adminNotes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update complaint status' });
    }

    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const [result] = await db.execute(
      'UPDATE complaints SET status = ?, admin_notes = ?, updated_at = NOW() WHERE id = ?',
      [status, adminNotes || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Get updated complaint
    const [complaint] = await db.execute(`
      SELECT c.*, u.name as student_name 
      FROM complaints c 
      JOIN users u ON c.student_id = u.id 
      WHERE c.id = ?
    `, [id]);

    res.json({
      message: 'Complaint status updated successfully',
      complaint: complaint[0]
    });
  } catch (error) {
    console.error('Update complaint error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;