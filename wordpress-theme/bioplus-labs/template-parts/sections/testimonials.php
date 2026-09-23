<?php
/**
 * Testimonials — sticky heading and stacked quote slabs (Testimonials.tsx).
 *
 * @package BioPlus
 * @var array $args See registry.
 */

?>
<section class="py-20">
	<div class="<?php echo esc_attr( bioplus_container() ); ?>">
		<div class="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start lg:gap-16">
			<div class="lg:sticky lg:top-28">
				<?php
				bioplus_section_heading(
					array(
						'eyebrow' => $args['eyebrow'],
						'title'   => $args['title'],
						'intro'   => $args['intro'],
					)
				);
				?>
				<?php if ( $args['note'] ) : ?>
					<p class="mt-6 text-[12px] leading-relaxed text-ink-500"><?php echo esc_html( $args['note'] ); ?></p>
				<?php endif; ?>
			</div>

			<div class="space-y-4">
				<?php foreach ( (array) $args['items'] as $t ) : ?>
					<figure class="relative overflow-hidden rounded-xl border border-line bg-mist p-7 pl-8 transition-colors hover:bg-white hover:shadow-card">
						<span class="brand-gradient absolute inset-y-0 left-0 w-[3px]"></span>
						<?php bioplus_the_icon( 'quote', 30, 'absolute right-6 top-6 text-brand-200', array( 'fill' => 'currentColor' ) ); ?>
						<div class="flex gap-0.5 text-brand-500">
							<?php for ( $s = 0; $s < 5; $s++ ) : ?>
								<?php bioplus_the_icon( 'star', 15, 'fill-current' ); ?>
							<?php endfor; ?>
						</div>
						<blockquote class="mt-3.5 max-w-2xl text-[15px] leading-relaxed text-ink-700">&ldquo;<?php echo esc_html( $t['quote'] ); ?>&rdquo;</blockquote>
						<figcaption class="mt-5 flex items-center gap-3">
							<span class="grid h-9 w-9 place-items-center rounded-lg bg-ink-900 text-[12px] font-bold text-white"><?php echo esc_html( $t['initials'] ); ?></span>
							<span class="flex flex-wrap items-baseline gap-x-2">
								<span class="text-[13.5px] font-bold text-ink-900"><?php echo esc_html( $t['name'] ); ?></span>
								<span class="text-[12px] text-ink-500">· <?php echo esc_html( $t['role'] ); ?></span>
							</span>
						</figcaption>
					</figure>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
</section>
