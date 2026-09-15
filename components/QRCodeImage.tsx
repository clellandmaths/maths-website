'use client';

import { useEffect, useState } from 'react';

interface QRCodeImageProps {
  url: string;
  size?: number;
  className?: string;
}

/**
 * **The library is fetched at the effect, not at the import.**
 *
 * `qrcode` is 53 KB and it was eager on the Explorer and on a shared worksheet —
 * two pages where the codes only ever appear on the *printed* sheet, and one of
 * which had 12 bytes of JS budget left. `check:budget` is what found it.
 *
 * This moves the library and nothing else: the component already rendered
 * `null` until an async effect produced the data URL, so there is no new render
 * state, no placeholder and no change to when the image appears relative to
 * paint — one more await inside a promise chain that was already there.
 * `check-generated-video.mjs` drives the printed QR codes and still passes.
 */
export default function QRCodeImage({ url, size = 80, className = '' }: QRCodeImageProps) {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    let alive = true;
    import('qrcode')
      .then(({ default: QRCode }) => QRCode.toDataURL(url, {
        width: size,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' },
      }))
      .then(d => { if (alive) setDataUrl(d); })
      .catch(() => { if (alive) setDataUrl(''); });
    return () => { alive = false; };
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
