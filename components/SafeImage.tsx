'use client'

/**
 * 使用原生 img 展示外部图片，避免 Next.js Image 优化导致的显示问题。
 * 外部 URL（Unsplash、Wikimedia 等）用此组件更稳定。
 */
export function SafeImage({
  src,
  alt,
  className,
  fill,
  sizes,
  ...props
}: {
  src: string
  alt: string
  className?: string
  fill?: boolean
  sizes?: string
} & React.ImgHTMLAttributes<HTMLImageElement>) {
  if (!src) return null

  const isSvg = src.toLowerCase().includes('.svg')
  const imgClass = [
    className,
    isSvg ? 'object-contain' : 'object-cover',
    fill ? 'w-full h-full' : '',
  ].filter(Boolean).join(' ')

  return (
    <img
      src={src}
      alt={alt}
      className={imgClass}
      loading="lazy"
      decoding="async"
      {...props}
    />
  )
}
