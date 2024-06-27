import { Schema, model, models } from "mongoose";

const LikeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
})
const Like = models?.Like || model("Like", LikeSchema);

export default Like;


