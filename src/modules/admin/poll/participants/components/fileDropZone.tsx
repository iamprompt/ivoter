import type { FunctionComponent } from 'react'
import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import clsx from 'clsx'

interface Props {
  onChange: (d: any) => void
}

export const FileDropZone: FunctionComponent<Props> = ({ onChange }) => {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState<Boolean>(false)

  const handleFileChange = (f: File | null) => {
    if (f && f.type === 'text/csv') {
      setFile(f)
    } else setFile(null)
  }

  useEffect(() => {
    file?.text().then((text) => {
      console.log(text)
      const csv = Papa.parse<any>(text, { header: true })

      // Check Schema
      if (
        !Object.keys(csv.data[0]).includes('email') ||
        !Object.keys(csv.data[0]).includes('password')
      ) {
        return
      }

      onChange(csv.data)
    })
  }, [file])

  return (
    <label
      className={clsx(
        'flex h-32 w-full items-center justify-center rounded-xl border-2 border-gray-200',
        dragActive && 'border-gray-500 bg-gray-200'
      )}
      htmlFor="participants-import-file"
      onDragEnter={() => setDragActive(true)}
      onDragLeave={() => setDragActive(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        setDragActive(false)
        handleFileChange(e.dataTransfer.files[0])
      }}
    >
      <span>
        <span className="font-bold">Drop</span> a file or{' '}
        <span className="font-bold">Click here</span> to select a file to
        upload...
      </span>
      <input
        type="file"
        name="participants-import"
        id="participants-import-file"
        accept="text/csv"
        onChange={(e) => {
          handleFileChange(e.target.files?.[0] || null)
        }}
        className="hidden"
      />
    </label>
  )
}
