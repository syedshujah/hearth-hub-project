import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { dummyBlogPosts } from "@/data/blog";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BlogPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const search = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [category, setCategory] = useState<string>(search.get("category") || "");

  useEffect(() => {
    const next = new URLSearchParams(location.search);
    if (category) next.set("category", category); else next.delete("category");
    navigate({ search: next.toString() }, { replace: true });
  }, [category]);

  const posts = useMemo(() => {
    if (!category) return dummyBlogPosts;
    return dummyBlogPosts.filter(p => p.category === category);
  }, [category]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-foreground mb-6">Real Estate Blog</h1>
              <p className="text-xl text-muted-foreground">
                Stay updated with the latest trends, tips, and insights in real estate
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} onCategoryClick={(c) => setCategory(c)} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;