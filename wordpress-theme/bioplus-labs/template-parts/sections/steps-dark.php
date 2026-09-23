<?php
/**
 * Numbered steps on the dark band (COA "From sourcing to certificate").
 *
 * @package BioPlus
 * @var array $args eyebrow, title, intro, steps.
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
				'intro'   => $args['intro'],
				'align'   => 'center',
				'dark'    => true,
			)
		);
		?>
		<div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
			<?php foreach ( array_values( (array) $args['steps'] ) as $i => $s ) : ?>
				<div class="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
					<span class="brand-text-gradient font-display text-3xl font-extrabold"><?php echo esc_html( str_pad( (string) ( $i + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></span>
					<h3 class="font-display mt-3 text-lg font-bold"><?php echo esc_html( $s['title'] ); ?></h3>
					<p class="mt-2 text-[13px] leading-relaxed text-white/60"><?php echo esc_html( $s['text'] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
