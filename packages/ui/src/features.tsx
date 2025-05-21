import React from 'react';
import { Paintbrush as PaintBrush, Users, Download, Shuffle, Pen, Layers, Lightbulb, Lock } from 'lucide-react';
import FeatureCard from './featureCard';

const Features = () => {
  const features = [
    {
      icon: <PaintBrush className="h-6 w-6 text-purple-600" />,
      title: 'Beautiful Hand-Drawn Style',
      description: 'Create CollaboSketch es that look like they were drawn with a real pen on paper.'
    },
    {
      icon: <Users className="h-6 w-6 text-purple-600" />,
      title: 'Real-Time Collaboration',
      description: 'Work together with your team in real-time, no matter where they are located.'
    },
    {
      icon: <Shuffle className="h-6 w-6 text-purple-600" />,
      title: 'Infinite Canvas',
      description: 'Never run out of space with our infinite canvas that grows with your ideas.'
    },
    {
      icon: <Download className="h-6 w-6 text-purple-600" />,
      title: 'Export Options',
      description: 'Save your work as PNG, SVG, or PDF to use in presentations or documents.'
    },
    {
      icon: <Pen className="h-6 w-6 text-purple-600" />,
      title: 'Smart Drawing',
      description: 'Our intelligent recognition system helps perfect your shapes automatically.'
    },
    {
      icon: <Layers className="h-6 w-6 text-purple-600" />,
      title: 'Layers & Organization',
      description: 'Organize your designs with layers to create complex illustrations easily.'
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-purple-600" />,
      title: 'Templates & Starters',
      description: 'Choose from various templates to kickstart your diagrams and wireframes.'
    },
    {
      icon: <Lock className="h-6 w-6 text-purple-600" />,
      title: 'Private & Secure',
      description: 'Your designs are private and secure with end-to-end encryption.'
    }
  ];

  return (
    <section id="features" className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to create</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features wrapped in a simple, intuitive interface that stays out of your way.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;