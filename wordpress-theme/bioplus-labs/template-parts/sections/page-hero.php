<?php
/**
 * Inner-page hero — a brushed silver plate with a heavy orange rule against the
 * title, echoing the metal lockup the logo sits on (PageHero.tsx).
 *
 * @package BioPlus
 * @var array $args eyebrow, title, intro, crumb, crumb_parent, crumb_url.
 */

$args = wp_parse_args(
	$args,
	array(
		'eyebrow'      => '',
		'title'        => get_the_title(),
		'intro'        => '',
		'crumb'        => '',
		'crumb_parent' => '',
		'crumb_url'    => '',
	)
);
?>
<section class="metal-plate relative overflow-hidden border-b border-line">
	<img src="<?php echo esc_url( bioplus_asset( 'images/brand/bioplus-icon-black.png' ) ); ?>" alt="" aria-hidden="true" width="130" height="120" class="pointer-events-none absolute -right-6 top-1/2 hidden h-[190%] w-auto -translate-y-1/2 opacity-[0.07] sm:block">
	<div class="absolute inset-x-0 top-0 h-px bg-white/70"></div>

	<div class="<?php echo esc_attr( bioplus_container( 'default', 'relative py-12 sm:py-16' ) ); ?>">
		<?php if ( $args['crumb'] ) : ?>
			<nav class="flex items-center gap-1.5 text-[12px] text-ink-500" aria-label="<?php esc_attr_e( 'Breadcrumb', 'bioplus' ); ?>">
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="hover:text-brand-700"><?php esc_html_e( 'Home', 'bioplus' ); ?></a>
				<?php if ( $args['crumb_parent'] ) : ?>
					<span class="flex items-center gap-1.5">
						<?php bioplus_the_icon( 'chevron-right', 13 ); ?>
						<a href="<?php echo esc_url( bioplus_href( $args['crumb_url'] ) ); ?>" class="hover:text-brand-700"><?php echo esc_html( $args['crumb_parent'] ); ?></a>
					</span>
				<?php endif; ?>
				<span class="flex items-center gap-1.5">
					<?php bioplus_the_icon( 'chevron-right', 13 ); ?>
					<span class="font-semibold text-brand-700"><?php echo esc_html( $args['crumb'] ); ?></span>
				</span>
			</nav>
		<?php endif; ?>

		<div class="mt-6 flex gap-5 sm:gap-7">
			<span class="brand-gradient mt-1.5 w-1.5 shrink-0 rounded-full" aria-hidden="true"></span>
			<div>
				<?php bioplus_eyebrow( $args['eyebrow'] ); ?>
				<h1 class="font-display mt-3.5 max-w-4xl text-4xl font-extrabold leading-[1.04] tracking-tight text-ink-900 sm:text-5xl"><?php echo bioplus_rich( $args['title'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></h1>
				<?php if ( $args['intro'] ) : ?>
					<p class="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-600"><?php echo bioplus_rich( $args['intro'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></p>
				<?php endif; ?>
			</div>
		</div>
	</div>
</section>
