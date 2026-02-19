export const VERDICT_CONFIG = {
  possible: {
    label: "Possible",
    color: "bg-sdn-teal",
    textColor: "text-white",
    borderColor: "border-sdn-teal",
  },
  depends: {
    label: "Depends",
    color: "bg-sdn-amber",
    textColor: "text-white",
    borderColor: "border-sdn-amber",
  },
  not_possible: {
    label: "Not Possible",
    color: "bg-sdn-red",
    textColor: "text-white",
    borderColor: "border-sdn-red",
  },
} as const;

export const ACCEPTED_FILE_TYPES: Record<string, string[]> = {
  "image/*": [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"],
  "application/pdf": [".pdf"],
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_REVIEW_MESSAGE_LENGTH = 500;
