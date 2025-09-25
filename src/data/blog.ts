export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: number; // in minutes
}

export const dummyBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "10 Tips for First-Time Home Buyers",
    excerpt: "Essential advice for navigating your first home purchase with confidence and avoiding common pitfalls.",
    content: "Full article content here...",
    author: "Sarah Johnson",
    date: "March 15, 2024",
    category: "Buying Tips",
    image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&h=600&fit=crop",
    readTime: 8
  },
  {
    id: 2,
    title: "Real Estate Market Trends 2024",
    excerpt: "Comprehensive analysis of current market conditions and predictions for the upcoming year.",
    content: "Full article content here...",
    author: "Michael Chen",
    date: "March 12, 2024",
    category: "Market Analysis",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
    readTime: 12
  },
  {
    id: 3,
    title: "Staging Your Home for a Quick Sale",
    excerpt: "Professional staging tips to make your property more appealing to potential buyers.",
    content: "Full article content here...",
    author: "Emily Rodriguez",
    date: "March 10, 2024",
    category: "Selling Tips",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    readTime: 6
  },
  {
    id: 4,
    title: "Investment Properties: What to Look For",
    excerpt: "Key factors to consider when evaluating properties for investment potential and rental income.",
    content: "Full article content here...",
    author: "David Park",
    date: "March 8, 2024",
    category: "Investment",
    image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&h=600&fit=crop",
    readTime: 10
  },
  {
    id: 5,
    title: "Understanding Mortgage Options",
    excerpt: "A comprehensive guide to different types of mortgages and how to choose the right one for you.",
    content: "Full article content here...",
    author: "Isabella Martinez",
    date: "March 5, 2024",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop",
    readTime: 9
  },
  {
    id: 6,
    title: "Home Inspection Checklist",
    excerpt: "Essential items to inspect when viewing a potential property to avoid costly surprises.",
    content: "Full article content here...",
    author: "James Wilson",
    date: "March 3, 2024",
    category: "Buying Tips",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop",
    readTime: 7
  }
];