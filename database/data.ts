import mongoose from 'mongoose';

const SubtaskSchema = new mongoose.Schema({
  title: String,
  isCompleted: Boolean,
});

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  priority: String,
  duedate: String,
});

const ColumnSchema = new mongoose.Schema({
  name: String,
  tasks: [TaskSchema],
});

const BoardSchema = new mongoose.Schema({
  name: String,
  columns: [ColumnSchema],
});

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  boards: [BoardSchema],
});

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

export default UserModel;