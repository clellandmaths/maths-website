'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeImageProps {
  url: string;
  size?: number;
  className?: string;
}

export default function QRCodeImage({ url, size = 80, className = '' }: QRCodeImageProps) {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: size,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(''));
  }, [url, size]);

  if (!dataUrl) return null;

  return (
    <img
      src={dataUrl}
      alt="Scan for video solution"
      width={size}
      height={size}
      className={className}
    />
  );
}
