<?php
/**
 * Lost password.
 *
 * @package BioPlus
 * @version 9.2.0
 */

defined( 'ABSPATH' ) || exit;
?>
<div class="<?php echo esc_attr( bioplus_container( 'narrow', 'py-16' ) ); ?>">
	<div class="mx-auto max-w-md">
		<div class="text-center">
			<?php bioplus_eyebrow( __( 'Member Access · RUO Platform', 'bioplus' ) ); ?>
			<h1 class="font-display mt-5 text-4xl font-extrabold tracking-tight"><?php esc_html_e( 'Reset your password', 'bioplus' ); ?></h1>
			<p class="mt-2.5 text-[14.5px] text-ink-600"><?php esc_html_e( "Enter your email address and we'll send you a link to choose a new password.", 'bioplus' ); ?></p>
		</div>
		<form method="post" class="woocommerce-ResetPassword lost_reset_password mt-8 rounded-2xl border border-line bg-white p-6 shadow-card">
			<?php bioplus_print_notices(); ?>
			<?php bioplus_light_field( array( 'label' => __( 'Email address', 'bioplus' ), 'name' => 'user_login', 'required' => true, 'autocomplete' => 'username', 'placeholder' => 'researcher@lab.ac.uk' ) ); ?>
			<?php do_action( 'woocommerce_lostpassword_form' ); ?>
			<input type="hidden" name="wc_reset_password" value="true">
			<?php wp_nonce_field( 'lost_password', 'woocommerce-lost-password-nonce' ); ?>
			<button type="submit" value="1" class="brand-gradient mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white transition hover:brightness-110"><?php bioplus_the_icon( 'mail', 16 ); ?> <?php esc_html_e( 'Email me a reset link', 'bioplus' ); ?></button>
			<p class="mt-5 text-center text-[13px] text-ink-600"><a href="<?php bioplus_the_url( 'login' ); ?>" class="font-semibold text-brand-700 hover:underline"><?php esc_html_e( 'Back to sign in', 'bioplus' ); ?></a></p>
		</form>
	</div>
</div>
