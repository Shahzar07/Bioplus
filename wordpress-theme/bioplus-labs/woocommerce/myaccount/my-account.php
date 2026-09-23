<?php
/**
 * Research Hub shell (AccountShell.tsx): dark band, sidebar, content.
 *
 * @package BioPlus
 * @version 3.5.0
 */

defined( 'ABSPATH' ) || exit;
?>
<section class="band-dark relative min-h-[80vh] text-white">
	<div class="hairline-grid absolute inset-0 opacity-50"></div>
	<div class="<?php echo esc_attr( bioplus_container( 'default', 'relative py-10 lg:py-14' ) ); ?>">
		<div class="grid gap-6 lg:grid-cols-[290px_1fr]">
			<aside>
				<?php do_action( 'woocommerce_account_navigation' ); ?>
				<div class="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-[12.5px] text-white/55">
					<p class="font-semibold text-white/80"><?php esc_html_e( 'Need assistance?', 'bioplus' ); ?></p>
					<p class="mt-1 leading-relaxed"><?php esc_html_e( 'Our support team is here to help with orders, COA, and account questions.', 'bioplus' ); ?></p>
					<a href="<?php echo esc_url( 'mailto:' . bioplus_email() ); ?>" class="mt-2 inline-block font-semibold text-brand-300 hover:text-brand-200"><?php echo esc_html( bioplus_email() ); ?></a>
				</div>
			</aside>
			<div class="min-w-0">
				<?php bioplus_print_notices( true ); ?>
				<?php do_action( 'woocommerce_account_content' ); ?>
			</div>
		</div>
	</div>
</section>
