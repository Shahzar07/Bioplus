<?php
/**
 * Reset link sent.
 *
 * @package BioPlus
 * @version 3.9.0
 */

defined( 'ABSPATH' ) || exit;
?>
<div class="<?php echo esc_attr( bioplus_container( 'narrow', 'py-20 text-center' ) ); ?>">
	<div class="brand-gradient mx-auto grid h-16 w-16 place-items-center rounded-full text-white"><?php bioplus_the_icon( 'mail', 28 ); ?></div>
	<h1 class="font-display mt-6 text-3xl font-extrabold tracking-tight"><?php esc_html_e( 'Check your inbox', 'bioplus' ); ?></h1>
	<p class="mx-auto mt-3 max-w-md text-ink-600"><?php echo esc_html( apply_filters( 'woocommerce_lost_password_confirmation_message', __( 'A password reset email has been sent to the email address on file for your account, but may take several minutes to show up in your inbox. Please wait at least 10 minutes before attempting another reset.', 'woocommerce' ) ) ); ?></p>
	<a href="<?php bioplus_the_url( 'login' ); ?>" class="mt-6 inline-block rounded-full border border-ink-900/15 px-6 py-3 text-sm font-semibold text-ink-800 hover:border-brand-500"><?php esc_html_e( 'Back to sign in', 'bioplus' ); ?></a>
</div>
