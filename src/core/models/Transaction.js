import { Schema, model, models } from "mongoose";

// Define the Status enum
const Status = {
    INITIATED: "initiated",
    PENDING: "pending",
    COMPLETED: "completed",
    CANCELED: "canceled"
};


const TransactionSchema = new Schema({
    requesterId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    requestId: {
        type: Schema.Types.ObjectId,
        ref: "Request",

    },
    donorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    itemId: {
        type: Schema.Types.ObjectId,
        ref: "Item",
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

const TransactionModel = models?.Transaction || model("Transaction", TransactionSchema);
export { TransactionModel, Status };