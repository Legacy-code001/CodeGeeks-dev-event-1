import mongoose, { Schema, type HydratedDocument, type Model } from 'mongoose';

export type EventMode = 'online' | 'offline' | 'hybrid' | (string & {});

export interface Event {
  title: string;
  slug?: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: EventMode;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type EventDocument = HydratedDocument<Event>;

const toSlug = (title: string): string =>
  title
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    // strip diacritics
    .replace(/[\u0300-\u036f]/g, '')
    // collapse non-alphanumerics into '-'
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);

const normalizeDateToIso = (input: string): string => {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) throw new Error('Event.date must be a valid date');
  return d.toISOString();
};

const normalizeTimeToHHmm = (input: string): string => {
  const value = input.trim();

  // 24h formats: HH:mm or HH:mm:ss
  const m24 = /^([01]?\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(value);
  if (m24) {
    const hh = m24[1].padStart(2, '0');
    const mm = m24[2];
    return `${hh}:${mm}`;
  }

  // 12h formats: h[:mm] AM/PM
  const m12 = /^(\d{1,2})(?::([0-5]\d))?\s*(AM|PM)$/i.exec(value);
  if (m12) {
    const rawH = Number(m12[1]);
    const rawM = m12[2] ? Number(m12[2]) : 0;
    const meridiem = m12[3].toUpperCase();

    if (rawH < 1 || rawH > 12) throw new Error('Event.time has an invalid hour');
    if (rawM < 0 || rawM > 59) throw new Error('Event.time has an invalid minute');

    const hh24 = (rawH % 12) + (meridiem === 'PM' ? 12 : 0);
    return `${String(hh24).padStart(2, '0')}:${String(rawM).padStart(2, '0')}`;
  }

  throw new Error('Event.time must be in HH:mm (24h) or h[:mm] AM/PM format');
};

const nonEmptyTrimmedString = {
  validator: (v: string): boolean => v.trim().length > 0,
  message: 'Field must be a non-empty string',
};

const nonEmptyStringArray = {
  validator: (v: string[]): boolean =>
    Array.isArray(v) && v.length > 0 && v.every((s) => typeof s === 'string' && s.trim().length > 0),
  message: 'Field must be a non-empty array of non-empty strings',
};

const EventSchema = new Schema<Event>(
  {
    title: { type: String, required: true, trim: true, validate: nonEmptyTrimmedString },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true, trim: true, validate: nonEmptyTrimmedString },
    overview: { type: String, required: true, trim: true, validate: nonEmptyTrimmedString },
    image: { type: String, required: true, trim: true, validate: nonEmptyTrimmedString },
    venue: { type: String, required: true, trim: true, validate: nonEmptyTrimmedString },
    location: { type: String, required: true, trim: true, validate: nonEmptyTrimmedString },
    date: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v: string): boolean => !Number.isNaN(new Date(v).getTime()),
        message: 'Event.date must be a valid date string',
      },
    },
    time: {
      type: String,
      required: true,
      trim: true,
      validate: {
        // Validate using the same parsing rules we normalize with.
        validator: (v: string): boolean => {
          try {
            normalizeTimeToHHmm(v);
            return true;
          } catch {
            return false;
          }
        },
        message: 'Event.time must be in HH:mm (24h) or h[:mm] AM/PM format',
      },
    },
    mode: { type: String, required: true, trim: true, validate: nonEmptyTrimmedString },
    audience: { type: String, required: true, trim: true, validate: nonEmptyTrimmedString },
    agenda: { type: [String], required: true, validate: nonEmptyStringArray },
    organizer: { type: String, required: true, trim: true, validate: nonEmptyTrimmedString },
    tags: { type: [String], required: true, validate: nonEmptyStringArray },
  },
  {
    timestamps: true,
  }
);

// Unique index for fast slug lookups and uniqueness enforcement.
EventSchema.index({ slug: -1 }, { unique: true });

EventSchema.pre('save', function (this: EventDocument) {
  // Throwing from middleware cleanly aborts the save with a consistent error.

  // Only regenerate slug when the title changes.
  if (this.isModified('title') || !this.slug) this.slug = toSlug(this.title);

  // Normalize date/time to consistent formats at write time.
  this.date = normalizeDateToIso(this.date);
  this.time = normalizeTimeToHHmm(this.time);

  // Extra guardrails for required fields (schema validators still run too).
  const requiredStrings: Array<[string, string]> = [
    ['title', this.title],
    ['description', this.description],
    ['overview', this.overview],
    ['image', this.image],
    ['venue', this.venue],
    ['location', this.location],
    ['date', this.date],
    ['time', this.time],
    ['mode', String(this.mode)],
    ['audience', this.audience],
    ['organizer', this.organizer],
  ];

  for (const [field, value] of requiredStrings) {
    if (value.trim().length === 0) throw new Error(`Event.${field} is required`);
  }

  const requiredArrays: Array<[string, string[]]> = [
    ['agenda', this.agenda],
    ['tags', this.tags],
  ];

  for (const [field, arr] of requiredArrays) {
    if (!Array.isArray(arr) || arr.length === 0 || arr.some((s) => s.trim().length === 0)) {
      throw new Error(`Event.${field} must be a non-empty array of non-empty strings`);
    }
  }
});

export const Event: Model<Event> =
  (mongoose.models.Event as Model<Event> | undefined) ?? mongoose.model<Event>('Event', EventSchema);
