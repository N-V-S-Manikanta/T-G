import express from 'express';
import {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  adminResetPassword,
  updateProfile,
  changePassword,
  updateSettings,
} from '../controllers/userController.js';
import { protect, authorize, requireSuperAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();
router.use(protect);

// Self-service (any authenticated user)
router.put('/profile', upload.single('avatar'), updateProfile);
router.put('/password', changePassword);
router.put('/settings', updateSettings);

// Admins can VIEW users; only the super admin can create / edit / delete them.
router.route('/').get(authorize(ROLES.ADMIN), getUsers).post(requireSuperAdmin, createUser);
router.put('/:id/reset-password', requireSuperAdmin, adminResetPassword);
router
  .route('/:id')
  .get(authorize(ROLES.ADMIN), getUser)
  .put(requireSuperAdmin, updateUser)
  .delete(requireSuperAdmin, deleteUser);

export default router;
