import ArticleIcon from "@mui/icons-material/Article";
import DescriptionIcon from "@mui/icons-material/Description";
import GridOnIcon from "@mui/icons-material/GridOn";
import ImageIcon from "@mui/icons-material/Image";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";
import mammoth from "mammoth/mammoth.browser";
import * as XLSX from "xlsx";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export type FileCategory = "image" | "pdf" | "spreadsheet" | "docx";

export interface ProcessedUpload {
  category: FileCategory;
  fileName: string;
  fileLabel: string;
  images?: string[];
  docText?: string;
}

interface UploadCategory {
  id: FileCategory;
  label: string;
  accept: string;
  icon: React.ReactNode;
}

interface FileUploadModalProps {
  open: boolean;
  onClose: () => void;
  onFileReady: (upload: ProcessedUpload) => void;
}

const categories: UploadCategory[] = [
  {
    id: "image",
    label: "Photo / Image",
    accept: ".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp",
    icon: <ImageIcon />,
  },
  {
    id: "pdf",
    label: "PDF Document",
    accept: ".pdf,application/pdf",
    icon: <DescriptionIcon />,
  },
  {
    id: "spreadsheet",
    label: "Spreadsheets",
    accept:
      ".xlsx,.xls,.csv,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    icon: <GridOnIcon />,
  },
  {
    id: "docx",
    label: "Word Document",
    accept:
      ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    icon: <ArticleIcon />,
  },
];

const readAsArrayBuffer = (file: File) =>
  new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });

const readAsDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const readAsText = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });

const extractPdfText = async (file: File) => {
  const buffer = await readAsArrayBuffer(file);
  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
  }).promise;

  const pages: string[] = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (pageText) {
      pages.push(`Page ${pageNumber}\n${pageText}`);
    }
  }

  return pages.join("\n\n");
};

const extractSpreadsheetText = async (file: File) => {
  const isCsv =
    file.name.toLowerCase().endsWith(".csv") ||
    file.type === "text/csv" ||
    file.type === "application/csv";

  if (isCsv) {
    return readAsText(file);
  }

  const buffer = await readAsArrayBuffer(file);
  const workbook = XLSX.read(buffer, { type: "array" });
  return workbook.SheetNames.map((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const csv = XLSX.utils.sheet_to_csv(sheet, { blankrows: false });
    return `Sheet: ${sheetName}\n${csv.trim()}`;
  })
    .filter(Boolean)
    .join("\n\n");
};

const processFile = async (
  file: File,
  category: FileCategory,
): Promise<ProcessedUpload> => {
  const fileLabel = `[Attached file: ${file.name}]`;

  if (category === "image") {
    const dataUrl = await readAsDataURL(file);
    return {
      category,
      fileName: file.name,
      fileLabel,
      images: [dataUrl.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "")],
    };
  }

  if (category === "pdf") {
    return {
      category,
      fileName: file.name,
      fileLabel,
      docText: await extractPdfText(file),
    };
  }

  if (category === "spreadsheet") {
    return {
      category,
      fileName: file.name,
      fileLabel,
      docText: await extractSpreadsheetText(file),
    };
  }

  const buffer = await readAsArrayBuffer(file);
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return {
    category,
    fileName: file.name,
    fileLabel,
    docText: result.value.trim(),
  };
};

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  open,
  onClose,
  onFileReady,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FileCategory | null>(
    null,
  );
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeCategory = categories.find((item) => item.id === selectedCategory);

  const handleSelectCategory = (category: UploadCategory) => {
    setError(null);
    setSelectedCategory(category.id);
    window.setTimeout(() => inputRef.current?.click(), 0);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !selectedCategory) return;

    setProcessing(true);
    setError(null);
    try {
      const upload = await processFile(file, selectedCategory);
      if (!upload.images?.length && !upload.docText?.trim()) {
        throw new Error("No readable content was found in this file.");
      }
      onFileReady(upload);
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to process this file.";
      setError(message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onClose={processing ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ pb: 1 }}>Select file category</DialogTitle>
      <DialogContent sx={{ pt: 1.5, pb: 2.5 }}>
        <input
          ref={inputRef}
          hidden
          type="file"
          accept={activeCategory?.accept}
          onChange={handleFileChange}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 1.5 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "grid", gap: 1 }}>
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => handleSelectCategory(category)}
              disabled={processing}
              startIcon={category.icon}
              variant="outlined"
              sx={{
                justifyContent: "flex-start",
                borderRadius: "8px",
                py: 1.2,
                color: "text.primary",
                borderColor: "rgba(255, 255, 255, 0.12)",
              }}
            >
              {category.label}
            </Button>
          ))}
        </Box>

        {processing && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">
              Processing file in browser...
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadModal;
