<?php
/**
 * Icon cards grid — About "why", Research "guides", COA "methods".
 *
 * @package BioPlus
 * @var array $args eyebrow, title, intro, align, columns, style, background, note, cards.
 */

$cols = array(
	'2' => 'mt-12 grid gap-5 sm:grid-cols-2',
	'3' => 'mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3',
	'4' => 'mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4',
);
$grid = isset( $cols[ (string) $args['columns'] ] ) ? $cols[ (string) $args['columns'] ] : $cols['3'];
if ( 'large' === $args['style'] || 'method' === $args['style'] ) {
	$grid = '3' === (string) $args['columns'] ? 'mt-12 grid gap-5 sm:grid-cols-3' : $grid;
}
?>
<section class="<?php echo esc_attr( 'mist' === $args['background'] ? 'bg-mist py-20' : 'py-20' ); ?>">
	<div class="<?php echo esc_attr( bioplus_container() ); ?>">
		<?php
		bioplus_section_heading(
			array(
				'eyebrow' => $args['eyebrow'],
				'title'   => $args['title'],
				'intro'   => $args['intro'],
				'align'   => $args['align'],
			)
		);
		?>
		<div class="<?php echo esc_attr( $grid ); ?>">
			<?php foreach ( (array) $args['cards'] as $c ) : ?>
				<?php if ( 'method' === $args['style'] ) : ?>
					<div class="rounded-[var(--radius-card)] border border-line bg-white p-7 text-center shadow-card">
						<span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600"><?php bioplus_the_icon( $c['icon'], 24 ); ?></span>
						<h3 class="font-display mt-5 text-2xl font-bold"><?php echo esc_html( $c['title'] ); ?></h3>
						<?php if ( ! empty( $c['subtitle'] ) ) : ?>
							<p class="mt-1 text-[12px] font-semibold uppercase tracking-wide text-brand-600"><?php echo esc_html( $c['subtitle'] ); ?></p>
						<?php endif; ?>
						<p class="mt-3 text-[13.5px] leading-relaxed text-ink-600"><?php echo esc_html( $c['text'] ); ?></p>
					</div>
				<?php elseif ( 'large' === $args['style'] ) : ?>
					<div class="rounded-[var(--radius-card)] border border-line bg-white p-7 shadow-card">
						<span class="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600"><?php bioplus_the_icon( $c['icon'], 22 ); ?></span>
						<h3 class="font-display mt-4 text-lg font-bold"><?php echo esc_html( $c['title'] ); ?></h3>
						<p class="mt-2 text-[14px] leading-relaxed text-ink-600"><?php echo esc_html( $c['text'] ); ?></p>
					</div>
				<?php else : ?>
					<div class="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-card">
						<span class="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><?php bioplus_the_icon( $c['icon'], 20 ); ?></span>
						<h3 class="font-display mt-4 text-base font-bold text-ink-900"><?php echo esc_html( $c['title'] ); ?></h3>
						<p class="mt-2 text-[13.5px] leading-relaxed text-ink-600"><?php echo esc_html( $c['text'] ); ?></p>
					</div>
				<?php endif; ?>
			<?php endforeach; ?>
		</div>
		<?php if ( $args['note'] ) : ?>
			<p class="mx-auto mt-10 max-w-3xl text-center text-[13px] leading-relaxed text-ink-500"><?php echo esc_html( $args['note'] ); ?></p>
		<?php endif; ?>
	</div>
</section>
