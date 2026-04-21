import { useEffect, useRef, useState, useCallback } from 'react';
import { RefreshCcw } from 'lucide-react';

interface CaptchaProps {
  onValidate: (isValid: boolean) => void;
}

export default function Captcha({ onValidate }: CaptchaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [captchaText, setCaptchaText] = useState('');
  const [inputVal, setInputVal] = useState('');

  const generateCaptcha = useCallback(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let text = '';
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);

    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Background
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Lines
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
          ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
          ctx.strokeStyle = `rgba(0,0,0,0.${Math.floor(Math.random() * 5 + 1)})`;
          ctx.stroke();
        }

        // Text
        ctx.font = 'bold 24px monospace';
        ctx.fillStyle = '#b91c1c'; // Red-ish similar to VTOP
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Obfuscation
        for (let i = 0; i < text.length; i++) {
          ctx.save();
          const x = 20 + i * 20;
          const y = canvas.height / 2;
          ctx.translate(x, y);
          ctx.rotate((Math.random() - 0.5) * 0.4);
          ctx.fillText(text[i], 0, 0);
          ctx.restore();
        }
      }
    }
    setInputVal('');
    onValidate(false);
  }, [onValidate]);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);
    onValidate(val === captchaText);
  };

  return (
    <>
      <div className="captcha-container">
        <canvas 
          ref={canvasRef} 
          width={140} 
          height={40} 
          className="captcha-canvas"
          title={captchaText}
        />
        <button 
          type="button" 
          onClick={generateCaptcha} 
          className="refresh-captcha" 
          title="Refresh CAPTCHA"
        >
          <RefreshCcw size={18} />
        </button>
      </div>
      <div className="input-wrapper" style={{ marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          placeholder="Enter CAPTCHA shown above" 
          value={inputVal}
          onChange={handleChange}
          style={{ paddingLeft: '1rem' }} 
        />
      </div>
    </>
  );
}
