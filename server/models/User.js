/* ============================================================
   models/User.js  —  Mongoose User Schema
   ============================================================ */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  [true, 'Name is required'],
      trim:      true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select:    false,
    },

    // ── Avatar / Profile fields ───────────────────────────────
    coachName: {
      type:      String,
      default:   'Coach',
      trim:      true,
      maxlength: [30, 'Coach name cannot exceed 30 characters'],
    },
    gender: {
      type:    String,
      enum:    ['male', 'female'],
      default: 'male',
    },
    fitnessGoal: {
      type:    String,
      enum:    ['lose_weight', 'build_muscle', 'maintain_fitness', 'endurance', 'flexibility', 'general_health'],
      default: 'general_health',
    },
    fitnessLevel: {
      type:    String,
      enum:    ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    coachingStyle: {
      type:    String,
      enum:    ['motivational', 'calm', 'strict'],
      default: 'motivational',
    },

    // ── Auto-computed from workout count (see utils/calcAvatarStage) ──
    avatarStage: {
      type:    String,
      enum:    ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
  },
  {
    timestamps: true,
  }
);

// ── Hash password before saving ──────────────────────────────
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt    = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: compare password ────────────────────────
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
