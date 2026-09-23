<?php
/**
 * Research access verification (AgeGate.tsx). Hidden until theme.js confirms
 * the visitor has not already agreed (localStorage), so returning visitors never see a flash.
 *
 * @package BioPlus
 */

$statements = array(
	__( 'I am at least 18 years of age.', 'bioplus' ),
	__( 'I understand that all products offered by BioPlus Labs are intended solely for laboratory research purposes.', 'bioplus' ),
	__( 'I acknowledge that these products are not intended for human or animal consumption.', 'bioplus' ),
	__( 'I understand that products sold by BioPlus Labs are not intended to diagnose, treat, cure, or prevent any disease.', 'bioplus' ),
	__( 'I agree to comply with all applicable laws and regulations regarding the purchase, possession, and use of research materials.', 'bioplus' ),
);
?>
<div class="fixed inset-0 z-[100] hidden items-center justify-center p-4" data-age-gate role="dialog" aria-modal="true" aria-labelledby="bioplus-gate-title">
	<div class="band-dark absolute inset-0 hairline-grid"></div>
	<div class="absolute inset-0 bg-ink-950/70 backdrop-blur-sm"></div>

	<div class="animate-fade-up relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-ink-900/95 shadow-pop">
		<div class="brand-gradient h-1.5 w-full"></div>
		<div class="p-7 sm:p-9">
			<div class="flex flex-col items-center text-center">
				<?php
				bioplus_logo(
					array(
						'variant' => 'white',
						'height'  => 40,
						'href'    => null,
					)
				);
				?>
				<div id="bioplus-gate-title" class="mt-5 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300">
					<?php bioplus_the_icon( 'shield-check', 13 ); ?> <?php esc_html_e( 'Research Access Verification', 'bioplus' ); ?>
				</div>
				<p class="mt-4 text-sm leading-relaxed text-white/70"><?php esc_html_e( 'Before entering this website, please confirm the following:', 'bioplus' ); ?></p>
			</div>

			<label class="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-brand-500/40">
				<span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition border-white/30 bg-transparent" data-on="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition brand-gradient border-transparent" data-off="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition border-white/30 bg-transparent" data-gate-box>
					<?php bioplus_the_icon( 'check', 14, 'hidden text-white', array( 'stroke' => 3 ) ); ?>
				</span>
				<input type="checkbox" class="sr-only" data-gate-check>
				<span class="text-[13px] font-semibold text-white"><?php esc_html_e( 'I confirm and agree to all of the statements below.', 'bioplus' ); ?></span>
			</label>

			<ul class="mt-4 space-y-2.5">
				<?php foreach ( $statements as $s ) : ?>
					<li class="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-white/65">
						<span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400"></span>
						<?php echo esc_html( $s ); ?>
					</li>
				<?php endforeach; ?>
			</ul>

			<div class="mt-7 flex flex-col gap-3 sm:flex-row">
				<button type="button" disabled class="brand-gradient h-12 flex-1 rounded-full text-sm font-bold text-white shadow-[0_8px_24px_-8px_rgba(248,80,0,0.7)] transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40" data-gate-enter><?php esc_html_e( 'Enter Site', 'bioplus' ); ?></button>
				<button type="button" class="h-12 flex-1 rounded-full border border-white/15 text-sm font-semibold text-white/70 transition hover:bg-white/5" data-gate-leave><?php esc_html_e( 'Leave Site', 'bioplus' ); ?></button>
			</div>

			<p class="mt-5 text-center text-[11px] leading-relaxed text-white/40"><?php esc_html_e( 'By selecting “Enter Site,” you certify that you are at least 18 years of age and understand the research-use-only nature of the products offered by BioPlus Labs.', 'bioplus' ); ?></p>
		</div>
	</div>
</div>
