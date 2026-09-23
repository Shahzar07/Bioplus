<?php
/**
 * Home hero — DNA/particle video, gradient headline, proof strip, display case (Hero.tsx).
 *
 * @package BioPlus
 * @var array $args See bioplus_sections()['hero'].
 */

$video = $args['video'] ? $args['video'] : bioplus_asset( 'video/hero-bg.mp4' );
$image = bioplus_image_url( $args['image'], 'images/products/bioplus-range.webp' );
?>
<section class="relative overflow-hidden bg-ink-950 text-white">
	<video class="absolute inset-0 h-full w-full object-cover opacity-70" autoplay muted loop playsinline poster="<?php echo esc_url( $image ); ?>" aria-hidden="true">
		<source src="<?php echo esc_url( $video ); ?>" type="video/mp4">
	</video>

	<div class="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40"></div>
	<div class="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/70"></div>

	<div class="<?php echo esc_attr( bioplus_container( 'wide', 'relative' ) ); ?>">
		<div class="grid items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
			<div class="animate-fade-up">
				<?php if ( $args['badge'] ) : ?>
					<span class="inline-flex items-center gap-2 rounded-full border border-brand-400/35 bg-brand-500/10 px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-brand-300">
						<?php bioplus_the_icon( 'flask-conical', 13 ); ?> <?php echo esc_html( $args['badge'] ); ?>
					</span>
				<?php endif; ?>

				<h1 class="font-display mt-6 text-4xl font-extrabold leading-[1.03] tracking-tight sm:text-5xl lg:text-[3.65rem]">
					<?php echo esc_html( $args['title'] ); ?>
					<span class="block brand-text-gradient"><?php echo esc_html( $args['title_highlight'] ); ?></span>
				</h1>

				<span class="brand-gradient mt-7 block h-[3px] w-16 rounded-full"></span>

				<p class="mt-6 max-w-xl text-[15px] leading-relaxed text-white/70 sm:text-base"><?php echo esc_html( $args['text'] ); ?></p>

				<div class="mt-9 flex flex-wrap items-center gap-3">
					<?php
					bioplus_button(
						array(
							'label'      => $args['primary_label'],
							'href'       => $args['primary_url'],
							'size'       => 'lg',
							'icon_after' => 'arrow-right',
							'icon_size'  => 18,
						)
					);
					bioplus_button(
						array(
							'label'   => $args['secondary_label'],
							'href'    => $args['secondary_url'],
							'size'    => 'lg',
							'variant' => 'outlineDark',
						)
					);
					?>
				</div>

				<?php if ( ! empty( $args['proof'] ) ) : ?>
					<ul class="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-3.5 border-t border-white/10 pt-6 sm:grid-cols-4 sm:gap-x-4">
						<?php foreach ( (array) $args['proof'] as $p ) : ?>
							<li class="flex items-start gap-2 text-[12.5px] font-medium leading-snug text-white/75">
								<?php bioplus_the_icon( isset( $p['icon'] ) ? $p['icon'] : 'check', 15, 'mt-px shrink-0 text-brand-400' ); ?>
								<?php echo esc_html( isset( $p['label'] ) ? $p['label'] : '' ); ?>
							</li>
						<?php endforeach; ?>
					</ul>
				<?php endif; ?>
			</div>

			<div class="relative hidden lg:block">
				<div class="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/30 blur-[110px]"></div>
				<figure class="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-sm">
					<span class="brand-gradient absolute inset-x-0 top-0 z-10 h-[3px]"></span>
					<img src="<?php echo esc_url( $image ); ?>" alt="<?php esc_attr_e( 'The BioPlus Labs research vial range', 'bioplus' ); ?>" width="1600" height="893" fetchpriority="high" class="w-full rounded-xl">
					<figcaption class="absolute inset-x-2 bottom-2 flex items-center justify-between rounded-b-xl bg-gradient-to-t from-ink-950/85 to-transparent px-4 pb-3 pt-10 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
						<span><?php echo esc_html( $args['caption_left'] ); ?></span>
						<span class="text-brand-300"><?php echo esc_html( $args['caption_right'] ); ?></span>
					</figcaption>
				</figure>
			</div>
		</div>
	</div>
</section>
