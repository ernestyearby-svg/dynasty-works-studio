import React, { useRef, useState } from 'react';
import {
  FounderAsset,
  validateAssetFile,
  formatBytes,
  ALLOWED_EXTENSIONS,
  MAX_FILES_PER_INQUIRY,
  MAX_FILE_SIZE_BYTES,
  MAX_AGGREGATE_SIZE_BYTES,
} from '@/lib/asset-client';

interface FounderAssetUploadProps {
  assets: FounderAsset[];
  onChange: (assets: FounderAsset[]) => void;
  disabled?: boolean;
}

export function FounderAssetUpload({
  assets,
  onChange,
  disabled = false,
}: FounderAssetUploadProps): React.JSX.Element {
  const [dragActive, setDragActive] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalBytes = assets.reduce((sum, a) => sum + a.size, 0);

  function handleFiles(candidateFiles: FileList | File[]) {
    setErrorNotice(null);
    const newAssets: FounderAsset[] = [...assets];

    if (newAssets.length + candidateFiles.length > MAX_FILES_PER_INQUIRY) {
      setErrorNotice(`You can upload a maximum of ${MAX_FILES_PER_INQUIRY} files per inquiry.`);
      return;
    }

    let currentTotal = totalBytes;

    for (let i = 0; i < candidateFiles.length; i++) {
      const file = candidateFiles[i];

      // Prevent exact duplicate additions
      if (newAssets.some((a) => a.name === file.name && a.size === file.size)) {
        continue;
      }

      const validation = validateAssetFile(file);
      if (!validation.valid) {
        setErrorNotice(validation.error || `File ${file.name} could not be accepted.`);
        return;
      }

      if (currentTotal + file.size > MAX_AGGREGATE_SIZE_BYTES) {
        setErrorNotice('Total asset volume exceeds the 100 MB aggregate limit.');
        return;
      }

      currentTotal += file.size;

      newAssets.push({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        status: 'pending',
        progress: 0,
      });
    }

    onChange(newAssets);
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      // Reset input value so same file can be re-selected if removed
      e.target.value = '';
    }
  }

  function removeAsset(id: string) {
    if (disabled) return;
    setErrorNotice(null);
    onChange(assets.filter((a) => a.id !== id));
  }

  return (
    <div className="dws-asset-upload-root">
      <div className="dws-asset-header">
        <div className="dws-asset-kicker">CONFIDENTIAL FOUNDER INTAKE</div>
        <h5 className="dws-asset-headline">Bring what already exists.</h5>
        <p className="dws-asset-desc">
          Decks, briefs, spreadsheets, cap tables, brand guidelines, architectural sketches.
          We evaluate reality, not pitch perfection.
        </p>
      </div>

      {/* Dropzone */}
      <div
        className={`dws-asset-dropzone ${dragActive ? 'is-dragover' : ''} ${disabled ? 'is-disabled' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        aria-label="Upload venture documents and strategic materials"
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ALLOWED_EXTENSIONS.join(',')}
          onChange={handleInputChange}
          style={{ display: 'none' }}
          disabled={disabled}
        />

        <div className="dws-asset-dropzone-content">
          <div className="dws-asset-drop-icon" aria-hidden="true">
            ⇪
          </div>
          <div className="dws-asset-drop-primary">
            <span className="dws-asset-browse-link">Click to browse</span> or drag files here
          </div>
          <div className="dws-asset-drop-formats">
            PDF · DOCX · XLSX · PPTX · CSV · TXT · PNG · JPG · WEBP
          </div>
          <div className="dws-asset-drop-limits">
            Up to 25 MB per file · Max 10 files · Stored in private encrypted vault
          </div>
        </div>
      </div>

      {errorNotice && (
        <div role="alert" className="dws-asset-error">
          <span>⚠</span> {errorNotice}
        </div>
      )}

      {/* Asset List */}
      {assets.length > 0 && (
        <div className="dws-asset-list">
          <div className="dws-asset-list-summary">
            <span>Attached Materials ({assets.length}/10)</span>
            <span>{formatBytes(totalBytes)} / 100 MB aggregate</span>
          </div>

          <ul className="dws-asset-items">
            {assets.map((asset) => (
              <li key={asset.id} className={`dws-asset-item status-${asset.status}`}>
                <div className="dws-asset-item-info">
                  <span className="dws-asset-item-icon" aria-hidden="true">
                    📄
                  </span>
                  <div className="dws-asset-item-meta">
                    <span className="dws-asset-item-name" title={asset.name}>
                      {asset.name}
                    </span>
                    <span className="dws-asset-item-size">{formatBytes(asset.size)}</span>
                  </div>
                </div>

                <div className="dws-asset-item-actions">
                  {asset.status === 'uploading' && (
                    <div className="dws-asset-uploading-indicator">
                      <span className="dws-asset-progress-bar">
                        <span
                          className="dws-asset-progress-fill"
                          style={{ width: `${asset.progress}%` }}
                        />
                      </span>
                      <span className="dws-asset-pct">{asset.progress}%</span>
                    </div>
                  )}

                  {asset.status === 'uploaded' && (
                    <span className="dws-asset-status-badge is-success">
                      ✓ Securely Transmitted
                    </span>
                  )}

                  {asset.status === 'error' && (
                    <span className="dws-asset-status-badge is-error" title={asset.error}>
                      ⚠ Upload Failed
                    </span>
                  )}

                  {asset.status === 'pending' && !disabled && (
                    <button
                      type="button"
                      className="dws-asset-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAsset(asset.id);
                      }}
                      aria-label={`Remove ${asset.name}`}
                    >
                      ×
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="dws-asset-security-notice">
        <span className="dws-asset-shield-icon" aria-hidden="true">
          🔒
        </span>
        <span>
          Strictly Confidential Intake · Private Cloud Storage · Zero Public Distribution · Evaluated by Principals Only
        </span>
      </div>
    </div>
  );
}
