<?php
/**
 * Affiliate — connected three-step track.
 *
 * @package BioPlus
 * @var array $args eyebrow, title, steps.
 */

?>
<section class="py-20">
	<div class="<?php echo esc_attr( bioplus_container() ); ?>">
		<?php
		bioplus_section_heading(
			array(
				'eyebrow' => $args['eyebrow'],
				'title'   => $args['title'],
				'align'   => 'center',
			)
		);
		?>
		<ol class="relative mt-14 grid gap-10 sm:grid-cols-3 sm:gap-6">
			<span class="absolute left-0 right-0 top-6 hidden h-px bg-line sm:block" aria-hidden="true"></span>
			<?php foreach ( array_values( (array) $args['steps'] ) as $i => $s ) : ?>
				<li class="relative text-center">
					<span class="brand-gradient relative z-10 mx-auto grid h-12 w-12 place-items-center rounded-full text-white ring-8 ring-white"><?php bioplus_the_icon( $s['icon'], 21 ); ?></span>
					<span class="mt-4 block text-[10.5px] font-bold uppercase tracking-[0.2em] text-brand-600"><?php echo esc_html( sprintf( /* translators: %s: step number. */ __( 'Step %s', 'bioplus' ), '0' . ( $i + 1 ) ) ); ?></span>
					<h3 class="font-display mt-2 text-lg font-bold"><?php echo esc_html( $s['title'] ); ?></h3>
					<p class="mx-auto mt-2 max-w-xs text-[14px] leading-relaxed text-ink-600"><?php echo esc_html( $s['text'] ); ?></p>
				</li>
			<?php endforeach; ?>
		</ol>
	</div>
</section>
