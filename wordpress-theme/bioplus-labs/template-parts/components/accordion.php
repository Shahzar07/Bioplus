<?php
/**
 * Accordion (Accordion.tsx) — first item open, one open at a time.
 *
 * @package BioPlus
 * @var array $args items [ ['q' =>, 'a' =>] ], class.
 */

$items = isset( $args['items'] ) ? array_values( (array) $args['items'] ) : array();
$uid   = wp_unique_id( 'acc-' );
?>
<div class="<?php echo esc_attr( bioplus_cn( 'divide-y divide-line rounded-2xl border border-line bg-white', isset( $args['class'] ) ? $args['class'] : '' ) ); ?>" data-accordion>
	<?php foreach ( $items as $i => $item ) : ?>
		<?php $open = 0 === $i; ?>
		<div data-accordion-item>
			<button type="button" class="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6" aria-expanded="<?php echo $open ? 'true' : 'false'; ?>" aria-controls="<?php echo esc_attr( $uid . '-' . $i ); ?>" data-accordion-trigger>
				<span class="font-display text-[15px] font-bold text-ink-900 sm:text-base"><?php echo esc_html( $item['q'] ); ?></span>
				<span class="<?php echo esc_attr( $open ? 'grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-300 brand-gradient rotate-45 border-transparent text-white' : 'grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-300 border-line text-ink-600' ); ?>" data-on="grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-300 brand-gradient rotate-45 border-transparent text-white" data-off="grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-300 border-line text-ink-600" data-accordion-icon>
					<?php bioplus_the_icon( 'plus', 16 ); ?>
				</span>
			</button>
			<div id="<?php echo esc_attr( $uid . '-' . $i ); ?>" class="<?php echo esc_attr( $open ? 'grid transition-all duration-300 ease-out grid-rows-[1fr] opacity-100' : 'grid transition-all duration-300 ease-out grid-rows-[0fr] opacity-0' ); ?>" data-on="grid transition-all duration-300 ease-out grid-rows-[1fr] opacity-100" data-off="grid transition-all duration-300 ease-out grid-rows-[0fr] opacity-0" data-accordion-panel>
				<div class="overflow-hidden">
					<p class="px-5 pb-6 text-[14px] leading-relaxed text-ink-600 sm:px-6"><?php echo esc_html( $item['a'] ); ?></p>
				</div>
			</div>
		</div>
	<?php endforeach; ?>
</div>
