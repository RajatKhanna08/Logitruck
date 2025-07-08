import mongoose from "mongoose";

const paymentsSchema = new mongoose.Schema({
	orderId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ordersModel',
		required: true,
	},

	customerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'company',
		required: true
	},

	transporterId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'transporters',
		required: true
	},

	amount: {
		type: Number,
		required: true
	},

	commission: {
		type: Number,
		required: true
	},

	payoutAmount: {
		type: Number,
		required: true
	},

	currency: {
		type: String,
		default: "INR",
		required: true
	},

	paymentMode: {
		type: String,
		enum: ["UPI", "Net Banking", "Credit Card"],
		default: "UPI",
		required: true
	},

	paymentGateway: {
		name: {
			type: String,
			required: true
		},

		razorpayOrderId: {
			type: String,
			required: true
		},

		razorpayPaymentId: {
			type: String,
			required: true
		},

		razorpaySignature: {
			type: String,
			required: true
		},

		response: {
			type: mongoose.Schema.Types.Mixed,
			required: true
		}
	},
	paymentInvoice: {
		type: String,
		required: true,
		unique: true
	},

	paidAt: {
		type: Date,
		default: null
	},
	refundedAt: {
		type: Date,
		default: null
	},

	refundAmount: {
		type: Number,
		default: 0
	},
	refundReason: {
		type: String
	},

	refundStatus: {
		type: String,
		enum: ["not_requested", "pending", "approved", "rejected", "processed", "failed"],
		default: "not_requested"
	},

	paymentStatus: {
		type: String,
		enum: ["pending", "paid", "refunded", "failed"],
		default: "pending"
	},

	isAdvance: {
		type: Boolean,
		default: false
	},

	advanceDiscount: {
		type: Number,
		default: 0
	}
});

// Virtual field to calculate payout dynamically
paymentsSchema.virtual("calculatedPayout").get(function () {
	return this.amount - this.commission;
});

paymentsSchema.set("toJSON", { virtuals: true });
paymentsSchema.set("toObject", { virtuals: true });

const paymentsModel = mongoose.model("payments", paymentsSchema);
export default paymentsModel;
