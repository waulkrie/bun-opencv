export enum LoadImageFlags {
  GRAYSCALE = 0,
  COLOR = 1,
}

export enum TemplateMatchModes {
  TM_SQDIFF = 0,
  TM_SQDIFF_NORMED = 1,
  TM_CCORR = 2,
  TM_CCORR_NORMED = 3,
  TM_CCOEFF = 4,
  TM_CCOEFF_NORMED = 5,
}

export interface CvSize {
  width: number;
  height: number;
}

export interface MatchLocation {
  x: number;
  y: number;
  confidence: number;
}
