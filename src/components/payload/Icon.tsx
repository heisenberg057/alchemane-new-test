import React from 'react'
import Image from 'next/image'

export const Icon = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Image
        src="/assets/icon-natural-hairline.svg"
        alt="AH"
        width={32}
        height={32}
        className="max-w-full max-h-full object-contain"
      />
    </div>
  )
}
