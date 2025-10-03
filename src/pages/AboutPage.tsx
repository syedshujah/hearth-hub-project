import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-foreground mb-6">About PropertyHub</h1>
              <p className="text-xl text-muted-foreground">
                Your trusted partner in finding the perfect home
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div className="property-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  At PropertyHub, we're committed to making real estate accessible, transparent, 
                  and stress-free. We believe everyone deserves to find their dream home without 
                  the hassle of traditional property hunting.
                </p>
              </div>
              <div className="property-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To become the leading digital platform that revolutionizes how people buy, 
                  sell, and rent properties by leveraging technology and providing exceptional 
                  customer service.
                </p>
              </div>
            </div>

            <div className="property-card p-8 mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Why Choose Us?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Extensive Listings</h3>
                  <p className="text-muted-foreground">
                    Browse thousands of verified properties across multiple locations
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Expert Support</h3>
                  <p className="text-muted-foreground">
                    Get guidance from experienced real estate professionals
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Trusted Platform</h3>
                  <p className="text-muted-foreground">
                    Secure transactions and verified property information
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-6">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of satisfied customers who found their perfect home with us
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/listings" 
                  className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Browse Properties
                </a>
                <a 
                  href="/complaints" 
                  className="inline-flex items-center justify-center px-8 py-3 border border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  Submit Complaint
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;