'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { getResponseError } from '@/lib/safe-json'

interface ImageUploadProps {
  currentUrl?: string
  onUpload: (url: string) => void
  folder?: string
  className?: string
}

export default function ImageUpload({ currentUrl, onUpload, folder = 'team', className }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setError(null)
    setUploading(true)
    setPreview(URL.createObjectURL(file))

    try {
      const form = new FormData()
      form.append('file', file)
      form.append('folder', folder)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      if (!res.ok) throw new Error(await getResponseError(res, 'Upload failed'))
      const json = await res.json()
      onUpload(json.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed. The file may be too large (max 4 MB) or in an unsupported format.')
      setPreview(currentUrl ?? null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={className}>
      <p className="mb-1 font-body text-[14px] text-brand-text">Photo</p>
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-brand-cream">
          {preview ? (
            <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-brand-text/30">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
              <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-md border border-gray-300 px-4 py-2 font-body text-[13px] text-brand-text hover:bg-gray-50 disabled:opacity-50"
          >
            {uploading ? 'Uploading…' : preview ? 'Change photo' : 'Upload photo'}
          </button>
          {preview && !uploading && (
            <button
              type="button"
              onClick={() => { setPreview(null); onUpload('') }}
              className="font-body text-[12px] text-brand-terra hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {error && <p className="mt-1 font-body text-[12px] text-brand-terra">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
