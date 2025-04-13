'use client';

import {useState, useRef, useEffect} from 'react';
import {analyzeImage} from '@/ai/flows/analyze-image';
import {generatePoem} from '@/ai/flows/generate-poem';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Textarea} from '@/components/ui/textarea';
import {Upload, Download} from 'lucide-react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {cn} from "@/lib/utils";
import {useToast} from "@/hooks/use-toast";
import html2canvas from 'html2canvas';
import {Slider} from "@/components/ui/slider";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [poem, setPoem] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingPoem, setLoadingPoem] = useState(false);
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [analysisResultObjects, setAnalysisResultObjects] = useState<string[]>([]);
  const [analysisResultScenes, setAnalysisResultScenes] = useState<string[]>([]);
  const [analysisResultEmotions, setAnalysisResultEmotions] = useState<string[]>([]);
  const {toast} = useToast();
  const poemCardRef = useRef<HTMLDivElement>(null);

  // Poem Card Customization State
  const [cardSize, setCardSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [fontFamily, setFontFamily] = useState('serif');
  const [fontSize, setFontSize] = useState(20); // Font size as a number
  const [textColor, setTextColor] = useState('0 0% 0%'); // Default to black
  const [backgroundColor, setBackgroundColor] = useState('0 0% 100%'); // Default to white
  const [isDownloading, setIsDownloading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          setImage(e.target?.result as string);
          setAnalysis(null);
          setPoem(null);
          setAnalysisResultObjects([]);
          setAnalysisResultScenes([]);
          setAnalysisResultEmotions([]);
        } catch (err) {
          console.error("Error reading file:", err);
          toast({
            variant: 'destructive',
            title: 'File read error',
            description: `Failed to read file.`,
          });
        }
      };
      reader.onerror = () => {
        toast({
          variant: 'destructive',
          title: 'File read error',
          description: `Failed to read file.`,
        });
      };
      reader.onabort = () => {
        toast({
          variant: 'destructive',
          title: 'File read aborted',
          description: `File read aborted.`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const analyze = async () => {
    if (!image) {
      toast({
        variant: 'destructive',
        title: 'No image uploaded',
        description: 'Please upload an image first.',
      });
      return;
    }
    setLoadingImage(true);
    try {
      const analysisResult = await analyzeImage({photoUrl: image});
      setAnalysisResultObjects(analysisResult?.objects || []);
      setAnalysisResultScenes(analysisResult?.scenes || []);
      setAnalysisResultEmotions(analysisResult?.emotions || []);

      const imageAnalysis = `Objects: ${analysisResult?.objects.join(', ')}. Scenes: ${analysisResult?.scenes.join(', ')}. Emotions: ${analysisResult?.emotions.join(', ')}`;
      setAnalysis(imageAnalysis);
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        variant: 'destructive',
        title: 'Image analysis failed',
        description: 'Image analysis failed. Please try again.',
      });
    } finally {
      setLoadingImage(false);
    }
  };

  const generate = async () => {
    if (!analysis) {
      toast({
        variant: 'destructive',
        title: 'No image analysis',
        description: 'Please analyze the image first.',
      });
      return;
    }
    setLoadingPoem(true);
    try {
      const poemResult = await generatePoem({imageAnalysis: analysis, language: language});
      setPoem(poemResult.poem);
    } catch (error) {
      console.error('Error generating poem:', error);
      toast({
        variant: 'destructive',
        title: 'Poem generation failed',
        description: 'Failed to generate poem. Please try again.',
      });
    } finally {
      setLoadingPoem(false);
    }
  };


  const downloadPoemCard = async () => {
    if (!poem || !image) {
      toast({
        variant: 'destructive',
        title: 'No poem generated',
        description: 'Please generate a poem first.',
      });
      return;
    }

    if (!poemCardRef.current) {
      toast({
        variant: 'destructive',
        title: 'Poem card not found',
        description: 'Poem card could not be found.',
      });
      return;
    }
    setIsDownloading(true);

    try {
      // Apply customization to the card
      const cardElement = poemCardRef.current;
      if (cardElement) {
        // Directly set the styles using JavaScript
        cardElement.style.fontFamily = fontFamily;
        cardElement.style.color = `hsl(${textColor})`;
        cardElement.style.backgroundColor = `hsl(${backgroundColor})`;
        cardElement.style.fontSize = `${fontSize}px`;


        const canvas = await html2canvas(cardElement, {useCORS: true});
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'imageverse_poem.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

    } catch (error) {
      console.error('Error downloading poem card:', error);
      toast({
        variant: 'destructive',
        title: 'Download failed',
        description: 'Failed to download poem card. Please try again.',
      });
    } finally {
        setIsDownloading(false);
    }
  };

  // Function to generate random HSL values
  const generateRandomColor = () => {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 100);
    const l = Math.floor(Math.random() * 100);
    return `${h} ${s}% ${l}%`;
  };

  // Handler to apply random colors
  const applyRandomColors = () => {
    setTextColor(generateRandomColor());
    setBackgroundColor(generateRandomColor());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-3xl rounded-lg shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-2xl font-bold tracking-tight">ImageVerse</CardTitle>
          <CardDescription>Generate poems from your images.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <label htmlFor="image-upload" className="cursor-pointer">
                {image ? (
                  <img src={image} alt="Uploaded" className="max-w-full max-h-48 rounded-md object-cover shadow-md"/>
                ) : (
                  <div className="border-2 border-dashed border-muted rounded-md p-4 flex items-center justify-center w-full h-48">
                    <Upload className="h-10 w-10 text-muted-foreground"/>
                    <div>Upload Image</div>
                  </div>
                )}
              </label>
              <Input type="file" id="image-upload" accept="image/*" className="hidden" onChange={handleImageUpload}/>

              {analysisResultObjects.length > 0 && (
                <div className="mt-4 w-full">
                  <Alert>
                    <AlertTitle>Image Analysis</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-5">
                        <li>Objects: {analysisResultObjects.join(', ')}</li>
                        <li>Scenes: {analysisResultScenes.join(', ')}</li>
                        <li>Emotions: {analysisResultEmotions.join(', ')}</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              <Button
                className="w-full mt-4 bg-primary text-primary-foreground font-bold py-2 px-4 rounded"
                onClick={analyze}
                disabled={loadingImage || !image}
              >
                {loadingImage ? 'Analyzing...' : 'Analyze Image'}
              </Button>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Select value={language} onValueChange={value => setLanguage(value as 'en' | 'zh')}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select Language"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  className="bg-secondary text-secondary-foreground font-bold py-2 px-4 rounded"
                  onClick={generate}
                  disabled={loadingPoem || !analysis}
                >
                  {loadingPoem ? 'Generating...' : 'Generate Poem'}
                </Button>
              </div>
              <Textarea
                placeholder="Poem will appear here..."
                className="rounded-md shadow-sm focus-visible:ring-ring text-foreground"
                value={poem || ''}
                readOnly
                rows={5}
              />

            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-2">Poem Card Customization</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Card Size</label>
                <Select 
                  value={cardSize} 
                  onValueChange={(value: 'small' | 'medium' | 'large') => setCardSize(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Size"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Font Family</label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Font"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="sans-serif">Sans-Serif</SelectItem>
                    <SelectItem value="monospace">Monospace</SelectItem>
                  </SelectContent>
                </Select>
              </div>

             <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Font Size</label>
                    <Slider
                      defaultValue={[fontSize]}
                      max={40}
                      min={10}
                      step={1}
                      onValueChange={(value) => setFontSize(value[0])}
                    />
                  <p className="text-sm text-muted-foreground">
                    {fontSize} px
                  </p>
              </div>


              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Background Color</label>
                <Input
                  type="color"
                  value={hslToHex(backgroundColor)}
                  onChange={(e) => {
                    const hexColor = e.target.value;
                    const hslColor = hexToHsl(hexColor);
                    setBackgroundColor(hslColor);
                  }}
                  className="w-full h-10 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Text Color</label>
                <Input
                  type="color"
                  value={hslToHex(textColor)}
                  onChange={(e) => {
                    const hexColor = e.target.value;
                    const hslColor = hexToHsl(hexColor);
                    setTextColor(hslColor);
                  }}
                  className="w-full h-10 rounded-md"
                />
              </div>
              <div>
                  <Button
                    className="w-full bg-accent text-accent-foreground font-bold py-2 px-4 rounded"
                    onClick={applyRandomColors}
                  >
                    Random Colors
                  </Button>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Poem Card */}
      {poem && image && (
        <div className="flex flex-col items-center mt-8">
          <div
            ref={poemCardRef}
            className={cn("poem-card", `size-${cardSize}`)}
            style={{
              fontFamily: fontFamily,
              fontSize: `${fontSize}px`, // Apply font size
              color: `hsl(${textColor})`, // Apply text color
              backgroundColor: `hsl(${backgroundColor})`, // Apply background color
            }}
          >
            <img src={image} alt="Poem Card Image" className="poem-card-image"/>
            <div className="poem-card-text" style={{fontSize: `${fontSize}px`, color: `hsl(${textColor})`}}>
              {poem}
            </div>
          </div>
          <Button
            className="bg-secondary text-secondary-foreground font-bold py-2 px-4 rounded mt-2"
            onClick={downloadPoemCard}
            disabled={!poem || isDownloading}
          >
            <Download className="mr-2 h-4 w-4"/>
            {isDownloading ? "Downloading..." : "Download Poem Card"}
          </Button>
        </div>
      )}
      {/* End Poem Card */}

    </div>
  );
}

// Utility function to convert HSL to Hex
function hslToHex(hsl: string): string {
  if (!hsl) return '#ffffff'; // Default white
  const [h, s, l] = hsl.split(' ').map(Number);
  const normalizedH = h / 360;
  const normalizedS = s / 100;
  const normalizedL = l / 100;

  let r, g, b;

  if (normalizedS === 0) {
    r = g = b = normalizedL; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = normalizedL < 0.5 ? normalizedL * (1 + normalizedS) : normalizedL + normalizedS - normalizedL * normalizedS;
    const p = 2 * normalizedL - q;
    r = hue2rgb(p, q, normalizedH + 1 / 3);
    g = hue2rgb(p, q, normalizedH);
    b = hue2rgb(p, q, normalizedH - 1 / 3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Utility function to convert Hex to HSL
function hexToHsl(hex: string): string {
    if (!hex) return '0 0% 100%';
  // Convert hex to RGB first
  let r = 0, g = 0, b = 0;
  if (hex.length == 4) {
    r = parseInt("0x" + hex[1] + hex[1]);
    g = parseInt("0x" + hex[2] + hex[2]);
    b = parseInt("0x" + hex[3] + hex[3]);
  } else if (hex.length == 7) {
    r = parseInt("0x" + hex[1] + hex[2]);
    g = parseInt("0x" + hex[3] + hex[4]);
    b = parseInt("0x" + hex[5] + hex[6]);
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let h = 0, s = 0, l = 0;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  h = h * 360;
  s = s * 100;
  l = l * 100;

  return `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;
}
