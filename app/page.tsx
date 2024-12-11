import React from 'react';
import AnkiConverter from '@/components/AnkiConverter';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/NavBar';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white pt-16">
        {/* Gradient Blur Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 opacity-20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 opacity-20 rounded-full blur-[100px]" />
        </div>

        <div className="relative container mx-auto py-24 px-4">
          {/* Hero Section */}
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-300">
              Anki to Quizlet Converter
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Transform your Anki decks into Quizlet-compatible formats with just a few clicks.
              Simple, fast, and reliable conversion.
            </p>
          </div>
          
          {/* Main Content */}
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Converter Card */}
            <Card className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
              <CardContent className="p-6">
                <AnkiConverter />
              </CardContent>
            </Card>
            
            {/* Instructions Section */}
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Upload Your Deck',
                  description: 'Select your Anki deck file (.apkg)',
                  gradient: 'from-purple-500 to-blue-500'
                },
                {
                  step: '2',
                  title: 'Convert',
                  description: 'Click convert and wait for processing',
                  gradient: 'from-blue-500 to-cyan-500'
                },
                {
                  step: '3',
                  title: 'Download CSV',
                  description: 'Import the CSV file into Quizlet',
                  gradient: 'from-cyan-500 to-green-500'
                }
              ].map(({ step, title, description, gradient }) => (
                <div key={step} className="relative group">
                  <Card className="h-full bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm transition-all duration-300 group-hover:border-zinc-700">
                    <CardContent className="p-6 space-y-4">
                      <div className={`bg-gradient-to-r ${gradient} w-12 h-12 rounded-full flex items-center justify-center font-medium`}>
                        {step}
                      </div>
                      <h3 className="text-xl font-semibold text-white">{title}</h3>
                      <p className="text-zinc-400">{description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}