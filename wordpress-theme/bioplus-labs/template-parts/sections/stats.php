<?php
/**
 * Stat tiles (About).
 *
 * @package BioPlus
 * @var array $args items.
 */

?>
<section class="pb-4">
	<div class="<?php echo esc_attr( bioplus_container() ); ?>">
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<?php foreach ( (array) $args['items'] as $s ) : ?>
				<div class="rounded-[var(--radius-card)] border border-line bg-mist p-7 text-center">
					<p class="font-display text-3xl font-extrabold tracking-tight text-ink-900"><?php echo esc_html( $s['value'] ); ?></p>
					<p class="mt-1.5 text-[13px] font-medium text-ink-600"><?php echo esc_html( $s['label'] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
