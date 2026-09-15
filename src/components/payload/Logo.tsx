import React from 'react'
import Image from 'next/image'

export const Logo = () => {
  return (
    <div className="flex items-center justify-center w-full h-full p-4">
      <Image
        src="/assets/mkxm0e5x-jjniexs.png"
        alt="American Hairline"
        width={160}
        height={50}
        className="max-w-full max-h-full object-contain"
        style={{ maxHeight: '50px' }}
      />
    </div>
  )
}
