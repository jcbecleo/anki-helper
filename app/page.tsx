import AnkiConverter from '@/components/AnkiConverter';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Anki to Quizlet Converter
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert your Anki decks to Quizlet-compatible CSV files. Simply upload your .apkg file and get started.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <AnkiConverter />
          
          {/* Instructions Section */}
          <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              How to Use
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="bg-blue-50 rounded-full w-10 h-10 flex items-center justify-center mb-3">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <h3 className="font-medium text-gray-900">Upload Your Deck</h3>
                <p className="text-gray-600">Select your Anki deck file (.apkg)</p>
              </div>
              <div className="space-y-2">
                <div className="bg-blue-50 rounded-full w-10 h-10 flex items-center justify-center mb-3">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <h3 className="font-medium text-gray-900">Convert</h3>
                <p className="text-gray-600">Click convert and wait for processing</p>
              </div>
              <div className="space-y-2">
                <div className="bg-blue-50 rounded-full w-10 h-10 flex items-center justify-center mb-3">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <h3 className="font-medium text-gray-900">Download CSV</h3>
                <p className="text-gray-600">Import the CSV file into Quizlet</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}