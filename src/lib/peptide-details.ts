/* Reference scientific data for the research catalogue.
   Values are commonly published research-reference figures. */

export type PeptideData = {
  fullName?: string;
  purity: string;
  molecularFormula?: string;
  molecularWeight?: string;
  casNumber?: string;
  blendNote?: string;
};

export const PEPTIDE_DATA: Record<string, PeptideData> = {
  tirzepatide: {
    purity: "≥98%",
    molecularFormula: "C225H348N48O68",
    molecularWeight: "4813.45 g/mol",
    casNumber: "2023788-19-2",
  },
  retatrutide: {
    purity: "≥98%",
    molecularWeight: "≈4731.4 g/mol",
    casNumber: "2381089-83-2",
  },
  "bpc-157": {
    purity: "≥99%",
    molecularFormula: "C62H98N16O22",
    molecularWeight: "1419.53 g/mol",
    casNumber: "137525-51-0",
  },
  "tb-500": {
    fullName: "Thymosin β4 Acetate",
    purity: "≥99%",
    molecularFormula: "C212H350N56O78S",
    molecularWeight: "4963.44 g/mol",
    casNumber: "77591-33-4",
  },
  "mots-c": {
    purity: "≥98%",
    molecularFormula: "C101H152N28O22S2",
    molecularWeight: "2174.59 g/mol",
    casNumber: "1627580-64-6",
  },
  tesamorelin: {
    purity: "≥98%",
    molecularFormula: "C221H366N72O67S",
    molecularWeight: "5135.86 g/mol",
    casNumber: "218949-48-5",
  },
  "ghk-cu": {
    fullName: "Copper Tripeptide-1",
    purity: "≥99%",
    molecularFormula: "C14H22CuN6O4",
    molecularWeight: "403.92 g/mol",
    casNumber: "89030-95-5",
  },
  "nad-plus": {
    fullName: "Nicotinamide Adenine Dinucleotide",
    purity: "≥98%",
    molecularFormula: "C21H27N7O14P2",
    molecularWeight: "663.43 g/mol",
    casNumber: "53-84-9",
  },
  "melanotan-2": {
    fullName: "Melanotan II Acetate",
    purity: "≥99%",
    molecularFormula: "C50H69N15O9",
    molecularWeight: "1024.18 g/mol",
    casNumber: "121062-08-6",
  },
  "igf-1-lr3": {
    fullName: "Long R3 Insulin-like Growth Factor-1",
    purity: "≥98%",
    molecularFormula: "C990H1528N262O300S7",
    molecularWeight: "9117.70 g/mol",
    casNumber: "946870-92-4",
  },
  ipamorelin: {
    purity: "≥99%",
    molecularFormula: "C38H49N9O5",
    molecularWeight: "711.86 g/mol",
    casNumber: "170851-70-4",
  },
  dsip: {
    fullName: "Delta Sleep-Inducing Peptide",
    purity: "≥98%",
    molecularFormula: "C35H48N10O15",
    molecularWeight: "848.81 g/mol",
    casNumber: "62568-57-4",
  },
  "cjc-1295": {
    fullName: "Mod GRF (1-29)",
    purity: "≥99%",
    molecularFormula: "C152H252N44O42",
    molecularWeight: "3367.90 g/mol",
    casNumber: "863288-34-0",
  },
  "bacteriostatic-water": {
    purity: "USP Grade",
    molecularFormula: "H₂O + 0.9% Benzyl Alcohol",
    casNumber: "7732-18-5 / 100-51-6",
  },
};

export const USAGE_NOTES: string[] = [
  "Strictly for in-vitro laboratory research, analytical testing, and scientific investigation — not for human or animal use.",
  "Handle with appropriate personal protective equipment in a controlled laboratory environment.",
  "No dosage, administration, or treatment guidance is provided, as products are sold for research only.",
  "Follow accepted laboratory storage, handling, and disposal practices at all times.",
];
