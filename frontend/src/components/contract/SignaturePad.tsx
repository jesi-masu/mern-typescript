import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PenTool, RotateCcw, Check, Shield, FileText, Calendar } from "lucide-react";

interface SignaturePadProps {
  onSave: (signature: string) => void;
}

interface Point {
  x: number;
  y: number;
  pressure?: number;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);

  // Enhanced drawing settings
  const drawingSettings = {
    lineWidth: 2.5,
    lineCap: 'round' as CanvasLineCap,
    lineJoin: 'round' as CanvasLineJoin,
    strokeStyle: '#1e40af',
    smoothing: 0.7, // Smoothing factor for line interpolation
    minDistance: 1, // Minimum distance between points to reduce jitter
  };

  // Get accurate coordinates accounting for canvas scaling and positioning
  const getCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;

    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0] || e.changedTouches[0];
      if (!touch) return { x: 0, y: 0 };
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  // Smooth line drawing using quadratic curves
  const drawSmoothLine = useCallback((ctx: CanvasRenderingContext2D, from: Point, to: Point, control?: Point) => {
    if (control) {
      ctx.quadraticCurveTo(control.x, control.y, to.x, to.y);
    } else {
      ctx.lineTo(to.x, to.y);
    }
    ctx.stroke();
  }, []);

  // Calculate distance between two points
  const getDistance = (p1: Point, p2: Point): number => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  // Initialize canvas context with enhanced settings
  const initializeCanvas = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.lineWidth = drawingSettings.lineWidth;
    ctx.lineCap = drawingSettings.lineCap;
    ctx.lineJoin = drawingSettings.lineJoin;
    ctx.strokeStyle = drawingSettings.strokeStyle;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }, [drawingSettings.lineCap, drawingSettings.lineJoin, drawingSettings.lineWidth, drawingSettings.strokeStyle]);

  // Mouse event handlers
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const point = getCoordinates(e);
    
    setIsDrawing(true);
    setHasSignature(true);
    setLastPoint(point);
    
    initializeCanvas(ctx);
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  }, [getCoordinates, initializeCanvas]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentPoint = getCoordinates(e);
    
    if (lastPoint) {
      const distance = getDistance(lastPoint, currentPoint);
      
      // Only draw if the distance is significant enough to reduce jitter
      if (distance > drawingSettings.minDistance) {
        // Create smooth curves using quadratic bezier
        const controlPoint = {
          x: lastPoint.x + (currentPoint.x - lastPoint.x) * drawingSettings.smoothing,
          y: lastPoint.y + (currentPoint.y - lastPoint.y) * drawingSettings.smoothing
        };
        
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        drawSmoothLine(ctx, lastPoint, currentPoint, controlPoint);
        
        setLastPoint(currentPoint);
      }
    }
  }, [isDrawing, getCoordinates, lastPoint, drawingSettings.minDistance, drawingSettings.smoothing, drawSmoothLine]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    setLastPoint(null);
  }, []);

  // Touch event handlers for mobile support
  const startTouchDrawing = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const point = getCoordinates(e);
    
    setIsDrawing(true);
    setHasSignature(true);
    setLastPoint(point);
    
    initializeCanvas(ctx);
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  }, [getCoordinates, initializeCanvas]);

  const touchDraw = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentPoint = getCoordinates(e);
    
    if (lastPoint) {
      const distance = getDistance(lastPoint, currentPoint);
      
      if (distance > drawingSettings.minDistance) {
        const controlPoint = {
          x: lastPoint.x + (currentPoint.x - lastPoint.x) * drawingSettings.smoothing,
          y: lastPoint.y + (currentPoint.y - lastPoint.y) * drawingSettings.smoothing
        };
        
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        drawSmoothLine(ctx, lastPoint, currentPoint, controlPoint);
        
        setLastPoint(currentPoint);
      }
    }
  }, [isDrawing, getCoordinates, lastPoint, drawingSettings.minDistance, drawingSettings.smoothing, drawSmoothLine]);

  const stopTouchDrawing = useCallback(() => {
    setIsDrawing(false);
    setLastPoint(null);
  }, []);

  // Clear signature
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setLastPoint(null);
  };

  // Save signature with enhanced quality
  const saveSignature = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    setIsProcessing(true);
    
    // Simulate processing time for premium feel
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save with maximum quality
    const dataURL = canvas.toDataURL('image/png', 1.0);
    onSave(dataURL);
    setIsProcessing(false);
  };

  // Prevent context menu on right click
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  // Setup canvas with proper sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match the CSS size for consistent coordinate mapping
    const rect = canvas.getBoundingClientRect();
    canvas.width = 400;
    canvas.height = 180;

    initializeCanvas(ctx);
  }, [initializeCanvas]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="p-2 bg-blue-100 rounded-full">
            <PenTool className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Digital Signature</h3>
        </div>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          Your digital signature will be legally binding and securely encrypted. 
          Please sign clearly within the designated area below.
        </p>
      </div>

      {/* Security Badges */}
      <div className="flex justify-center gap-3 mb-6">
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Shield className="h-3 w-3 mr-1" />
          Secure
        </Badge>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <FileText className="h-3 w-3 mr-1" />
          Legal
        </Badge>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <Calendar className="h-3 w-3 mr-1" />
          Timestamped
        </Badge>
      </div>

      {/* Signature Canvas Card */}
      <Card className="border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors duration-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700 text-center">
            Sign Here
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={400}
              height={180}
              className={`w-full h-auto border-2 rounded-lg cursor-crosshair transition-all duration-200 select-none ${
                isDrawing 
                  ? 'border-blue-400 shadow-lg' 
                  : hasSignature 
                    ? 'border-green-300 bg-green-50/30' 
                    : 'border-gray-200 bg-gray-50/50'
              }`}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startTouchDrawing}
              onTouchMove={touchDraw}
              onTouchEnd={stopTouchDrawing}
              onTouchCancel={stopTouchDrawing}
              onContextMenu={handleContextMenu}
              style={{ touchAction: 'none' }}
            />
            
            {/* Signature Line */}
            {!hasSignature && (
              <div className="absolute bottom-8 left-8 right-8 border-b border-gray-300 pointer-events-none">
                <span className="absolute -bottom-5 left-0 text-xs text-gray-400">
                  × Sign above this line
                </span>
              </div>
            )}
            
            {/* Status Indicator */}
            {hasSignature && (
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                  <Check className="h-3 w-3" />
                  Signed
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timestamp Information */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Date:</span>
              <span className="ml-2 font-medium text-gray-900">{currentDate}</span>
            </div>
            <div>
              <span className="text-gray-500">Time:</span>
              <span className="ml-2 font-medium text-gray-900">{currentTime}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Button 
          type="button" 
          variant="outline" 
          onClick={clearSignature}
          disabled={!hasSignature}
          className="flex items-center gap-2 px-6 py-2.5 hover:bg-gray-50 transition-colors duration-200"
        >
          <RotateCcw className="h-4 w-4" />
          Clear Signature
        </Button>
        
        <Button 
          type="button" 
          onClick={saveSignature}
          disabled={!hasSignature || isProcessing}
          className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Processing...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Confirm Signature
            </>
          )}
        </Button>
      </div>

      {/* Legal Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Legal Notice</p>
            <p className="text-blue-700">
              By signing this document, you acknowledge that your electronic signature 
              has the same legal effect as a handwritten signature and you agree to be 
              bound by the terms and conditions outlined in this agreement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignaturePad;