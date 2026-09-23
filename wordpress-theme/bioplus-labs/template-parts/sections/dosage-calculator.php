<?php
/**
 * Peptide dosage calculator (DosageCalculator.tsx) — driven by assets/js/theme.js.
 *
 * @package BioPlus
 * @var array $args dose_presets, strength_presets, volume_presets, disclaimer.
 */

$groups = array(
	array(
		'key'     => 'dose',
		'icon'    => 'syringe',
		'title'   => __( 'Desired Dose', 'bioplus' ),
		'helper'  => __( '0.1 mg = 100 mcg (µg)', 'bioplus' ),
		'unit'    => 'mg',
		'presets' => bioplus_csv( $args['dose_presets'] ),
		'value'   => '0.5',
		'step'    => '0.05',
	),
	array(
		'key'     => 'strength',
		'icon'    => 'flask-conical',
		'title'   => __( 'Peptide Strength', 'bioplus' ),
		'helper'  => '',
		'unit'    => 'mcg/ml',
		'presets' => bioplus_csv( $args['strength_presets'] ),
		'value'   => '1000',
		'step'    => '50',
	),
	array(
		'key'     => 'volume',
		'icon'    => 'beaker',
		'title'   => __( 'Volume (Bacteriostatic Water)', 'bioplus' ),
		'helper'  => '',
		'unit'    => 'ml',
		'presets' => bioplus_csv( $args['volume_presets'] ),
		'value'   => '2.0',
		'step'    => '0.5',
	),
);
$on  = 'rounded-full border px-4 py-2 text-[13px] font-semibold transition-all brand-gradient border-transparent text-white shadow-[0_6px_16px_-6px_rgba(248,80,0,0.6)]';
$off = 'rounded-full border px-4 py-2 text-[13px] font-semibold transition-all border-line bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700';
?>
<div class="<?php echo esc_attr( bioplus_container( 'default', 'py-12' ) ); ?>">
	<div class="grid gap-6 lg:grid-cols-[1.4fr_1fr]" data-dosage-calculator>
		<div class="space-y-5">
			<?php foreach ( $groups as $g ) : ?>
				<section class="relative overflow-hidden rounded-xl border border-line bg-white p-5 pl-6 shadow-card sm:p-6 sm:pl-7" data-calc-group="<?php echo esc_attr( $g['key'] ); ?>" data-value="<?php echo esc_attr( $g['value'] ); ?>">
					<span class="brand-gradient absolute inset-y-0 left-0 w-[3px]"></span>
					<div class="flex items-center gap-3">
						<span class="brand-gradient grid h-9 w-9 place-items-center rounded-lg text-white"><?php bioplus_the_icon( $g['icon'], 17 ); ?></span>
						<h2 class="font-display text-lg font-bold text-ink-900"><?php echo esc_html( $g['title'] ); ?></h2>
					</div>
					<div class="mt-4 flex flex-wrap gap-2.5">
						<?php foreach ( $g['presets'] as $p ) : ?>
							<?php $active = (float) $p === (float) $g['value']; ?>
							<button type="button" class="<?php echo esc_attr( $active ? $on : $off ); ?>" data-on="<?php echo esc_attr( $on ); ?>" data-off="<?php echo esc_attr( $off ); ?>" data-preset="<?php echo esc_attr( $p ); ?>"><?php echo esc_html( $p . ' ' . $g['unit'] ); ?></button>
						<?php endforeach; ?>
						<button type="button" class="<?php echo esc_attr( 'rounded-full border px-4 py-2 text-[13px] font-semibold transition-all border-line bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700' ); ?>" data-on="rounded-full border px-4 py-2 text-[13px] font-semibold transition-all brand-gradient border-transparent text-white" data-off="<?php echo esc_attr( $off ); ?>" data-other><?php esc_html_e( 'Other', 'bioplus' ); ?></button>
					</div>
					<div class="mt-3 hidden items-center gap-2" data-other-wrap>
						<input type="number" min="0" step="<?php echo esc_attr( $g['step'] ); ?>" value="<?php echo esc_attr( $g['value'] ); ?>" class="h-11 w-40 rounded-xl border border-line bg-white px-3.5 text-sm outline-none focus:border-brand-500" aria-label="<?php echo esc_attr( $g['title'] ); ?>" data-other-input>
						<span class="text-sm font-medium text-ink-500"><?php echo esc_html( $g['unit'] ); ?></span>
					</div>
					<?php if ( $g['helper'] ) : ?>
						<p class="mt-3 text-[12px] text-ink-500"><?php echo esc_html( $g['helper'] ); ?></p>
					<?php endif; ?>
				</section>
			<?php endforeach; ?>
		</div>

		<aside class="lg:sticky lg:top-24 lg:self-start">
			<div class="rounded-2xl border border-line bg-white p-6 shadow-card">
				<div class="rounded-xl bg-mist p-6 text-center">
					<?php bioplus_the_icon( 'gauge', 22, 'mx-auto text-brand-600' ); ?>
					<p class="mt-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-500"><?php esc_html_e( 'You Need to Draw', 'bioplus' ); ?></p>
					<p class="font-display mt-1 text-5xl font-bold leading-none text-brand-700"><span data-calc-ml>0.50</span><span class="ml-1 text-2xl text-ink-500">ml</span></p>
					<p class="mt-1 text-[13px] text-ink-500"><?php esc_html_e( 'of Peptide Solution', 'bioplus' ); ?></p>
				</div>

				<div class="mt-6 flex items-center justify-center">
					<svg viewBox="0 0 160 360" class="h-72 w-auto" role="img" aria-label="<?php esc_attr_e( 'Syringe fill illustration', 'bioplus' ); ?>">
						<rect x="40" y="6" width="80" height="10" rx="3" fill="#9aa4b5"></rect>
						<rect x="74" y="14" width="12" height="28" fill="#9aa4b5"></rect>
						<rect x="58" y="40" width="44" height="250" rx="6" fill="#f1f4f9" stroke="#cdd6e4"></rect>
						<rect x="60" y="227.5" width="40" height="62.5" rx="4" class="fill-brand-500" opacity="0.85" data-calc-fill></rect>
						<?php for ( $t = 0; $t <= 10; $t++ ) : ?>
							<?php $y = 40 + ( $t / 10 ) * 250; ?>
							<g>
								<line x1="102" y1="<?php echo esc_attr( $y ); ?>" x2="116" y2="<?php echo esc_attr( $y ); ?>" stroke="#94a0b4" stroke-width="1"></line>
								<text x="120" y="<?php echo esc_attr( $y + 3 ); ?>" font-size="9" fill="#64748b" font-family="Inter, sans-serif"><?php echo esc_html( 100 - $t * 10 ); ?></text>
							</g>
						<?php endfor; ?>
						<rect x="76" y="290" width="8" height="14" fill="#cdd6e4"></rect>
						<rect x="79" y="304" width="2" height="40" fill="#aab4c4"></rect>
					</svg>
				</div>

				<p class="mt-5 hidden rounded-xl bg-amber-50 p-3 text-center text-[12.5px] font-medium text-amber-800" data-calc-over><?php esc_html_e( 'The required draw exceeds the vial volume. Increase the peptide strength or volume.', 'bioplus' ); ?></p>
				<dl class="mt-5 space-y-2.5 text-sm" data-calc-stats>
					<div class="flex items-center justify-between gap-3 border-b border-line pb-2.5 last:border-0">
						<dt class="text-ink-600"><?php esc_html_e( 'On a U-100 insulin syringe', 'bioplus' ); ?></dt>
						<dd class="font-display font-bold text-ink-900"><span data-calc-units>50</span> <?php esc_html_e( 'units', 'bioplus' ); ?></dd>
					</div>
					<div class="flex items-center justify-between gap-3 border-b border-line pb-2.5 last:border-0">
						<dt class="text-ink-600"><?php esc_html_e( 'Total peptide in vial', 'bioplus' ); ?></dt>
						<dd class="font-display font-bold text-ink-900"><span data-calc-total>2.00</span> mg</dd>
					</div>
					<div class="flex items-center justify-between gap-3 border-b border-line pb-2.5 last:border-0">
						<dt class="text-ink-600"><?php esc_html_e( 'Approx. doses per vial', 'bioplus' ); ?></dt>
						<dd class="font-display font-bold text-ink-900" data-calc-doses>4.0</dd>
					</div>
				</dl>

				<p class="mt-5 flex items-start gap-2 text-[11px] leading-relaxed text-ink-500">
					<?php bioplus_the_icon( 'flask-round', 14, 'mt-0.5 shrink-0 text-brand-600' ); ?>
					<?php echo esc_html( $args['disclaimer'] ); ?>
				</p>
			</div>
		</aside>
	</div>
</div>
