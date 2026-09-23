<?php
/**
 * Wholesale — numbered perk tiles on a hairline grid.
 *
 * @package BioPlus
 * @var array $args perks.
 */

?>
<section class="py-20">
	<div class="<?php echo esc_attr( bioplus_container() ); ?>">
		<div class="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
			<?php foreach ( array_values( (array) $args['perks'] ) as $i => $p ) : ?>
				<div class="group relative bg-white p-7 transition-colors hover:bg-mist">
					<div class="flex items-center justify-between">
						<span class="grid h-11 w-11 place-items-center rounded-lg bg-ink-900 text-brand-400 transition-colors group-hover:bg-brand-600 group-hover:text-white"><?php bioplus_the_icon( $p['icon'], 19 ); ?></span>
						<span class="font-display text-[13px] font-bold tracking-[0.16em] text-ink-500/40"><?php echo esc_html( '0' . ( $i + 1 ) ); ?></span>
					</div>
					<h3 class="font-display mt-6 text-base font-bold"><?php echo esc_html( $p['title'] ); ?></h3>
					<p class="mt-2 text-[13.5px] leading-relaxed text-ink-600"><?php echo esc_html( $p['text'] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
