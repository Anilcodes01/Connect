import mongoose, { mongo } from "mongoose";

const mutualFriendSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mutualFriend: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  count: {
    type: Number,
    defauld: 0,
  },
});

const MutualFriend = mongoose.model("MutualFriend", mutualFriendSchema);

export default MutualFriend;
