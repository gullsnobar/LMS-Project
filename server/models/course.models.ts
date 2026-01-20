import mongoose, { Document, Schema } from 'mongoose';

interface IComment extends Document {
    user: object,
    comment: string
}
interface IReview extends Document {
    user: object,
    rating: number,
    review: string
}

interface ILink extends Document {
    chapterName: string,
    partName: string,
    videoUrl: string
}

interface ICourseData extends Document {
    title: string;
    description: string;
    videoUrl: string;
    category: string;
    price: number;
    publishedBy: string;
    posterUrl: string;
    chapters: ILink[];
    reviews: IReview[];
    comments: IComment[];
    createdAt: Date;
}