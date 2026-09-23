<?php
/**
 * Error notices in the theme's banner style.
 *
 * @package BioPlus
 * @version 8.6.0
 * @var array $notices
 */

defined( 'ABSPATH' ) || exit;

if ( ! $notices ) {
	return;
}
$dark = function_exists( 'is_account_page' ) && is_account_page() && is_user_logged_in();
?>
<div class="woocommerce-error-group" role="alert">
	<?php foreach ( $notices as $notice ) : ?>
		<?php bioplus_notice( 'error', isset( $notice['notice'] ) ? $notice['notice'] : $notice, $dark ); ?>
	<?php endforeach; ?>
</div>
