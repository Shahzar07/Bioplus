<?php
/**
 * Policy cards — icon, title and paragraphs (Shipping & Delivery).
 *
 * @package BioPlus
 * @var array $args items.
 */

?>
<div class="<?php echo esc_attr( bioplus_container( 'narrow', 'py-14' ) ); ?>">
	<div class="space-y-6">
		<?php foreach ( (array) $args['items'] as $s ) : ?>
			<section class="rounded-2xl border border-line bg-white p-7 shadow-card">
				<div class="flex items-center gap-3">
					<span class="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><?php bioplus_the_icon( $s['icon'], 20 ); ?></span>
					<h2 class="font-display text-xl font-bold text-ink-900"><?php echo esc_html( $s['title'] ); ?></h2>
				</div>
				<div class="mt-4 space-y-3 text-[14.5px] leading-relaxed text-ink-600">
					<?php foreach ( preg_split( '/\n\s*\n/', trim( (string) $s['body'] ) ) as $para ) : ?>
						<p><?php echo esc_html( trim( $para ) ); ?></p>
					<?php endforeach; ?>
				</div>
			</section>
		<?php endforeach; ?>
	</div>
</div>
