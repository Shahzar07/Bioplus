<?php
/**
 * Trust bar on the brushed plate (TrustBar.tsx).
 *
 * @package BioPlus
 * @var array $args badges.
 */

$badges = array_values( (array) $args['badges'] );
?>
<section class="metal-plate border-b border-line">
	<div class="<?php echo esc_attr( bioplus_container() ); ?>">
		<div class="grid grid-cols-2 divide-x divide-y divide-line/70 sm:divide-y-0 lg:grid-cols-4">
			<?php foreach ( $badges as $i => $b ) : ?>
				<div class="<?php echo esc_attr( bioplus_cn( 'group relative flex items-start gap-3.5 px-5 py-7 first:pl-0 lg:last:pr-0', 0 === $i % 2 ? 'border-l-0 sm:border-l' : '', 0 === $i ? 'sm:border-l-0' : '' ) ); ?>">
					<span class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink-900 text-brand-400 transition-colors group-hover:bg-brand-600 group-hover:text-white">
						<?php bioplus_the_icon( $b['icon'], 19 ); ?>
					</span>
					<div>
						<h3 class="text-[13.5px] font-bold leading-tight text-ink-900"><?php echo esc_html( $b['title'] ); ?></h3>
						<p class="mt-1 text-[12px] leading-snug text-ink-600"><?php echo esc_html( $b['text'] ); ?></p>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
