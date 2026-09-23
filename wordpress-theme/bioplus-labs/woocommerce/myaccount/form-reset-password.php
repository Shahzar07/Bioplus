<?php
/**
 * Choose a new password.
 *
 * @package BioPlus
 * @version 9.2.0
 * @var array $args key, login.
 */

defined( 'ABSPATH' ) || exit;
?>
<div class="<?php echo esc_attr( bioplus_container( 'narrow', 'py-16' ) ); ?>">
	<div class="mx-auto max-w-md">
		<div class="text-center">
			<?php bioplus_eyebrow( __( 'Member Access · RUO Platform', 'bioplus' ) ); ?>
			<h1 class="font-display mt-5 text-4xl font-extrabold tracking-tight"><?php esc_html_e( 'Choose a new password', 'bioplus' ); ?></h1>
		</div>
		<form method="post" class="woocommerce-ResetPassword lost_reset_password mt-8 space-y-4 rounded-2xl border border-line bg-white p-6 shadow-card">
			<?php bioplus_print_notices(); ?>
			<?php bioplus_light_field( array( 'label' => __( 'New password', 'bioplus' ), 'name' => 'password_1', 'type' => 'password', 'required' => true, 'autocomplete' => 'new-password', 'hint' => __( 'At least 10 characters.', 'bioplus' ) ) ); ?>
			<?php bioplus_light_field( array( 'label' => __( 'Re-enter new password', 'bioplus' ), 'name' => 'password_2', 'type' => 'password', 'required' => true, 'autocomplete' => 'new-password' ) ); ?>
			<input type="hidden" name="reset_key" value="<?php echo esc_attr( $args['key'] ); ?>">
			<input type="hidden" name="reset_login" value="<?php echo esc_attr( $args['login'] ); ?>">
			<?php do_action( 'woocommerce_resetpassword_form' ); ?>
			<input type="hidden" name="wc_reset_password" value="true">
			<?php wp_nonce_field( 'reset_password', 'woocommerce-reset-password-nonce' ); ?>
			<button type="submit" value="1" class="brand-gradient mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white transition hover:brightness-110"><?php bioplus_the_icon( 'lock', 16 ); ?> <?php esc_html_e( 'Save password', 'bioplus' ); ?></button>
		</form>
	</div>
</div>
