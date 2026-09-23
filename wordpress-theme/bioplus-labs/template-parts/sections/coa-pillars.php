<?php
/**
 * COA — documentation heading beside a 2×2 of pillars.
 *
 * @package BioPlus
 * @var array $args See registry.
 */

?>
<section class="py-20">
	<div class="<?php echo esc_attr( bioplus_container( 'default', 'grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center' ) ); ?>">
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
			<div class="mt-6 flex flex-wrap gap-3">
				<?php
				bioplus_button(
					array(
						'label' => $args['button_label'],
						'href'  => $args['button_url'],
					)
				);
				bioplus_button(
					array(
						'label'   => $args['button2_label'],
						'href'    => $args['button2_url'],
						'variant' => 'outline',
					)
				);
				?>
			</div>
		</div>
		<div class="grid gap-4 sm:grid-cols-2">
			<?php foreach ( (array) $args['cards'] as $c ) : ?>
				<div class="rounded-2xl border border-line bg-white p-5 shadow-card">
					<span class="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><?php bioplus_the_icon( $c['icon'], 20 ); ?></span>
					<h3 class="font-display mt-3 text-base font-bold"><?php echo esc_html( $c['title'] ); ?></h3>
					<p class="mt-1.5 text-[13px] leading-relaxed text-ink-600"><?php echo esc_html( $c['text'] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
