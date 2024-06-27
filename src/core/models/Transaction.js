import { Status } from "@/lib/utils";
import { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema({
    requesterId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    basketrequestId: {
        type: Schema.Types.ObjectId,
        ref: "BasketRequest",

    },
    donorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    basketId: {
        type: Schema.Types.ObjectId,
        ref: "Basket",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    matchedAt: {
        type: Date,
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.INITIATED,
    },
    agreedByRequester: {
        type: Boolean,
        required: true,
        default: false,
    },
    agreedByDonor: {
        type: Boolean,
        required: true,
        default: false,
    }
});

export const TransactionModel = models?.Transaction || model("Transaction", TransactionSchema);
