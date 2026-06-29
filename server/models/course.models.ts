import mongoose, { Document, Schema } from "mongoose";

/* -------------------- Interfaces -------------------- */

interface IComment {
  user: object;
  comment: string;
  commentReply?: IComment[];
}

interface IReview {
  user: object;
  rating: number;
  review: string;
}

interface ILink {
  chapterName: string;
  partName: string;
  videoUrl: string;
}

interface ICourseData {
  title: string;
  description: string;
  videoUrl: string;
  videoCipherVideoId?: string;
  category: string;
  price: number;
  publishedBy: string;
  posterUrl: string;
  chapters: ILink[];
  reviews: IReview[];
  comments: IComment[];
  createdAt: Date;
}

export interface ICourse extends Document {
  name: string;
  slug?: string;
  description: string;
  price: number;
  estimatedTime?: number;
  thumbnail: {
    public_id: string;
    url: string;
  };
  tags: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  demoUrl?: string;
  videoCipherVideoId?: string;
  freePreviewEnabled?: boolean;
  benefits: string[];
  courseData: ICourseData[];
  prerequisites?: string[];
  targetAudience?: string[];
  reviews: IReview[];
  ratings: number;
  purchased: number;
  numOfReviews: number;
  instructor: object;
}



const reviewSchema = new Schema<IReview>(
  {
    user: { type: Object, required: true },
    rating: { type: Number, required: true },
    review: { type: String, required: true },
  },
  { _id: false }
);

const linkSchema = new Schema<ILink>(
  {
    chapterName: { type: String, required: true },
    partName: { type: String, required: true },
    videoUrl: { type: String, required: true },
  },
  { _id: false }
);

const commentSchema = new Schema<IComment>(
  {
    user: { type: Object, required: true },
    comment: { type: String, required: true },
    commentReply: [],
  },
  { _id: false }
);

const courseDataSchema = new Schema<ICourseData>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    videoCipherVideoId: { type: String },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    publishedBy: { type: String, required: true },
    posterUrl: { type: String, required: true },
    chapters: [linkSchema],
    reviews: [reviewSchema],
    comments: [commentSchema],
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const courseSchema = new Schema<ICourse>(
  {
    name: { type: String, required: true },
    slug: { type: String },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    estimatedTime: { type: Number },

    thumbnail: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },

    tags: { type: String, required: true },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },

    demoUrl: { type: String },

    videoCipherVideoId: { type: String },

    freePreviewEnabled: { type: Boolean, default: false },

    benefits: [{ type: String, required: true }],

    courseData: [{ type: courseDataSchema, required: true }],

    prerequisites: [{ type: String }],

    targetAudience: [{ type: String }],

    reviews: [reviewSchema],

    ratings: { type: Number, default: 0 },

    purchased: { type: Number, default: 0 },

    numOfReviews: { type: Number, default: 0 },

    instructor: { type: Object, required: true },
  },
  { timestamps: true }
);

/* -------------------- Indexes -------------------- */

courseSchema.index({
  name: "text",
  description: "text",
  tags: "text",
});

/* -------------------- Model -------------------- */

const Course = mongoose.model<ICourse>("Course", courseSchema);

export default Course;
