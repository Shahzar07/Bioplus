<?php
/**
 * "The BioPlus Range" — product render beside a checklist (page.tsx).
 *
 * @package BioPlus
 * @var array $args See registry.
 */

$image = bioplus_image_url( $args['image'], 'images/products/bioplus-range.webp' );
?>
<section class="relative overflow-hidden py-20">
	<div class="<?php echo esc_attr( bioplus_container( 'default', 'grid items-center gap-10 lg:grid-cols-2' ) ); ?>">
		<div class="relative">
			<div class="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400/15 blur-[90px]"></div>
			<img src="<?php echo esc_url( $image ); ?>" alt="<?php esc_attr_e( 'The BioPlus Labs research vial range', 'bioplus' ); ?>" width="1600" height="893" loading="lazy" class="relative mx-auto w-full rounded-2xl drop-shadow-2xl">
		</div>
		<div>
			<?php
			bioplus_section_heading(
				array(
					'eyebrow' => $args['eyebrow'],
					'title'   => $args['title'],
					'intro'   => $args['intro'],
				)
			);
			?>
			<ul class="mt-6 grid gap-3 sm:grid-cols-2">
				<?php foreach ( bioplus_lines( $args['features'] ) as $f ) : ?>
					<li class="flex items-center gap-2.5 text-[14px] font-medium text-ink-700">
						<span class="brand-gradient grid h-5 w-5 shrink-0 place-items-center rounded-full text-white">✓</span>
						<?php echo esc_html( $f ); ?>
					</li>
				<?php endforeach; ?>
			</ul>
			<div class="mt-7 flex flex-wrap gap-3">
				<?php
				bioplus_button(
					array(
						'label'      => $args['button_label'],
						'href'       => $args['button_url'],
						'icon_after' => 'arrow-right',
					)
				);
				bioplus_button(
					array(
						'label'   => $args['button2_label'],
						'href'    => $args['button2_url'],
						'variant' => 'outline',
						'icon'    => 'calculator',
					)
				);
				?>
			</div>
		</div>
	</div>
</section>
