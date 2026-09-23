<?php
/**
 * Footer — RUO band, brand + contact, four link columns, newsletter, bottom bar (Footer.tsx).
 *
 * @package BioPlus
 */

$cols    = array( 'footer_shop', 'footer_company', 'footer_account', 'footer_legal' );
$email   = bioplus_email();
$company = bioplus_opt( 'company_number' );
$legal   = bioplus_opt( 'legal_name' );
$credit  = bioplus_opt( 'footer_credit' );
?>
<footer class="band-dark relative text-white">
	<div class="hairline-grid absolute inset-0 opacity-60"></div>
	<div class="relative">
		<div class="border-b border-white/10">
			<div class="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 sm:flex-row sm:items-center sm:px-8">
				<div class="flex items-center gap-2 text-brand-300">
					<?php bioplus_the_icon( 'flask-conical', 18 ); ?>
					<span class="whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.2em]"><?php esc_html_e( 'Research Use Only', 'bioplus' ); ?></span>
				</div>
				<p class="text-[12.5px] leading-relaxed text-white/60"><?php echo wp_kses( bioplus_opt( 'footer_ruo' ), bioplus_inline_kses() ); ?></p>
			</div>
		</div>

		<div class="mx-auto max-w-7xl px-5 py-14 sm:px-8">
			<div class="grid gap-12 lg:grid-cols-[1.4fr_2.6fr]">
				<div>
					<?php
					bioplus_logo(
						array(
							'variant' => 'white',
							'height'  => 46,
						)
					);
					?>
					<p class="mt-5 max-w-sm text-sm leading-relaxed text-white/60"><?php echo esc_html( bioplus_opt( 'footer_about' ) ); ?></p>
					<ul class="mt-6 space-y-2.5 text-sm text-white/70">
						<li class="flex items-center gap-2.5">
							<?php bioplus_the_icon( 'mail', 15, 'shrink-0 text-brand-400' ); ?>
							<a href="<?php echo esc_url( 'mailto:' . $email ); ?>" class="hover:text-white"><?php echo esc_html( $email ); ?></a>
						</li>
						<li class="flex items-start gap-2.5">
							<?php bioplus_the_icon( 'clock', 15, 'mt-0.5 shrink-0 text-brand-400' ); ?>
							<span>
								<?php echo esc_html( bioplus_hours_label() ); ?>
								<span class="mt-0.5 block text-[12.5px] text-white/45"><?php echo esc_html( bioplus_opt( 'hours_note' ) ); ?></span>
							</span>
						</li>
						<li class="flex items-start gap-2.5">
							<?php bioplus_the_icon( 'map-pin', 15, 'mt-0.5 shrink-0 text-brand-400' ); ?>
							<span>
								<?php echo esc_html( bioplus_opt( 'location_country' ) . ', ' . bioplus_opt( 'location_county' ) . ', ' . bioplus_opt( 'location_town' ) ); ?>
								<?php if ( $company ) : ?>
									<span class="mt-0.5 block text-[12.5px] text-white/45"><?php echo esc_html( sprintf( /* translators: %s: company number. */ __( 'Company no. %s', 'bioplus' ), $company ) ); ?></span>
								<?php endif; ?>
							</span>
						</li>
					</ul>
				</div>

				<div class="grid grid-cols-2 gap-8 sm:grid-cols-4">
					<?php foreach ( $cols as $loc ) : ?>
						<div>
							<h4 class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">
								<span class="h-1 w-1 rounded-full bg-brand-500"></span>
								<?php echo esc_html( bioplus_menu_title( $loc ) ); ?>
							</h4>
							<ul class="mt-4 space-y-2.5 border-l border-white/10 pl-4">
								<?php foreach ( bioplus_menu_items( $loc ) as $l ) : ?>
									<li><a href="<?php echo esc_url( $l['url'] ); ?>" class="text-[13.5px] text-white/70 transition hover:text-brand-300"><?php echo esc_html( $l['label'] ); ?></a></li>
								<?php endforeach; ?>
							</ul>
						</div>
					<?php endforeach; ?>
				</div>
			</div>

			<div class="mt-14 grid gap-6 rounded-2xl border border-white/10 bg-white/[0.04] p-7 sm:p-9 lg:grid-cols-[1.3fr_1fr] lg:items-center">
				<div>
					<h3 class="font-display text-xl font-bold"><?php echo esc_html( bioplus_opt( 'newsletter_title' ) ); ?></h3>
					<p class="mt-2 max-w-lg text-[13.5px] leading-relaxed text-white/60"><?php echo esc_html( bioplus_opt( 'newsletter_text' ) ); ?></p>
				</div>
				<div>
					<form class="flex flex-col gap-2.5 sm:flex-row" data-bioplus-form="newsletter" novalidate>
						<input type="hidden" name="form_type" value="newsletter">
						<input type="hidden" name="page_url" value="<?php echo esc_url( home_url( bioplus_current_path() ) ); ?>">
						<div class="hidden" aria-hidden="true"><label>Website<input type="text" name="bp_website" tabindex="-1" autocomplete="off"></label></div>
						<label for="footer-email" class="sr-only"><?php esc_html_e( 'Email address', 'bioplus' ); ?></label>
						<input id="footer-email" type="email" name="email" required placeholder="you@lab.co.uk" class="h-12 w-full rounded-full border border-white/15 bg-ink-950/60 px-5 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-brand-500">
						<button type="submit" class="brand-gradient h-12 shrink-0 rounded-full px-7 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"><span data-submit-label><?php esc_html_e( 'Subscribe', 'bioplus' ); ?></span></button>
					</form>
					<p class="mt-2 hidden text-[12.5px] font-medium text-emerald-300" data-form-success><?php esc_html_e( "You're subscribed — thanks. Watch your inbox for batch alerts.", 'bioplus' ); ?></p>
					<p class="mt-2 hidden text-[12.5px] font-medium text-red-300" data-form-error><span data-form-error-text></span></p>
				</div>
			</div>
		</div>

		<div class="border-t border-white/10">
			<div class="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-[12px] text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-8">
				<p>
					&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php echo esc_html( $legal ); ?>. <?php esc_html_e( 'All rights reserved.', 'bioplus' ); ?>
					<?php if ( $company ) : ?>
						&middot; <?php echo esc_html( sprintf( /* translators: %s: company number. */ __( 'Registered in Scotland no. %s', 'bioplus' ), $company ) ); ?>
					<?php endif; ?>
				</p>
				<div class="flex flex-wrap items-center gap-x-5 gap-y-2">
					<?php foreach ( bioplus_menu_items( 'footer_bottom' ) as $l ) : ?>
						<a href="<?php echo esc_url( $l['url'] ); ?>" class="hover:text-white"><?php echo esc_html( $l['label'] ); ?></a>
					<?php endforeach; ?>
					<span class="text-white/30"><?php esc_html_e( 'Must be 18+ to purchase', 'bioplus' ); ?></span>
				</div>
			</div>
		</div>

		<?php if ( $credit ) : ?>
			<div class="border-t border-white/10 bg-ink-950/60">
				<div class="mx-auto max-w-7xl px-5 py-4 text-center text-[11.5px] text-white/35 sm:px-8">
					<?php esc_html_e( 'Powered by', 'bioplus' ); ?> <span class="font-semibold text-white/60"><?php echo esc_html( $credit ); ?></span>
				</div>
			</div>
		<?php endif; ?>
	</div>
</footer>
