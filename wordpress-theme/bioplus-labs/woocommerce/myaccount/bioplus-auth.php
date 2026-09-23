<?php
/**
 * Sign in / create account card (AuthForm.tsx), posting to WooCommerce's
 * own login and registration handlers.
 *
 * @package BioPlus
 * @version 1.0.0
 * @var string $mode login|register
 */

defined( 'ABSPATH' ) || exit;

$is_register = 'register' === $mode;
// phpcs:ignore WordPress.Security.NonceVerification.Recommended
$next = isset( $_GET['next'] ) ? esc_url_raw( wp_unslash( $_GET['next'] ) ) : '';
// phpcs:disable WordPress.Security.NonceVerification.Missing
$posted_email = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : ( isset( $_POST['username'] ) ? sanitize_text_field( wp_unslash( $_POST['username'] ) ) : '' );
$posted_name  = isset( $_POST['full_name'] ) ? sanitize_text_field( wp_unslash( $_POST['full_name'] ) ) : '';
$posted_org   = isset( $_POST['organisation'] ) ? sanitize_text_field( wp_unslash( $_POST['organisation'] ) ) : '';
// phpcs:enable
$registration = 'yes' === get_option( 'woocommerce_enable_myaccount_registration' );
?>
<div class="<?php echo esc_attr( bioplus_container( 'narrow', 'py-16' ) ); ?>">
	<div class="mx-auto max-w-md">
		<div class="text-center">
			<?php bioplus_eyebrow( __( 'Member Access · RUO Platform', 'bioplus' ) ); ?>
			<h1 class="font-display mt-5 text-4xl font-extrabold tracking-tight"><?php echo $is_register ? esc_html__( 'Create your account', 'bioplus' ) : esc_html__( 'Sign in', 'bioplus' ); ?></h1>
			<p class="mt-2.5 text-[14.5px] text-ink-600"><?php echo $is_register ? esc_html__( 'Track orders, download batch Certificates of Analysis, and manage your research delivery address.', 'bioplus' ) : esc_html__( 'Access your Research Hub, orders and Certificates of Analysis.', 'bioplus' ); ?></p>
		</div>

		<form method="post" action="<?php echo esc_url( $is_register ? bioplus_url( 'register' ) : bioplus_url( 'login' ) ); ?>" class="mt-8 rounded-2xl border border-line bg-white p-6 shadow-card">
			<?php bioplus_print_notices(); ?>
			<?php if ( $next ) : ?>
				<input type="hidden" name="next" value="<?php echo esc_attr( $next ); ?>">
				<input type="hidden" name="redirect" value="<?php echo esc_attr( $next ); ?>">
			<?php endif; ?>

			<?php if ( $is_register && ! $registration ) : ?>
				<p class="rounded-xl border border-line bg-mist p-4 text-[13px] text-ink-700"><?php esc_html_e( 'Account registration is currently closed. You can still check out as a guest.', 'bioplus' ); ?></p>
			<?php else : ?>
				<div class="space-y-4">
					<?php if ( $is_register ) : ?>
						<?php bioplus_light_field( array( 'label' => __( 'Full name', 'bioplus' ), 'name' => 'full_name', 'value' => $posted_name, 'required' => true, 'autocomplete' => 'name' ) ); ?>
						<?php bioplus_light_field( array( 'label' => __( 'Institution / Lab (optional)', 'bioplus' ), 'name' => 'organisation', 'value' => $posted_org, 'autocomplete' => 'organization', 'placeholder' => __( 'University Research Lab', 'bioplus' ) ) ); ?>
						<?php bioplus_light_field( array( 'label' => __( 'Email address', 'bioplus' ), 'name' => 'email', 'type' => 'email', 'value' => $posted_email, 'required' => true, 'autocomplete' => 'email', 'placeholder' => 'researcher@lab.ac.uk', 'id' => 'reg_email' ) ); ?>
						<?php bioplus_light_field( array( 'label' => __( 'Password', 'bioplus' ), 'name' => 'password', 'type' => 'password', 'required' => true, 'autocomplete' => 'new-password', 'hint' => __( 'At least 10 characters.', 'bioplus' ), 'id' => 'reg_password' ) ); ?>
					<?php else : ?>
						<?php bioplus_light_field( array( 'label' => __( 'Email address', 'bioplus' ), 'name' => 'username', 'type' => 'text', 'value' => $posted_email, 'required' => true, 'autocomplete' => 'username', 'placeholder' => 'researcher@lab.ac.uk' ) ); ?>
						<?php bioplus_light_field( array( 'label' => __( 'Password', 'bioplus' ), 'name' => 'password', 'type' => 'password', 'required' => true, 'autocomplete' => 'current-password' ) ); ?>
						<div class="flex items-center justify-between text-[12.5px]">
							<label class="inline-flex items-center gap-2 text-ink-600"><input type="checkbox" name="rememberme" value="forever" class="h-4 w-4 accent-brand-600"> <?php esc_html_e( 'Remember me', 'bioplus' ); ?></label>
							<a href="<?php echo esc_url( wp_lostpassword_url() ); ?>" class="font-semibold text-brand-700 hover:underline"><?php esc_html_e( 'Forgot password?', 'bioplus' ); ?></a>
						</div>
					<?php endif; ?>
				</div>

				<?php if ( $is_register ) : ?>
					<p class="mt-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-[12px] leading-relaxed text-amber-900">
						<?php bioplus_the_icon( 'flask-conical', 14, 'mt-0.5 shrink-0 text-amber-600' ); ?>
						<?php esc_html_e( 'Accounts are for researchers aged 18 or over. All products are supplied for laboratory research use only and not for human or animal consumption.', 'bioplus' ); ?>
					</p>
					<?php do_action( 'woocommerce_register_form' ); ?>
					<input type="hidden" name="bioplus_register" value="1">
					<?php wp_nonce_field( 'woocommerce-register', 'woocommerce-register-nonce' ); ?>
				<?php else : ?>
					<?php do_action( 'woocommerce_login_form' ); ?>
					<?php wp_nonce_field( 'woocommerce-login', 'woocommerce-login-nonce' ); ?>
				<?php endif; ?>

				<div class="mt-6">
					<button type="submit" name="<?php echo $is_register ? 'register' : 'login'; ?>" value="1" class="brand-gradient flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white transition enabled:hover:brightness-110 disabled:opacity-50">
						<?php bioplus_the_icon( 'lock', 16 ); ?> <?php echo $is_register ? esc_html__( 'Create account', 'bioplus' ) : esc_html__( 'Sign in', 'bioplus' ); ?>
					</button>
				</div>
			<?php endif; ?>

			<p class="mt-5 text-center text-[13px] text-ink-600">
				<?php if ( $is_register ) : ?>
					<?php esc_html_e( 'Already registered?', 'bioplus' ); ?> <a href="<?php bioplus_the_url( 'login' ); ?>" class="font-semibold text-brand-700 hover:underline"><?php esc_html_e( 'Sign in', 'bioplus' ); ?></a>
				<?php elseif ( $registration ) : ?>
					<?php esc_html_e( 'No account yet?', 'bioplus' ); ?> <a href="<?php bioplus_the_url( 'register' ); ?>" class="font-semibold text-brand-700 hover:underline"><?php esc_html_e( 'Create one', 'bioplus' ); ?></a>
				<?php endif; ?>
			</p>
		</form>

		<p class="mt-6 text-center text-[12px] text-ink-500"><?php esc_html_e( 'You can also check out as a guest — an account is never required to order.', 'bioplus' ); ?></p>
	</div>
</div>
