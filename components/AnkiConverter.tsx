"use client"
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Upload } from "lucide-react";

const AnkiConverter = () => {
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith('.apkg')) {
      setError('Please upload a valid Anki deck file (.apkg)');
      return;
    }
    
    setIsConverting(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Conversion failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.replace('.apkg', '')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to convert file. Please try again.';
      setError(errorMessage);
    } finally {
      setIsConverting(false);
    }
  };
  
  return (
    <Card className="w-full bg-white shadow-xl border-0">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-gray-900">
          File Converter
        </CardTitle>
        <p className="text-gray-500 text-center">
          Upload your Anki deck to convert it to CSV format
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-6">
            <div className="w-full max-w-xs">
              <label 
                htmlFor="file-upload"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select File
              </label>
              <Input
                id="file-upload"
                type="file"
                accept=".apkg"
                onChange={handleFileUpload}
                className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
                disabled={isConverting}
              />
            </div>
            
            <Button 
              disabled={isConverting} 
              className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {isConverting ? (
                <span className="flex items-center gap-2">
                  <Upload className="h-4 w-4 animate-spin" />
                  Converting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Convert to CSV
                </span>
              )}
            </Button>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnkiConverter;