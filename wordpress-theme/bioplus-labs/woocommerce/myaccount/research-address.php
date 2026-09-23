<?php
/**
 * Research Hub → Research Address (billing = shipping).
 *
 * @package BioPlus
 * @version 1.0.0
 */

defined( 'ABSPATH' ) || exit;

$customer = new WC_Customer( get_current_user_id() );
$has      = (bool) $customer->get_billing_address_1();
$country  = $customer->get_billing_country() ? $customer->get_billing_country() : 'GB';
$names    = WC()->countries->get_countries();

wc_get_template(
	'myaccount/panel-header.php',
	array(
		'title'    => __( 'Research Address', 'bioplus' ),
		'subtitle' => __( 'Manage the delivery address used for your research orders.', 'bioplus' ),
	)
);
?>
<div class="mt-6 space-y-6">
	<?php if ( $has ) : ?>
		<div class="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
			<span class="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-brand-300"><?php bioplus_the_icon( 'map-pin', 15 ); ?> <?php esc_html_e( 'Current delivery address', 'bioplus' ); ?></span>
			<address class="mt-4 space-y-0.5 not-italic text-[14px] leading-relaxed text-white/75">
				<p class="font-semibold text-white"><?php echo esc_html( $customer->get_billing_first_name() . ' ' . $customer->get_billing_last_name() ); ?></p>
				<?php if ( $customer->get_billing_company() ) : ?><p><?php echo esc_html( $customer->get_billing_company() ); ?></p><?php endif; ?>
				<p><?php echo esc_html( $customer->get_billing_address_1() ); ?></p>
				<?php if ( $customer->get_billing_address_2() ) : ?><p><?php echo esc_html( $customer->get_billing_address_2() ); ?></p><?php endif; ?>
				<p><?php echo esc_html( $customer->get_billing_city() . ( $customer->get_billing_state() ? ', ' . $customer->get_billing_state() : '' ) . ' ' . $customer->get_billing_postcode() ); ?></p>
				<p><?php echo esc_html( isset( $names[ $country ] ) ? $names[ $country ] : $country ); ?></p>
				<p class="pt-2 text-white/50"><?php echo esc_html( $customer->get_email() ); ?></p>
			</address>
		</div>
	<?php endif; ?>

	<form method="post" class="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
		<h2 class="font-display mb-5 text-base font-bold text-white"><?php echo $has ? esc_html__( 'Update address', 'bioplus' ) : esc_html__( 'Add your research address', 'bioplus' ); ?></h2>
		<?php wp_nonce_field( 'bioplus_research_address', 'bioplus_address_nonce' ); ?>
		<div class="grid gap-4 sm:grid-cols-2">
			<?php bioplus_dark_field( array( 'label' => __( 'Institution / Lab (optional)', 'bioplus' ), 'name' => 'org', 'value' => $customer->get_billing_company(), 'placeholder' => __( 'University Research Lab', 'bioplus' ) ) ); ?>
			<div class="hidden sm:block"></div>
			<?php bioplus_dark_field( array( 'label' => __( 'First name', 'bioplus' ), 'name' => 'first_name', 'value' => $customer->get_billing_first_name() ? $customer->get_billing_first_name() : $customer->get_first_name(), 'required' => true ) ); ?>
			<?php bioplus_dark_field( array( 'label' => __( 'Last name', 'bioplus' ), 'name' => 'last_name', 'value' => $customer->get_billing_last_name() ? $customer->get_billing_last_name() : $customer->get_last_name(), 'required' => true ) ); ?>
			<?php bioplus_dark_field( array( 'label' => __( 'Address line 1', 'bioplus' ), 'name' => 'line1', 'value' => $customer->get_billing_address_1(), 'placeholder' => __( 'House number and street', 'bioplus' ), 'required' => true ) ); ?>
			<?php bioplus_dark_field( array( 'label' => __( 'Address line 2 (optional)', 'bioplus' ), 'name' => 'line2', 'value' => $customer->get_billing_address_2() ) ); ?>
			<?php bioplus_dark_field( array( 'label' => __( 'Town / City', 'bioplus' ), 'name' => 'city', 'value' => $customer->get_billing_city(), 'required' => true ) ); ?>
			<?php bioplus_dark_field( array( 'label' => __( 'County (optional)', 'bioplus' ), 'name' => 'county', 'value' => $customer->get_billing_state() ) ); ?>
			<?php bioplus_dark_field( array( 'label' => __( 'Postcode', 'bioplus' ), 'name' => 'postcode', 'value' => $customer->get_billing_postcode(), 'placeholder' => 'EH32 9BZ', 'required' => true ) ); ?>
			<div>
				<label for="country" class="mb-1.5 block text-[13px] font-semibold text-white/70"><?php esc_html_e( 'Country', 'bioplus' ); ?></label>
				<select id="country" name="country" class="h-11 w-full rounded-xl border border-white/12 bg-white/[0.04] px-3 text-sm text-white outline-none transition focus:border-brand-400">
					<option value="GB"<?php selected( $country, 'GB' ); ?>><?php esc_html_e( 'United Kingdom', 'bioplus' ); ?></option>
					<option value="IE"<?php selected( $country, 'IE' ); ?>><?php esc_html_e( 'Ireland', 'bioplus' ); ?></option>
				</select>
			</div>
		</div>
		<div class="mt-7"><button type="submit" class="brand-gradient h-11 rounded-full px-7 text-sm font-bold text-white transition enabled:hover:brightness-110 disabled:opacity-50"><?php esc_html_e( 'Save changes', 'bioplus' ); ?></button></div>
	</form>

	<div class="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-[13px] leading-relaxed text-white/55"><?php esc_html_e( 'Orders ship only to verified research addresses. For institutional accounts and laboratory supply agreements, contact support.', 'bioplus' ); ?></div>
</div>
