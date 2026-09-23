<?php
/**
 * Research Hub → Account Settings.
 *
 * @package BioPlus
 * @version 9.7.0
 * @var WP_User $user
 */

defined( 'ABSPATH' ) || exit;

$customer = new WC_Customer( $user->ID );

wc_get_template(
	'myaccount/panel-header.php',
	array(
		'title'    => __( 'Account Settings', 'bioplus' ),
		'subtitle' => __( 'Update your account details and password.', 'bioplus' ),
	)
);
?>
<form class="woocommerce-EditAccountForm edit-account mt-6 space-y-6" action="" method="post" <?php do_action( 'woocommerce_edit_account_form_tag' ); ?>>
	<?php do_action( 'woocommerce_edit_account_form_start' ); ?>

	<div class="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
		<h2 class="font-display mb-5 text-base font-bold text-white"><?php esc_html_e( 'Account details', 'bioplus' ); ?></h2>
		<div class="grid gap-4 sm:grid-cols-2">
			<?php bioplus_dark_field( array( 'label' => __( 'First name', 'bioplus' ), 'name' => 'account_first_name', 'value' => $user->first_name, 'required' => true, 'autocomplete' => 'given-name' ) ); ?>
			<?php bioplus_dark_field( array( 'label' => __( 'Last name', 'bioplus' ), 'name' => 'account_last_name', 'value' => $user->last_name, 'required' => true, 'autocomplete' => 'family-name' ) ); ?>
			<?php bioplus_dark_field( array( 'label' => __( 'Email address', 'bioplus' ), 'name' => 'account_email', 'type' => 'email', 'value' => $user->user_email, 'required' => true, 'autocomplete' => 'email' ) ); ?>
			<?php bioplus_dark_field( array( 'label' => __( 'Phone (optional)', 'bioplus' ), 'name' => 'account_phone', 'type' => 'tel', 'value' => $customer->get_billing_phone(), 'autocomplete' => 'tel' ) ); ?>
			<?php bioplus_dark_field( array( 'label' => __( 'Institution / Lab (optional)', 'bioplus' ), 'name' => 'account_organisation', 'value' => $customer->get_billing_company() ) ); ?>
			<input type="hidden" name="account_display_name" value="<?php echo esc_attr( $user->display_name ); ?>">
		</div>
	</div>

	<div class="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
		<h2 class="font-display mb-5 text-base font-bold text-white"><?php esc_html_e( 'Password', 'bioplus' ); ?></h2>
		<p class="-mt-3 mb-5 text-[12.5px] text-white/45"><?php esc_html_e( 'Leave blank to keep your current password.', 'bioplus' ); ?></p>
		<div class="grid gap-4 sm:grid-cols-2">
			<?php bioplus_dark_field( array( 'label' => __( 'Current password', 'bioplus' ), 'name' => 'password_current', 'type' => 'password', 'placeholder' => '••••••••', 'autocomplete' => 'current-password' ) ); ?>
			<div class="hidden sm:block"></div>
			<?php bioplus_dark_field( array( 'label' => __( 'New password', 'bioplus' ), 'name' => 'password_1', 'type' => 'password', 'placeholder' => '••••••••', 'autocomplete' => 'new-password', 'hint' => __( 'At least 10 characters.', 'bioplus' ) ) ); ?>
			<?php bioplus_dark_field( array( 'label' => __( 'Confirm new password', 'bioplus' ), 'name' => 'password_2', 'type' => 'password', 'placeholder' => '••••••••', 'autocomplete' => 'new-password' ) ); ?>
		</div>
	</div>

	<?php do_action( 'woocommerce_edit_account_form' ); ?>

	<div>
		<?php wp_nonce_field( 'save_account_details', 'save-account-details-nonce' ); ?>
		<button type="submit" class="brand-gradient h-11 rounded-full px-7 text-sm font-bold text-white transition enabled:hover:brightness-110 disabled:opacity-50" name="save_account_details" value="<?php esc_attr_e( 'Save changes', 'bioplus' ); ?>"><?php esc_html_e( 'Save changes', 'bioplus' ); ?></button>
		<input type="hidden" name="action" value="save_account_details">
	</div>

	<?php do_action( 'woocommerce_edit_account_form_end' ); ?>
</form>
