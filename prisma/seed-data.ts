/* ============================================================
   BioPlus Labs — catalogue seed data.

   This is the catalogue exactly as it shipped in the original hardcoded
   storefront (src/lib/products.ts), preserved verbatim so seeding reproduces
   the live site. After the first seed the database is the source of truth and
   the catalogue is edited in the admin dashboard, not here.
   ============================================================ */

import type { Product } from "../src/lib/products";

export const SEED_PRODUCTS: Product[] =
[
  {
    slug: "retatrutide",
    name: "Retatrutide",
    tagline: "Triple GLP-1 / GIP / glucagon agonist",
    blurb:
      "A triple agonist targeting GLP-1, GIP, and glucagon receptors. Studied for metabolic regulation, energy balance, and body-composition research within obesity and cardiometabolic settings.",
    highlights: [
      "Studied for metabolic regulation, energy balance, and body composition research",
      "Investigated in obesity and cardiometabolic research settings",
      "Frequently used in studies involving appetite signalling and glucose metabolism",
      "Lyophilised powder intended for laboratory research use only",
    ],
    form: "Lyophilised powder",
    bestSeller: true,
    variants: [
      { sku: "BPL-RET20", label: "20 mg vial", strength: "20 mg", price: 55, availability: "in-stock" },
      { sku: "BPL-RET40", label: "40 mg vial", strength: "40 mg", price: 75, availability: "in-stock" },
    ],
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    tagline: "Dual GIP / GLP-1 receptor agonist",
    blurb:
      "A dual GIP and GLP-1 receptor agonist studied for metabolic and weight-management research. Popular across metabolic and obesity-related research applications for its dual-pathway mechanism.",
    highlights: [
      "Investigated for effects on appetite signalling, glucose regulation, and body composition",
      "Popular in metabolic and obesity-related research applications",
      "Valued for its dual-pathway mechanism in endocrine and metabolic studies",
      "Lyophilised powder intended for laboratory research use only",
    ],
    form: "Lyophilised powder",
    bestSeller: true,
    variants: [
      { sku: "BPL-TIR10", label: "10 mg vial", strength: "10 mg", price: 28, availability: "in-stock" },
      { sku: "BPL-TIR20", label: "20 mg vial", strength: "20 mg", price: 45, availability: "out-of-stock" },
    ],
  },
  {
    slug: "cagrilintide",
    name: "Cagrilintide",
    tagline: "Long-acting amylin analogue",
    blurb:
      "A long-acting amylin analogue investigated alongside incretin research for satiety signalling, gastric-emptying rate, and body-composition studies.",
    highlights: [
      "Studied for amylin-receptor signalling and satiety pathways",
      "Frequently investigated in combination with incretin research compounds",
      "Used in metabolic and body-composition research models",
      "Lyophilised powder intended for laboratory research use only",
    ],
    form: "Lyophilised powder",
    isNew: true,
    variants: [
      { sku: "BPL-CAG10", label: "10 mg vial", strength: "10 mg", price: 55, availability: "arriving-soon" },
    ],
  },
  {
    slug: "aod-9604",
    name: "AOD-9604",
    tagline: "Modified hGH fragment (176-191)",
    blurb:
      "A modified fragment of human growth hormone studied for lipolytic pathways and fat-metabolism research without the broader growth-hormone signalling profile.",
    highlights: [
      "Investigated for lipolysis and fat-metabolism research",
      "Studied as a growth-hormone fragment with a narrow signalling profile",
      "Used in metabolic and body-composition research models",
      "Lyophilised powder intended for laboratory research use only",
    ],
    form: "Lyophilised powder",
    variants: [
      { sku: "BPL-AOD15", label: "15 mg vial", strength: "15 mg", price: 45, availability: "out-of-stock" },
    ],
  },
  {
    slug: "bpc-157",
    name: "BPC-157",
    tagline: "Body-protection compound for tissue-repair research",
    blurb:
      "A synthetic peptide researched for tissue-repair and regenerative processes across connective tissue, tendon, ligament, and gastrointestinal research models.",
    highlights: [
      "Studied in connective tissue, tendon, ligament, and gastrointestinal research models",
      "Investigated for cellular repair and recovery mechanisms",
      "Popular in regenerative and recovery-focused research settings",
      "Lyophilised powder intended for laboratory research use only",
    ],
    form: "Lyophilised powder",
    bestSeller: true,
    variants: [
      { sku: "BPL-BPC10", label: "10 mg vial", strength: "10 mg", price: 25, availability: "in-stock" },
    ],
  },
  {
    slug: "tb-500",
    name: "TB-500 (Thymosin β4 Acetate)",
    tagline: "Thymosin Beta-4 fragment",
    blurb:
      "A synthetic peptide fragment derived from Thymosin Beta-4, studied for cell migration, tissue remodelling, and recovery research within connective-tissue and regenerative studies.",
    highlights: [
      "Studied for cell migration, tissue remodelling, and recovery research",
      "Frequently investigated in connective tissue and regenerative studies",
      "Used in research involving tissue repair and cellular regeneration",
      "Lyophilised powder intended for laboratory research use only",
    ],
    form: "Lyophilised powder",
    bestSeller: true,
    variants: [
      { sku: "BPL-TB10", label: "10 mg vial", strength: "10 mg", price: 25, availability: "in-stock" },
    ],
  },
  {
    slug: "glow",
    name: "GLOW",
    tagline: "GHK-Cu + BPC-157 + TB-500 research blend",
    blurb:
      "A pre-blended research vial combining GHK-Cu, BPC-157, and TB-500 — three of the most-studied compounds in skin, recovery, and regeneration research.",
    highlights: [
      "Combines three widely researched regenerative compounds in a single vial",
      "Investigated across skin biology, tissue repair, and recovery research",
      "Removes the need to reconstitute three separate research vials",
      "Lyophilised powder intended for laboratory research use only",
    ],
    form: "Lyophilised powder",
    bestSeller: true,
    variants: [
      { sku: "BPL-GLOW70", label: "70 mg vial", strength: "70 mg", price: 55, availability: "out-of-stock" },
    ],
  },
  {
    slug: "klow",
    name: "KLOW",
    tagline: "GHK-Cu + BPC-157 + TB-500 + KPV research blend",
    blurb:
      "A four-compound research blend extending the GLOW profile with KPV, studied across skin biology, tissue repair, and inflammatory-pathway research.",
    highlights: [
      "Four complementary research compounds in a single lyophilised vial",
      "Investigated across regenerative, skin, and inflammatory-pathway research",
      "Frequently used where multi-compound protocols are being modelled",
      "Lyophilised powder intended for laboratory research use only",
    ],
    form: "Lyophilised powder",
    variants: [
      { sku: "BPL-KLOW80", label: "80 mg vial", strength: "80 mg", price: 70, availability: "in-stock" },
    ],
  },
  {
    slug: "tesamorelin",
    name: "Tesamorelin",
    tagline: "GHRH analogue",
    blurb:
      "A growth-hormone-releasing hormone analogue studied for GH-axis signalling, visceral-adipose research, and metabolic investigation.",
    highlights: [
      "Studied for growth-hormone-releasing hormone receptor signalling",
      "Investigated in visceral adipose and metabolic research models",
      "Frequently used in GH-axis and body-composition research",
      "Lyophilised powder intended for laboratory research use only",
    ],
    form: "Lyophilised powder",
    variants: [
      { sku: "BPL-TES10", label: "10 mg vial", strength: "10 mg", price: 45, availability: "in-stock" },
    ],
  },
  {
    slug: "ipamorelin",
    name: "Ipamorelin",
    tagline: "Selective GH secretagogue",
    blurb:
      "A selective growth-hormone secretagogue studied for its targeted GH-release profile in growth-hormone signalling and recovery research.",
    highlights: [
      "Studied for selective growth-hormone release with a narrow signalling profile",
      "Frequently investigated in recovery and healthy-ageing research",
      "One of the most widely used GH secretagogues in research settings",
      "Lyophilised powder intended for laboratory research use only",
    ],
    form: "Lyophilised powder",
    bestSeller: true,
    variants: [
      { sku: "BPL-IPA10", label: "10 mg vial", strength: "10 mg", price: 20, availability: "arriving-soon" },
    ],
  },
  {
    slug: "cjc-1295",
    name: "CJC-1295 (No DAC)",
    tagline: "GHRH analogue, no drug-affinity complex",
    blurb:
      "A growth-hormone-releasing hormone analogue without the drug-affinity complex, studied for pulsatile GH-release research and often investigated alongside Ipamorelin.",
    highlights: [
      "Studied for pulsatile growth-hormone release patterns",
      "Frequently investigated alongside selective GH secretagogues",
      "Used in GH-axis, recovery, and body-composition research",
      "Lyophilised powder intended for laboratory research use only",
    ],
    form: "Lyophilised powder",
    variants: [
      { sku: "BPL-CJC5", label: "5 mg vial", strength: "5 mg", price: 30, availability: "out-of-stock" },
    ],
  },
  {
    slug: "igf-1-lr3",
    name: "IGF-1 LR3",
    tagline: "Long R3 insulin-like growth factor-1",
    blurb:
      "A long-acting analogue of insulin-like growth factor-1 with reduced binding-protein affinity, studied for cellular growth, proliferation, and differentiation research.",
    highlights: [
      "Studied for IGF-1 receptor signalling and cellular proliferation",
      "Extended half-life relative to native IGF-1 in research models",
      "Investigated in growth, recovery, and cellular-differentiation research",
      "Lyophilised powder intended for laboratory research use only",
    ],
    form: "Lyophilised powder",
    isNew: true,
    variants: [
      { sku: "BPL-IGF1", label: "1 mg vial", strength: "1 mg", price: 60, availability: "arriving-soon" },
    ],
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu",
    tagline: "Copper-binding tripeptide",
    blurb:
      "A naturally occurring copper-binding tripeptide studied for collagen synthesis, skin remodelling, and wound-repair research.",
    highlights: [
      "Studied for collagen synthesis and extracellular-matrix remodelling",
      "Widely investigated in skin biology and cosmetic research",
      "Also researched for its antioxidant and tissue-repair pathways",
      "Lyophilised powder intended for laboratory research use only",
    ],
    form: "Lyophilised powder",
    bestSeller: true,
    variants: [
      { sku: "BPL-GHK50", label: "50 mg vial", strength: "50 mg", price: 25, availability: "in-stock" },
    ],
  },
  {
    slug: "melanotan-2",
    name: "Melanotan 2",
    tagline: "Melanocortin receptor agonist",
    blurb:
      "A synthetic analogue of alpha-melanocyte-stimulating hormone studied for melanocortin-receptor signalling and pigmentation research.",
    highlights: [
      "Studied for melanocortin receptor signalling and pigmentation pathways",
      "Investigated in skin biology and photoprotection research",
      "Frequently used in melanocortin-system research models",
      "Lyophilised powder intended for laboratory research use only",
    ],
    form: "Lyophilised powder",
    bestSeller: true,
    variants: [
      { sku: "BPL-MT210", label: "10 mg vial", strength: "10 mg", price: 25, availability: "arriving-soon" },
    ],
  },
  {
    slug: "mots-c",
    name: "MOTS-c",
    tagline: "Mitochondrial-derived peptide",
    blurb:
      "A mitochondrial-derived peptide studied for metabolic regulation, insulin sensitivity, and cellular-energy research.",
    highlights: [
      "Studied for mitochondrial function and cellular energy metabolism",
      "Investigated for insulin sensitivity and metabolic homeostasis",
      "Frequently used in exercise-physiology and ageing research models",
      "Lyophilised powder intended for laboratory research use only",
    ],
    form: "Lyophilised powder",
    bestSeller: true,
    variants: [
      { sku: "BPL-MOTS10", label: "10 mg vial", strength: "10 mg", price: 22, availability: "in-stock" },
    ],
  },
  {
    slug: "ss-31",
    name: "SS-31 (Elamipretide)",
    tagline: "Mitochondria-targeting tetrapeptide",
    blurb:
      "A cell-permeable tetrapeptide that concentrates in the inner mitochondrial membrane, studied for cardiolipin interaction and mitochondrial-bioenergetics research.",
    highlights: [
      "Studied for cardiolipin binding and inner-mitochondrial-membrane stability",
      "Investigated in mitochondrial-bioenergetics and oxidative-stress research",
      "Used in cellular-energy and ageing research models",
      "Lyophilised powder intended for laboratory research use only",
    ],
    form: "Lyophilised powder",
    isNew: true,
    variants: [
      { sku: "BPL-SS3110", label: "10 mg vial", strength: "10 mg", price: 24, availability: "arriving-soon" },
    ],
  },
  {
    slug: "nad-plus",
    name: "NAD+",
    tagline: "Nicotinamide adenine dinucleotide",
    blurb:
      "A coenzyme central to cellular redox reactions and energy metabolism, studied for mitochondrial function, DNA repair, and sirtuin-pathway research.",
    highlights: [
      "Studied for cellular redox balance and energy metabolism",
      "Investigated in sirtuin-pathway, DNA-repair, and ageing research",
      "Frequently used in mitochondrial-function research models",
      "Lyophilised powder intended for laboratory research use only",
    ],
    form: "Lyophilised powder",
    variants: [
      { sku: "BPL-NAD1000", label: "1000 mg vial", strength: "1000 mg", price: 70, availability: "arriving-soon" },
    ],
  },
  {
    slug: "bacteriostatic-water",
    name: "Bacteriostatic Water",
    tagline: "0.9% benzyl alcohol — reconstitution",
    blurb:
      "Sterile water containing 0.9% benzyl alcohol as a bacteriostatic preservative, supplied for laboratory reconstitution of lyophilised research compounds.",
    highlights: [
      "Contains 0.9% benzyl alcohol as a bacteriostatic preservative",
      "Supplied in a sealed, tamper-evident laboratory vial",
      "Standard reconstitution material for lyophilised research compounds",
      "For laboratory research use only",
    ],
    form: "Sterile solution",
    variants: [
      { sku: "BPL-BAC3", label: "3 ml vial", strength: "3 ml", price: 2.5, availability: "out-of-stock" },
      { sku: "BPL-BAC10", label: "10 ml vial", strength: "10 ml", price: 5, availability: "in-stock" },
    ],
  },
];
