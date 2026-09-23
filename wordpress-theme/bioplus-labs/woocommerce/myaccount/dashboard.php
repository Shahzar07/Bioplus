<?php
/**
 * Research Hub dashboard.
 *
 * @package BioPlus
 * @version 4.4.0
 */

defined( 'ABSPATH' ) || exit;

$user      = wp_get_current_user();
$name      = $user->display_name ? $user->display_name : $user->user_email;
$customer  = get_current_user_id();
$all       = wc_get_orders( array( 'customer_id' => $customer, 'limit' => -1, 'return' => 'ids' ) );
$transit   = wc_get_orders( array( 'customer_id' => $customer, 'limit' => -1, 'return' => 'ids', 'status' => array( 'wc-processing' ) ) );
$coa_count = count( bioplus_customer_coa_files( $customer ) );

$stats = array(
	array( __( 'Total orders', 'bioplus' ), count( $all ), 'package', wc_get_account_endpoint_url( 'orders' ) ),
	array( __( 'In transit', 'bioplus' ), count( $transit ), 'truck', wc_get_account_endpoint_url( 'orders' ) ),
	array( __( 'COA files', 'bioplus' ), $coa_count, 'file-text', wc_get_account_endpoint_url( 'coa-files' ) ),
);
$quick = array(
	array( __( 'Recent orders', 'bioplus' ), __( 'Review order status, tracking, and history.', 'bioplus' ), 'package', wc_get_account_endpoint_url( 'orders' ) ),
	array( __( 'Certificates of Analysis', 'bioplus' ), __( 'Download batch-specific COA documents.', 'bioplus' ), 'file-text', wc_get_account_endpoint_url( 'coa-files' ) ),
	array( __( 'Research address', 'bioplus' ), __( 'Manage your shipping & billing details.', 'bioplus' ), 'map-pin', wc_get_account_endpoint_url( 'research-address' ) ),
);
?>
<div class="space-y-6">
	<div class="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
		<p class="text-[14px] text-white/60">
			<?php
			printf(
				/* translators: 1: name, 2: name, 3: logout link. */
				esc_html__( 'Hello %1$s (not %2$s? %3$s)', 'bioplus' ),
				'<strong class="text-white">' . esc_html( $name ) . '</strong>',
				esc_html( $name ),
				'<a href="' . esc_url( wc_logout_url() ) . '" class="text-brand-300 underline-offset-2 hover:text-brand-200 hover:underline">' . esc_html__( 'Log out', 'bioplus' ) . '</a>'
			);
			?>
		</p>
		<p class="mt-3 max-w-2xl text-[14px] leading-relaxed text-white/55">
			<?php
			printf(
				/* translators: 1: orders link, 2: address link, 3: account link. */
				esc_html__( 'From your account dashboard you can view your %1$s, manage your %2$s, and %3$s.', 'bioplus' ),
				'<a href="' . esc_url( wc_get_account_endpoint_url( 'orders' ) ) . '" class="text-brand-300 hover:text-brand-200">' . esc_html__( 'recent orders', 'bioplus' ) . '</a>',
				'<a href="' . esc_url( wc_get_account_endpoint_url( 'research-address' ) ) . '" class="text-brand-300 hover:text-brand-200">' . esc_html__( 'shipping and billing addresses', 'bioplus' ) . '</a>',
				'<a href="' . esc_url( wc_get_account_endpoint_url( 'edit-account' ) ) . '" class="text-brand-300 hover:text-brand-200">' . esc_html__( 'edit your password and account details', 'bioplus' ) . '</a>'
			);
			?>
		</p>
	</div>

	<div class="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8 sm:p-10">
		<div class="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl"></div>
		<div class="relative">
			<span class="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-300"><?php esc_html_e( 'Member Access · RUO Platform', 'bioplus' ); ?></span>
			<h1 class="font-display mt-3 text-4xl font-extrabold leading-[0.98] tracking-tight sm:text-5xl">
				<span class="block text-white"><?php esc_html_e( 'WELCOME BACK,', 'bioplus' ); ?></span>
				<span class="brand-text-gradient block uppercase"><?php echo esc_html( $name ); ?></span>
			</h1>
			<p class="mt-4 max-w-xl text-[14px] leading-relaxed text-white/55"><?php esc_html_e( 'Your BioPlus Labs account hub is built for order visibility, research-supply access, and account management — all in one secure dashboard.', 'bioplus' ); ?></p>
		</div>
	</div>

	<div class="grid gap-4 sm:grid-cols-3">
		<?php foreach ( $stats as $s ) : ?>
			<a href="<?php echo esc_url( $s[3] ); ?>" class="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-brand-500/40 hover:bg-white/[0.06]">
				<div>
					<p class="text-[12px] text-white/50"><?php echo esc_html( $s[0] ); ?></p>
					<p class="font-display mt-1 text-3xl font-bold text-white"><?php echo esc_html( $s[1] ); ?></p>
				</div>
				<span class="grid h-11 w-11 place-items-center rounded-xl bg-brand-500/15 text-brand-300"><?php bioplus_the_icon( $s[2], 20 ); ?></span>
			</a>
		<?php endforeach; ?>
	</div>

	<div class="grid gap-4 sm:grid-cols-3">
		<?php foreach ( $quick as $q ) : ?>
			<a href="<?php echo esc_url( $q[3] ); ?>" class="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-brand-500/40 hover:bg-white/[0.06]">
				<div class="flex items-center justify-between">
					<span class="grid h-10 w-10 place-items-center rounded-lg bg-brand-500/15 text-brand-300"><?php bioplus_the_icon( $q[2], 18 ); ?></span>
					<?php bioplus_the_icon( 'arrow-up-right', 17, 'text-white/30 transition group-hover:text-brand-300' ); ?>
				</div>
				<h3 class="font-display mt-4 text-base font-bold text-white"><?php echo esc_html( $q[0] ); ?></h3>
				<p class="mt-1.5 text-[12.5px] leading-relaxed text-white/55"><?php echo esc_html( $q[1] ); ?></p>
			</a>
		<?php endforeach; ?>
	</div>
</div>
