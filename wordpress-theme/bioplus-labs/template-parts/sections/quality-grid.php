<?php
/**
 * Quality commitment — heading on the left, four cards on the right.
 *
 * @package BioPlus
 * @var array $args See registry.
 */

?>
<section class="bg-mist py-20">
	<div class="<?php echo esc_attr( bioplus_container( 'default', 'grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center' ) ); ?>">
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
			<div class="mt-7 flex flex-wrap gap-3">
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
			<?php foreach ( (array) $args['cards'] as $q ) : ?>
				<div class="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-card">
					<span class="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><?php bioplus_the_icon( $q['icon'], 20 ); ?></span>
					<h3 class="font-display mt-4 text-base font-bold text-ink-900"><?php echo esc_html( $q['title'] ); ?></h3>
					<p class="mt-2 text-[13px] leading-relaxed text-ink-600"><?php echo esc_html( $q['text'] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
