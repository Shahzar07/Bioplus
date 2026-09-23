<?php
/**
 * Quality process — numbered dark band (page.tsx).
 *
 * @package BioPlus
 * @var array $args eyebrow, title, steps.
 */

?>
<section class="band-dark relative overflow-hidden py-20 text-white">
	<div class="hairline-grid absolute inset-0 opacity-50"></div>
	<div class="<?php echo esc_attr( bioplus_container( 'default', 'relative' ) ); ?>">
		<?php
		bioplus_section_heading(
			array(
				'eyebrow' => $args['eyebrow'],
				'title'   => $args['title'],
				'align'   => 'center',
				'dark'    => true,
			)
		);
		?>
		<div class="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
			<?php foreach ( array_values( (array) $args['steps'] ) as $i => $s ) : ?>
				<div class="group relative bg-ink-900 p-7 transition-colors hover:bg-ink-800">
					<div class="flex items-center justify-between">
						<span class="grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-white">
							<?php bioplus_the_icon( $s['icon'], 19 ); ?>
						</span>
						<span class="font-display text-[13px] font-bold uppercase tracking-[0.18em] text-white/25">
							<?php
							/* translators: %s: step number such as 01. */
							echo esc_html( sprintf( __( 'Step %s', 'bioplus' ), str_pad( (string) ( $i + 1 ), 2, '0', STR_PAD_LEFT ) ) );
							?>
						</span>
					</div>
					<h3 class="font-display mt-6 text-[17px] font-bold"><?php echo esc_html( $s['title'] ); ?></h3>
					<p class="mt-2.5 text-[13px] leading-relaxed text-white/55"><?php echo esc_html( $s['text'] ); ?></p>
					<span class="brand-gradient absolute bottom-0 left-0 h-[3px] w-0 transition-all duration-300 group-hover:w-full"></span>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
