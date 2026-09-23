<?php
/**
 * Research — split panel (dark copy + lit product bay) and compound strip.
 *
 * @package BioPlus
 * @var array $args See registry.
 */

$image    = bioplus_image_url( $args['image'], 'images/products/bioplus-range.webp' );
$featured = function_exists( 'bioplus_products' ) ? bioplus_products( 'skus', bioplus_csv( $args['slugs'] ), 0 ) : array();
$count    = function_exists( 'bioplus_products' ) ? count( bioplus_products( 'all' ) ) : 0;
$stats    = array(
	array( (string) $count, __( 'Compounds', 'bioplus' ) ),
	array( $args['stat2_value'], $args['stat2_label'] ),
	array( $args['stat3_value'], $args['stat3_label'] ),
);
?>
<section class="py-16">
	<div class="<?php echo esc_attr( bioplus_container() ); ?>">
		<div class="overflow-hidden rounded-2xl border border-line shadow-card">
			<div class="grid lg:grid-cols-[1fr_1.1fr]">
				<div class="band-dark relative flex flex-col justify-center p-8 text-white sm:p-11">
					<div class="hairline-grid absolute inset-0 opacity-50"></div>
					<span class="brand-gradient absolute inset-x-0 top-0 h-[3px]"></span>
					<div class="relative">
						<?php
						bioplus_section_heading(
							array(
								'eyebrow' => $args['eyebrow'],
								'title'   => $args['title'],
								'intro'   => $args['intro'],
								'dark'    => true,
							)
						);
						?>
						<dl class="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
							<?php foreach ( $stats as $s ) : ?>
								<div>
									<dt class="font-display text-2xl font-extrabold text-white"><?php echo esc_html( $s[0] ); ?></dt>
									<dd class="mt-0.5 text-[11.5px] leading-snug text-white/50"><?php echo esc_html( $s[1] ); ?></dd>
								</div>
							<?php endforeach; ?>
						</dl>
						<?php
						bioplus_button(
							array(
								'label'      => $args['button_label'],
								'href'       => $args['button_url'],
								'variant'    => 'light',
								'class'      => 'mt-8',
								'icon_after' => 'arrow-right',
							)
						);
						?>
					</div>
				</div>
				<div class="relative flex items-center justify-center bg-mist p-8 sm:p-10">
					<div class="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400/20 blur-[90px]"></div>
					<img src="<?php echo esc_url( $image ); ?>" alt="<?php esc_attr_e( 'BioPlus Labs research peptide vials', 'bioplus' ); ?>" width="1600" height="893" loading="lazy" class="relative w-full drop-shadow-2xl">
				</div>
			</div>
		</div>

		<?php if ( $featured ) : ?>
			<div class="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
				<div class="grid grid-cols-2 divide-x divide-y divide-line sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
					<?php foreach ( $featured as $p ) : ?>
						<a href="<?php echo esc_url( $p['url'] ); ?>" class="group flex flex-col items-center p-5 transition-colors hover:bg-mist">
							<img src="<?php echo esc_url( $p['image'] ); ?>" alt="<?php echo esc_attr( $p['name'] ); ?>" width="880" height="1200" loading="lazy" class="object-contain h-28 w-auto transition-transform duration-500 group-hover:scale-105">
							<span class="mt-3 text-center text-[12px] font-semibold text-ink-800 group-hover:text-brand-700"><?php echo esc_html( $p['name'] ); ?></span>
						</a>
					<?php endforeach; ?>
				</div>
			</div>
		<?php endif; ?>
	</div>
</section>
