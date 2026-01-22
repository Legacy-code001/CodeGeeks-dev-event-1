import mongoose, { Schema, type HydratedDocument, type Model, type Types } from 'mongoose';
import { Event } from './event.model';

export interface Booking {
  eventId: Types.ObjectId;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type BookingDocument = HydratedDocument<Booking>;

const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const BookingSchema = new Schema<Booking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string): boolean => isValidEmail(v),
        message: 'Booking.email must be a valid email address',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for querying bookings by event quickly.
BookingSchema.index({ eventId: 1 });


BookingSchema.pre('save', async function (this: BookingDocument) {
  // Ensure the referenced event exists before persisting the booking.
  if (this.isNew || this.isModified('eventId')) {
    const exists = await Event.exists({ _id: this.eventId });
    if (!exists) throw new Error('Booking.eventId references a non-existent Event');
  }

  // Extra guardrail beyond schema validation.
  if (!isValidEmail(this.email)) throw new Error('Booking.email must be a valid email address');
});

export const Booking: Model<Booking> =
  (mongoose.models.Booking as Model<Booking> | undefined) ??
  mongoose.model<Booking>('Booking', BookingSchema);
