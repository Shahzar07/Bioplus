<?php
/**
 * Home FAQ — narrow container with the accordion.
 *
 * @package BioPlus
 * @var array $args See registry.
 */

$items = array_values( (array) $args['items'] );
if ( (int) $args['limit'] > 0 ) {
	$items = array_slice( $items, 0, (int) $args['limit'] );
}
?>
<section class="py-20">
	<div class="<?php echo esc_attr( bioplus_container( 'narrow' ) ); ?>">
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
		<div class="mt-10">
			<?php get_template_part( 'template-parts/components/accordion', null, array( 'items' => $items ) ); ?>
		</div>
		<?php if ( $args['button_label'] ) : ?>
			<div class="mt-8 text-center">
				<?php
				bioplus_button(
					array(
						'label'      => $args['button_label'],
						'href'       => $args['button_url'],
						'variant'    => 'outline',
						'icon_after' => 'arrow-right',
					)
				);
				?>
			</div>
		<?php endif; ?>
	</div>
</section>
