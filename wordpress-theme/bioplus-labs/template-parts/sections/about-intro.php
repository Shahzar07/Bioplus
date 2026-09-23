<?php
/**
 * About — commitment copy beside the mission (light) and vision (dark) cards.
 *
 * @package BioPlus
 * @var array $args See registry.
 */

?>
<section class="py-20">
	<div class="<?php echo esc_attr( bioplus_container( 'default', 'grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center' ) ); ?>">
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
			<?php if ( $args['text'] ) : ?>
				<p class="mt-4 text-[15px] leading-relaxed text-ink-600"><?php echo esc_html( $args['text'] ); ?></p>
			<?php endif; ?>
			<div class="mt-7">
				<?php
				bioplus_button(
					array(
						'label' => $args['button_label'],
						'href'  => $args['button_url'],
					)
				);
				?>
			</div>
		</div>

		<div class="grid gap-4">
			<div class="rounded-2xl border border-line bg-white p-7 shadow-card">
				<span class="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><?php bioplus_the_icon( 'target', 20 ); ?></span>
				<h3 class="font-display mt-4 text-lg font-bold"><?php esc_html_e( 'Our Mission', 'bioplus' ); ?></h3>
				<p class="mt-2 text-[14px] leading-relaxed text-ink-600"><?php echo esc_html( $args['mission'] ); ?></p>
			</div>
			<div class="band-dark relative overflow-hidden rounded-2xl p-7 text-white">
				<div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/30 blur-2xl"></div>
				<span class="relative grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-brand-300"><?php bioplus_the_icon( 'compass', 20 ); ?></span>
				<h3 class="font-display relative mt-4 text-lg font-bold"><?php esc_html_e( 'Our Vision', 'bioplus' ); ?></h3>
				<p class="relative mt-2 text-[14px] leading-relaxed text-white/65"><?php echo esc_html( $args['vision'] ); ?></p>
			</div>
		</div>
	</div>
</section>
