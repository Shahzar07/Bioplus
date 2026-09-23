<?php
/**
 * Product grid with a centred heading (home "stacks" and "best sellers").
 *
 * @package BioPlus
 * @var array $args eyebrow, title, intro, source, slugs, limit, background, button_label, button_url.
 */

$products = function_exists( 'bioplus_products' ) ? bioplus_products( $args['source'], bioplus_csv( $args['slugs'] ), (int) $args['limit'] ) : array();
?>
<section class="<?php echo esc_attr( 'mist' === $args['background'] ? 'bg-mist py-20' : 'py-20' ); ?>">
	<div class="<?php echo esc_attr( bioplus_container() ); ?>">
		<?php
		bioplus_section_heading(
			array(
				'eyebrow' => $args['eyebrow'],
				'title'   => $args['title'],
				'intro'   => $args['intro'],
				'align'   => 'center',
			)
		);
		?>
		<?php if ( $products ) : ?>
			<div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
				<?php
				foreach ( $products as $product ) {
					get_template_part( 'template-parts/components/product-card', null, array( 'product' => $product ) );
				}
				?>
			</div>
		<?php elseif ( current_user_can( 'manage_options' ) ) : ?>
			<p class="mt-12 rounded-xl border border-dashed border-line bg-white p-6 text-center text-sm text-ink-500"><?php esc_html_e( 'No products yet — run Appearance → BioPlus Setup to import the catalogue.', 'bioplus' ); ?></p>
		<?php endif; ?>
		<?php if ( $args['button_label'] ) : ?>
			<div class="mt-10 text-center">
				<?php
				bioplus_button(
					array(
						'label'      => $args['button_label'],
						'href'       => $args['button_url'],
						'variant'    => 'dark',
						'size'       => 'lg',
						'icon_after' => 'arrow-right',
						'icon_size'  => 18,
					)
				);
				?>
			</div>
		<?php endif; ?>
	</div>
</section>
