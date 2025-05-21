import React from 'react';
import TestimonialCard from './testimonialCard';

const Testimonials = () => {
  const testimonials = [
    {
      content: "CollaboSketch has completely transformed how our design team collaborates. The real-time editing and infinite canvas are game-changers for our brainstorming sessions.",
      author: "Sophia Chen",
      role: "Product Designer at Droplet",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
      content: "As a remote team, we needed a tool that would help us visualize concepts together. CollaboSketch's collaborative features feel just like being in the same room with your team.",
      author: "Marcus Johnson",
      role: "Engineering Lead at Visionary",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
      content: "The hand-drawn style of CollaboSketch gives our presentations a personal touch that our clients love. It's become our go-to tool for client meetings and proposals.",
      author: "Olivia Martinez",
      role: "Creative Director at Artisan",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
    }
  ];

  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Loved by creators worldwide</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of teams who have transformed their collaborative design process.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              content={testimonial.content}
              author={testimonial.author}
              role={testimonial.role}
              avatar={testimonial.avatar}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            {['Google', 'Microsoft', 'Airbnb', 'Netflix', 'Spotify'].map((company, index) => (
              <div key={index} className="text-gray-500 font-semibold text-lg">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;