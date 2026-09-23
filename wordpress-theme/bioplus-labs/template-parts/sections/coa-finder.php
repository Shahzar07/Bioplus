<?php
/**
 * COA batch register with live search (CoaFinder.tsx).
 *
 * Entries come from the "COA Batches" post type so the register is edited in
 * wp-admin; each row can carry its certificate PDF.
 *
 * @package BioPlus
 * @var array $args eyebrow, title, intro.
 */

$entries = function_exists( 'bioplus_coa_entries' ) ? bioplus_coa_entries() : array();
?>
<section class="bg-mist py-20" data-coa-finder>
	<div class="<?php echo esc_attr( bioplus_container() ); ?>">
		<div class="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:items-start">
			<div class="lg:sticky lg:top-24">
				<?php
				bioplus_section_heading(
					array(
						'eyebrow' => $args['eyebrow'],
						'title'   => $args['title'],
						'intro'   => $args['intro'],
					)
				);
				?>

				<label class="mt-6 flex items-center gap-2.5 rounded-full border border-line bg-white px-4 py-3 shadow-card focus-within:border-brand-500">
					<?php bioplus_the_icon( 'search', 17, 'shrink-0 text-ink-500' ); ?>
					<input type="search" placeholder="<?php esc_attr_e( 'Product name or batch number…', 'bioplus' ); ?>" aria-label="<?php esc_attr_e( 'Search certificates of analysis', 'bioplus' ); ?>" class="w-full bg-transparent text-[14px] outline-none placeholder:text-ink-500" data-coa-input>
					<button type="button" aria-label="<?php esc_attr_e( 'Clear search', 'bioplus' ); ?>" class="hidden shrink-0 text-ink-500 hover:text-ink-900" data-coa-clear><?php bioplus_the_icon( 'x', 16 ); ?></button>
				</label>

				<div class="mt-4 space-y-2.5 rounded-2xl border border-line bg-white p-5 text-[12.5px] shadow-card">
					<p class="flex items-center gap-2 font-semibold text-emerald-700"><span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> <?php esc_html_e( 'PASS > 99% — Meets BioPlus specification', 'bioplus' ); ?></p>
					<p class="flex items-center gap-2 font-semibold text-brand-700"><span class="h-2.5 w-2.5 rounded-full bg-brand-500"></span> <?php esc_html_e( 'PASS > 98% — Acceptable research grade', 'bioplus' ); ?></p>
					<p class="flex items-start gap-2 pt-1 text-ink-500"><?php bioplus_the_icon( 'flask-conical', 14, 'mt-0.5 shrink-0' ); ?> <?php esc_html_e( 'Results are listed by product and batch number for full transparency.', 'bioplus' ); ?></p>
				</div>
			</div>

			<div class="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
				<div class="grid grid-cols-[1.6fr_0.9fr_1fr] gap-3 border-b border-line bg-ink-900 px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-white/70">
					<span><?php esc_html_e( 'Product & result', 'bioplus' ); ?></span>
					<span><?php esc_html_e( 'Batch', 'bioplus' ); ?></span>
					<span class="text-right"><?php esc_html_e( 'Actions', 'bioplus' ); ?></span>
				</div>

				<div class="hidden px-5 py-14 text-center" data-coa-empty>
					<p class="text-[14px] font-semibold text-ink-900"><?php esc_html_e( 'No certificates match', 'bioplus' ); ?> &ldquo;<span data-coa-term></span>&rdquo;.</p>
					<p class="mt-1.5 text-[13px] text-ink-600"><?php esc_html_e( 'Check the batch number printed on your vial label, or contact us and we will send the certificate directly.', 'bioplus' ); ?></p>
				</div>

				<ul class="divide-y divide-line" data-coa-list>
					<?php foreach ( $entries as $r ) : ?>
						<?php $top = (float) $r['purity'] >= 99; ?>
						<li class="grid grid-cols-[1.6fr_0.9fr_1fr] items-center gap-3 px-5 py-4" data-search="<?php echo esc_attr( strtolower( $r['product'] . ' ' . $r['batch'] ) ); ?>">
							<div class="min-w-0">
								<a href="<?php echo esc_url( $r['url'] ); ?>" class="block truncate text-[14px] font-semibold text-ink-900 hover:text-brand-700"><?php echo esc_html( $r['product'] ); ?></a>
								<span class="<?php echo esc_attr( $top ? 'mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-700' : 'mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold bg-brand-100 text-brand-700' ); ?>">
									<?php bioplus_the_icon( 'badge-check', 12 ); ?> <?php echo esc_html( 'PASS · ' . number_format( (float) $r['purity'], 1 ) . '%' ); ?>
								</span>
							</div>
							<div class="min-w-0">
								<span class="block truncate font-mono text-[12px] text-ink-700"><?php echo esc_html( $r['batch'] ); ?></span>
								<span class="text-[11px] text-ink-500"><?php echo esc_html( sprintf( /* translators: %s: month tested. */ __( 'Tested %s', 'bioplus' ), $r['tested'] ) ); ?></span>
							</div>
							<div class="flex flex-wrap justify-end gap-2">
								<a href="<?php echo esc_url( $r['pdf'] ? $r['pdf'] : bioplus_url( 'account/files' ) ); ?>"<?php echo $r['pdf'] ? ' target="_blank" rel="noopener"' : ''; ?> class="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[12px] font-semibold text-ink-700 hover:border-brand-400 hover:text-brand-700">
									<?php bioplus_the_icon( 'file-text', 13 ); ?> <?php esc_html_e( 'COA', 'bioplus' ); ?>
								</a>
								<a href="<?php echo esc_url( $r['url'] ); ?>" class="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[12px] font-semibold text-ink-700 hover:border-brand-400 hover:text-brand-700">
									<?php esc_html_e( 'Product', 'bioplus' ); ?> <?php bioplus_the_icon( 'arrow-up-right', 13 ); ?>
								</a>
							</div>
						</li>
					<?php endforeach; ?>
				</ul>
			</div>
		</div>
	</div>
</section>
