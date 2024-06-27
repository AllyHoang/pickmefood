import { Schema, model, models } from "mongoose";

const CommentSchema = new Schema ({
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }, 
    user: {
        type: Schema.Types.ObjectId, 
        ref: "User"
    }
})

const Comment = models?.Commenet || model("Comment", CommentSchema);

export default Comment;
