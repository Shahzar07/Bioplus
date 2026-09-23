<?php
/**
 * Affiliate band — rounded dark CTA.
 *
 * @package BioPlus
 * @var array $args See registry.
 */

?>
<section class="py-6">
	<div class="<?php echo esc_attr( bioplus_container() ); ?>">
		<div class="band-dark relative overflow-hidden rounded-3xl px-8 py-12 text-white sm:px-14 sm:py-16">
			<div class="hairline-grid absolute inset-0 opacity-60"></div>
			<div class="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-500/25 blur-3xl"></div>
			<div class="relative grid items-center gap-8 lg:grid-cols-[1.6fr_1fr]">
				<div>
					<?php if ( $args['badge'] ) : ?>
						<span class="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-300">
							<?php bioplus_the_icon( 'shield-check', 13 ); ?> <?php echo esc_html( $args['badge'] ); ?>
						</span>
					<?php endif; ?>
					<h2 class="font-display mt-4 text-3xl font-bold leading-tight sm:text-4xl"><?php echo bioplus_rich( $args['title'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></h2>
					<p class="mt-4 max-w-xl text-[15px] leading-relaxed text-white/65"><?php echo esc_html( $args['text'] ); ?></p>
				</div>
				<div class="flex flex-col gap-3 lg:items-end">
					<?php
					bioplus_button(
						array(
							'label'      => $args['button_label'],
							'href'       => $args['button_url'],
							'size'       => 'lg',
							'variant'    => 'light',
							'icon_after' => 'arrow-right',
							'icon_size'  => 18,
						)
					);
					bioplus_button(
						array(
							'label'   => $args['button2_label'],
							'href'    => $args['button2_url'],
							'size'    => 'lg',
							'variant' => 'outlineDark',
						)
					);
					?>
				</div>
			</div>
		</div>
	</div>
</section>
