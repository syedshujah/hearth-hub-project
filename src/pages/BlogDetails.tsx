import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { dummyBlogPosts } from "@/data/blog";
import { Calendar, User, Tag } from "lucide-react";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = dummyBlogPosts.find(p => p.id === parseInt(id || "0"));
  const sorted = [...dummyBlogPosts].sort((a, b) => a.id - b.id);
  const idx = sorted.findIndex(p => p.id === (post?.id ?? -1));

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Post Not Found</h1>
            <p className="text-lg text-muted-foreground">
              The blog post you're looking for doesn't exist.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Keyboard navigation between posts (Left/Right)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (idx < 0) return;
      if (e.key === "ArrowLeft" && idx > 0) navigate(`/blog/${sorted[idx - 1].id}`);
      if (e.key === "ArrowRight" && idx < sorted.length - 1) navigate(`/blog/${sorted[idx + 1].id}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <article className="property-card p-8">
              <div className="mb-8">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span className="cursor-pointer underline-offset-2 hover:underline" onClick={() => navigate(`/blog?category=${encodeURIComponent(post.category)}`)}>{post.category}</span>
                  </div>
                </div>

                <h1 className="text-4xl font-bold text-foreground mb-6">{post.title}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-foreground leading-relaxed mb-6">{post.content}</p>

                <p className="text-foreground leading-relaxed mb-6">
                  Real estate markets are constantly evolving, and staying informed about the latest 
                  trends is crucial for both buyers and sellers. In this comprehensive guide, we'll 
                  explore the current state of the property market and what it means for your real 
                  estate decisions.
                </p>

                <h2 className="text-2xl font-bold text-foreground mb-4">Market Overview</h2>
                <p className="text-foreground leading-relaxed mb-6">
                  The current real estate landscape shows interesting patterns that reflect broader 
                  economic conditions. Interest rates, employment levels, and regional development 
                  all play significant roles in shaping property values and availability.
                </p>

                <h2 className="text-2xl font-bold text-foreground mb-4">Key Insights for Buyers</h2>
                <ul className="list-disc list-inside text-foreground space-y-2 mb-6">
                  <li>Research local market conditions thoroughly before making an offer</li>
                  <li>Consider both current and future neighborhood development plans</li>
                  <li>Factor in additional costs like maintenance, taxes, and insurance</li>
                  <li>Work with experienced real estate professionals for guidance</li>
                </ul>

                <h2 className="text-2xl font-bold text-foreground mb-4">Tips for Sellers</h2>
                <p className="text-foreground leading-relaxed mb-6">
                  If you're considering selling your property, timing and presentation are key 
                  factors that can significantly impact your success. Professional staging, 
                  competitive pricing, and effective marketing strategies can help you achieve 
                  the best possible outcome.
                </p>

                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-foreground mb-3">Key Takeaway</h3>
                  <p className="text-muted-foreground">
                    Whether you're buying or selling, working with knowledgeable professionals 
                    and staying informed about market trends will help you make confident 
                    real estate decisions.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetails;