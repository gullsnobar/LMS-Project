import { Document, model, Schema } from "mongoose";

interface FaqItem extends Document{
    question: string;
    answer: string;
}
interface Category extends Document{
    name: string;
    slug: string;
}

interface BannerImage extends Document{
    public_id: string;
    secure_url: string;
}

interface Layout extends Document{
    type: string;
    faq: FaqItem[];
    category: Category[];
    banner: {
        image: BannerImage[];
        title: string;
        subTitle: string;
        button: string;
        link: string;
    }
}

const faqSchema = new Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
});

const categorySchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
});

const bannerImageSchema = new Schema({
    public_id: { type: String, required: true },
    secure_url: { type: String, required: true },
});

const layoutSchema = new Schema({
    type: { type: String, required: true },
    faq: [faqSchema],
    category: [categorySchema],
    banner: {
        image: [bannerImageSchema],
        title: { type: String, required: true },
        subTitle: { type: String, required: true },
        button: { type: String, required: true },
        link: { type: String, required: true },
    }
});

const LayoutModel = model<Layout>("Layout", layoutSchema);

export default LayoutModel;
