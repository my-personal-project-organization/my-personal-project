export interface Article {
  _id: string;
  userId: string; // Reference to User._id
  mainTitle: string;
  content: ContentSection[];
  createdAt: Date;
  updatedAt: Date;
}

interface ContentSection {
  title: string;
  items: ContentItem[];
}

type ContentItem = DescriptionItem | ImageItem;

interface DescriptionItem {
  type: 'description';
  value: string; // Formatted HTML string
}

interface ImageItem {
  type: 'image';
  value: string; // Image URL
  footer?: string; // Optional image caption
}
