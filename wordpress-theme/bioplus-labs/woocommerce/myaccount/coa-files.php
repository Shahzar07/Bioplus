<?php
/**
 * Research Hub → Files & Certificates of Analysis.
 *
 * @package BioPlus
 * @version 1.0.0
 */

defined( 'ABSPATH' ) || exit;

$files = bioplus_customer_coa_files( get_current_user_id() );

wc_get_template(
	'myaccount/panel-header.php',
	array(
		'title'    => __( 'Files & Certificates of Analysis', 'bioplus' ),
		'subtitle' => __( 'Batch-specific COA and documentation for your orders.', 'bioplus' ),
	)
);
?>
<div class="mt-6 space-y-6">
	<?php if ( ! $files ) : ?>
		<div class="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
			<span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-500/15 text-brand-300"><?php bioplus_the_icon( 'file-text', 24 ); ?></span>
			<p class="font-display mt-4 text-lg font-bold text-white"><?php esc_html_e( 'No documents yet', 'bioplus' ); ?></p>
			<p class="mt-1.5 text-[13.5px] text-white/55"><?php esc_html_e( 'Certificates of Analysis are attached to your orders as each batch is released, and appear here automatically.', 'bioplus' ); ?></p>
		</div>
	<?php else : ?>
		<div class="rounded-2xl border border-white/10 bg-white/[0.03] p-2.5">
			<ul class="divide-y divide-white/10">
				<?php foreach ( $files as $f ) : ?>
					<li class="flex items-center gap-4 px-4 py-4">
						<span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-brand-300"><?php bioplus_the_icon( 'file-text', 19 ); ?></span>
						<div class="min-w-0 flex-1">
							<p class="truncate text-[14px] font-semibold text-white"><?php echo esc_html( 'COA — ' . $f['label'] . ( $f['batch'] ? ' (Batch ' . $f['batch'] . ')' : '' ) ); ?></p>
							<p class="text-[12px] text-white/50"><?php echo esc_html( sprintf( /* translators: 1: order number, 2: date. */ __( 'Order %1$s · %2$s', 'bioplus' ), $f['order'], wp_date( 'j M Y', $f['date'] ) ) ); ?></p>
						</div>
						<a href="<?php echo esc_url( $f['url'] ); ?>" target="_blank" rel="noreferrer" class="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-[13px] font-semibold text-white transition hover:border-brand-400 hover:text-brand-300"><?php bioplus_the_icon( 'download', 15 ); ?> <?php esc_html_e( 'Download', 'bioplus' ); ?></a>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>
	<?php endif; ?>

	<div class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-[13px] leading-relaxed text-white/55">
		<?php bioplus_the_icon( 'flask-conical', 18, 'mt-0.5 shrink-0 text-brand-300' ); ?>
		<p><?php esc_html_e( 'Each production batch is subject to comprehensive analytical testing — including HPLC, UPLC, and Mass Spectrometry — to verify identity, purity, and quality specifications. Certificates are uploaded here as they are finalized and remain available for your records.', 'bioplus' ); ?></p>
	</div>
</div>
