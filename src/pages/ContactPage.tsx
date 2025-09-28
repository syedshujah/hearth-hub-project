import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation before submit
    const emailValid = /.+@.+\..+/.test(formData.email);
    const phoneValid = !formData.phone || /[\d+()\-\s]{7,}/.test(formData.phone);
    if (!emailValid) {
      toast({ title: "Invalid email", description: "Please enter a valid email address." });
      return;
    }
    if (!phoneValid) {
      toast({ title: "Invalid phone number", description: "Please enter a valid phone number or leave it blank." });
      return;
    }

    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      setLoading(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Office Address",
      details: ["123 Real Estate Avenue", "Property City, PC 12345"]
    },
    {
      icon: Phone,
      title: "Phone Number",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"]
    },
    {
      icon: Mail,
      title: "Email Address",
      details: ["info@propertyhub.com", "support@propertyhub.com"]
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat - Sun: 10:00 AM - 4:00 PM"]
    }
  ];

  // Helpers for actionable contact details
  const formatPhoneForDial = (phone: string) => phone.replace(/[^+\d]/g, "");
  const openTel = (num: string) => window.open(`tel:${formatPhoneForDial(num)}`);
  const openMail = (addr: string) => window.open(`mailto:${addr}`);
  const openMap = (address: string) => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, "_blank");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-foreground mb-6">Contact Us</h1>
              <p className="text-xl text-muted-foreground">
                Get in touch with our real estate experts
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="property-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your property needs..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="property-card p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {info.title}
                        </h3>
                        {info.details.map((detail, idx) => (
                          <p
                            key={idx}
                            className="text-muted-foreground"
                            onClick={() => {
                              if (info.title === "Phone Number") openTel(detail);
                              else if (info.title === "Email Address") openMail(detail);
                              else if (info.title === "Office Address") openMap(detail);
                            }}
                          >
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Section */}
            <div className="mt-16">
              <div className="property-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Find Our Office</h2>
                <div className="bg-muted rounded-lg h-64 overflow-hidden">
                  <iframe
                    title="Office location map"
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${encodeURIComponent('123 Real Estate Avenue, Property City, PC 12345')}&hl=en&z=14&output=embed`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;