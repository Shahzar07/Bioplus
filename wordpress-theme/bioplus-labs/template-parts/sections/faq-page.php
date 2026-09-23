<?php
/**
 * FAQ page — sticky dark help panel beside every question.
 *
 * @package BioPlus
 * @var array $args panel_title, panel_text, links, items.
 */

?>
<div class="<?php echo esc_attr( bioplus_container( 'default', 'py-14' ) ); ?>">
	<div class="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
		<aside class="lg:sticky lg:top-28 lg:self-start">
			<div class="band-dark relative overflow-hidden rounded-2xl p-7 text-white">
				<div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/25 blur-2xl"></div>
				<span class="relative grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-white"><?php bioplus_the_icon( 'life-buoy', 20 ); ?></span>
				<h2 class="font-display relative mt-5 text-2xl font-bold"><?php echo esc_html( $args['panel_title'] ); ?></h2>
				<p class="relative mt-2.5 text-[14px] leading-relaxed text-white/60"><?php echo esc_html( $args['panel_text'] ); ?></p>
				<div class="relative mt-6 flex flex-col gap-2.5">
					<?php
					bioplus_button(
						array(
							'label'   => __( 'Contact us', 'bioplus' ),
							'href'    => 'contact',
							'variant' => 'light',
						)
					);
					?>
					<a href="<?php echo esc_url( 'mailto:' . bioplus_email() ); ?>" class="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-[13px] font-semibold text-white transition hover:border-brand-400">
						<?php bioplus_the_icon( 'mail', 15 ); ?> <?php esc_html_e( 'Email us', 'bioplus' ); ?>
					</a>
				</div>
			</div>

			<?php if ( ! empty( $args['links'] ) ) : ?>
				<div class="mt-4 rounded-2xl border border-line bg-mist p-5">
					<p class="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-500"><?php esc_html_e( 'Also useful', 'bioplus' ); ?></p>
					<ul class="mt-3 space-y-2 text-[13.5px]">
						<?php foreach ( (array) $args['links'] as $l ) : ?>
							<li><a href="<?php echo esc_url( bioplus_href( $l['url'] ) ); ?>" class="font-medium text-ink-700 hover:text-brand-700"><?php echo esc_html( $l['label'] ); ?></a></li>
						<?php endforeach; ?>
					</ul>
				</div>
			<?php endif; ?>
		</aside>

		<?php get_template_part( 'template-parts/components/accordion', null, array( 'items' => $args['items'] ) ); ?>
	</div>
</div>
