"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { AlertCircle, Check, Plus, Trash2, Upload } from "lucide-react";
import { Panel, PanelHead } from "@/components/admin/ui";
import { saveProduct, type ProductActionResult } from "@/app/admin/products/actions";
import type { Availability, ProductStatus } from "@/generated/prisma";

export type ProductFormVariant = {
  id?: string;
  sku: string;
  label: string;
  strength: string;
  price: string;
  availability: Availability;
  stockQty: string;
  lowStockAt: string;
};

export type ProductFormValues = {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  blurb: string;
  form: string;
  highlights: string;
  status: ProductStatus;
  imageUrl: string;
  bestSeller: boolean;
  isNew: boolean;
  variants: ProductFormVariant[];
};

const BLANK_VARIANT: ProductFormVariant = {
  sku: "",
  label: "",
  strength: "",
  price: "",
  availability: "IN_STOCK",
  stockQty: "0",
  lowStockAt: "5",
};

export function ProductForm({
  values,
  uploadsEnabled,
}: {
  values: ProductFormValues;
  uploadsEnabled: boolean;
}) {
  const [state, action] = useActionState<ProductActionResult, FormData>(saveProduct, undefined);
  const [variants, setVariants] = useState<ProductFormVariant[]>(
    values.variants.length > 0 ? values.variants : [BLANK_VARIANT],
  );
  const [imageUrl, setImageUrl] = useState(values.imageUrl);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function uploadImage(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed.");
      setImageUrl(data.url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={action} className="space-y-5">
      {values.id && <input type="hidden" name="id" value={values.id} />}

      {state?.error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-800"
        >
          <AlertCircle size={16} className="mt-px shrink-0" />
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-medium text-emerald-800">
          <Check size={16} className="mt-px shrink-0" />
          {state.ok}
        </p>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <Panel>
            <PanelHead title="Details" subtitle="How the product reads on the shop and its own page." />
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Field label="Product name" name="name" defaultValue={values.name} required full />
              <Field
                label="URL slug"
                name="slug"
                defaultValue={values.slug}
                placeholder="bpc-157"
                hint="The product's web address: /product/<slug>"
                full
              />
              <Field
                label="Tagline"
                name="tagline"
                defaultValue={values.tagline}
                placeholder="Body-protection compound for tissue-repair research"
                required
                full
              />
              <TextArea
                label="Description"
                name="blurb"
                defaultValue={values.blurb}
                rows={4}
                required
              />
              <TextArea
                label="Highlights"
                name="highlights"
                defaultValue={values.highlights}
                rows={4}
                hint="One per line — shown as bullet points on the product page."
              />
              <Field label="Form" name="form" defaultValue={values.form} placeholder="Lyophilised powder" />
              <div>
                <label htmlFor="status" className="mb-1.5 block text-[12.5px] font-semibold text-ink-700">
                  Visibility
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={values.status}
                  className="h-10 w-full rounded-xl border border-line bg-white px-3 text-[13.5px] outline-none focus:border-brand-500"
                >
                  <option value="ACTIVE">Live on the storefront</option>
                  <option value="DRAFT">Draft — hidden</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelHead
              title="Options"
              subtitle="Each option is a SKU with its own price and stock."
              action={
                <button
                  type="button"
                  onClick={() => setVariants((current) => [...current, { ...BLANK_VARIANT }])}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line px-3 text-[12.5px] font-semibold text-ink-700 transition hover:border-brand-500 hover:text-brand-700"
                >
                  <Plus size={14} /> Add option
                </button>
              }
            />
            <div className="space-y-4 p-5">
              {variants.map((variant, index) => (
                <div key={index} className="rounded-xl border border-line bg-mist/60 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-ink-500">
                      Option {index + 1}
                    </span>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setVariants((c) => c.filter((_, i) => i !== index))}
                        className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    )}
                  </div>
                  {variant.id && <input type="hidden" name="variantId" value={variant.id} />}
                  {!variant.id && <input type="hidden" name="variantId" value="" />}
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <Field label="SKU" name="variantSku" defaultValue={variant.sku} placeholder="BPL-BPC10" required />
                    <Field label="Option label" name="variantLabel" defaultValue={variant.label} placeholder="10 mg vial" required />
                    <Field label="Strength" name="variantStrength" defaultValue={variant.strength} placeholder="10 mg" />
                    <Field label="Price (£)" name="variantPrice" type="number" step="0.01" min="0" defaultValue={variant.price} required />
                    <Field label="Stock on hand" name="variantStock" type="number" min="0" defaultValue={variant.stockQty} />
                    <Field label="Low-stock alert at" name="variantLowStock" type="number" min="0" defaultValue={variant.lowStockAt} />
                    <label className="block sm:col-span-2 lg:col-span-3">
                      <span className="mb-1.5 block text-[12.5px] font-semibold text-ink-700">
                        Availability
                      </span>
                      <select
                        name="variantAvailability"
                        defaultValue={variant.availability}
                        className="h-10 w-full rounded-xl border border-line bg-white px-3 text-[13.5px] outline-none focus:border-brand-500"
                      >
                        <option value="IN_STOCK">In stock</option>
                        <option value="OUT_OF_STOCK">Out of stock</option>
                        <option value="ARRIVING_SOON">Arriving soon</option>
                      </select>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel>
            <PanelHead title="Image" subtitle="Falls back to /products/vial-<slug>.webp." />
            <div className="space-y-3 p-5">
              {imageUrl && (
                // A product shot is a plain asset here; next/image would add no
                // value for a dashboard preview of an arbitrary URL.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt="Product"
                  className="mx-auto h-40 w-auto rounded-xl bg-white object-contain"
                />
              )}
              <input type="hidden" name="imageUrl" value={imageUrl} />
              {uploadsEnabled ? (
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-mist px-4 py-3 text-[13px] font-semibold text-ink-700 transition hover:border-brand-500 hover:text-brand-700">
                  <Upload size={15} />
                  {uploading ? "Uploading…" : imageUrl ? "Replace image" : "Upload image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadImage(file);
                    }}
                  />
                </label>
              ) : (
                <p className="rounded-xl bg-mist px-4 py-3 text-[12.5px] leading-relaxed text-ink-600">
                  Image uploads need <code className="font-mono">BLOB_READ_WRITE_TOKEN</code> set.
                  Until then, products use the bundled photography.
                </p>
              )}
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="w-full text-center text-[12.5px] font-semibold text-red-600 hover:text-red-700"
                >
                  Remove image
                </button>
              )}
              {uploadError && <p className="text-[12.5px] font-medium text-red-700">{uploadError}</p>}
            </div>
          </Panel>

          <Panel>
            <PanelHead title="Merchandising" />
            <div className="space-y-3 p-5">
              <Checkbox name="bestSeller" label="Best seller" defaultChecked={values.bestSeller} />
              <Checkbox name="isNew" label="New arrival" defaultChecked={values.isNew} />
            </div>
          </Panel>

          <div className="flex flex-wrap gap-2">
            <SaveButton />
            <Link
              href="/admin/products"
              className="inline-flex h-9 items-center rounded-full border border-line bg-white px-4 text-[13px] font-semibold text-ink-800 transition hover:border-brand-500"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="brand-gradient inline-flex h-9 items-center rounded-full px-5 text-[13px] font-bold text-white transition enabled:hover:brightness-110 disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save & publish"}
    </button>
  );
}

/**
 * Labels wrap their control rather than using htmlFor: the variant rows repeat
 * the same field names, and duplicate ids would break the association.
 */
function Field({
  label,
  hint,
  full,
  ...props
}: { label: string; hint?: string; full?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-[12.5px] font-semibold text-ink-700">{label}</span>
      <input
        {...props}
        className="h-10 w-full rounded-xl border border-line bg-white px-3 text-[13.5px] outline-none transition focus:border-brand-500"
      />
      {hint && <span className="mt-1 block text-[11.5px] text-ink-500">{hint}</span>}
    </label>
  );
}

function TextArea({
  label,
  hint,
  ...props
}: { label: string; hint?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block sm:col-span-2">
      <span className="mb-1.5 block text-[12.5px] font-semibold text-ink-700">{label}</span>
      <textarea
        {...props}
        className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-[13.5px] outline-none transition focus:border-brand-500"
      />
      {hint && <span className="mt-1 block text-[11.5px] text-ink-500">{hint}</span>}
    </label>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[13.5px] font-medium text-ink-800">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-brand-600"
      />
      {label}
    </label>
  );
}
