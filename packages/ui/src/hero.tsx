"use client"
import React, { useState } from 'react';
import { MousePointer, Square, Circle, Type } from 'lucide-react';
import Button from './button';
import Link from 'next/link';

const Hero = () => {
  const [activeTab, setActiveTab] = useState('draw');
  
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              Whiteboard <span className="bg-gradient-to-r from-purple-600 to-teal-500 text-transparent bg-clip-text font-semibold">
              reimagined
            </span> for the digital age
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Create beautiful hand-drawn diagrams, wireframes, and illustrations with our intuitive whiteboard. Collaborate in real-time with your team.
            </p>
            <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/signin"
                className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 transition text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md inline-block text-center"
                aria-label="Sign in"
              >
                Sign in
              </Link>

              <Link href={"/signup"}>
                <Button variant="outline" size="lg">Sign up</Button>
              </Link>
            </div>

            
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden"
                  >
                    <span className="text-xs font-medium text-gray-700">{String.fromCharCode(65 + i)}</span>
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">5,000+</span> people are already using CollaboSketch
                </p>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 relative">
            {/* Canvas Preview */}
            <div className="bg-white rounded-xl shadow-lg p-4 relative">
              {/* Toolbar */}
              <div className="border-b border-gray-200 pb-2 mb-4">
                <div className="flex space-x-4">
                  <div
                    className={`cursor-pointer p-2 rounded ${activeTab === 'draw' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('draw')}
                  >
                    <MousePointer size={20} />
                  </div>
                  <div
                    className={`cursor-pointer p-2 rounded ${activeTab === 'square' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('square')}
                  >
                    <Square size={20} />
                  </div>
                  <div
                    className={`cursor-pointer p-2 rounded ${activeTab === 'circle' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('circle')}
                  >
                    <Circle size={20} />
                  </div>
                  <div
                    className={`cursor-pointer p-2 rounded ${activeTab === 'text' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('text')}
                  >
                    <Type size={20} />
                  </div>
                </div>
              </div>
              
              {/* Canvas Area */}
              <div className="w-full h-64 md:h-80 bg-gray-50 rounded-lg relative overflow-hidden">
                {/* Example drawing elements */}
                <div className="absolute top-20 left-20 w-24 h-24 border-2 border-purple-500 rounded-lg bg-purple-50 opacity-70"></div>
                <div className="absolute top-40 left-40 w-32 h-16 border-2 border-teal-500 rounded-full bg-teal-50 opacity-70"></div>
                <div className="absolute top-30 left-60 w-40 h-3 border-b-2 border-gray-400 border-dashed"></div>
                <div className="absolute top-10 left-80 text-sm font-medium text-gray-700">Project Flow</div>
                
                {/* Hand cursor */}
                <div className="absolute animate-pulse top-40 left-56 text-gray-800">
                  <MousePointer size={18} />
                </div>
              </div>
              
              {/* Canvas dots pattern overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[length:16px_16px]"></div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-teal-200 rounded-full mix-blend-multiply blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;