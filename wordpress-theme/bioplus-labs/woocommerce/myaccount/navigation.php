<?php
/**
 * Research Hub sidebar navigation.
 *
 * @package BioPlus
 * @version 9.3.0
 */

defined( 'ABSPATH' ) || exit;

$nav     = bioplus_account_nav();
$current = WC()->query->get_current_endpoint();
$current = $current ? $current : 'dashboard';
if ( 'view-order' === $current ) {
	$current = 'orders';
}
?>
<nav class="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur" aria-label="<?php esc_attr_e( 'Account pages', 'bioplus' ); ?>">
	<?php foreach ( wc_get_account_menu_items() as $endpoint => $label ) : ?>
		<?php
		if ( 'customer-logout' === $endpoint ) {
			continue;
		}
		$active = $current === $endpoint;
		$icon   = isset( $nav[ $endpoint ] ) ? $nav[ $endpoint ][1] : 'chevron-right';
		?>
		<a href="<?php echo esc_url( wc_get_account_endpoint_url( $endpoint ) ); ?>" class="<?php echo esc_attr( $active ? 'group relative flex items-center gap-3 border-b border-white/10 px-5 py-4 text-[14px] font-semibold transition-all bg-white/[0.07] text-white' : 'group relative flex items-center gap-3 border-b border-white/10 px-5 py-4 text-[14px] font-semibold transition-all text-white/60 hover:bg-white/[0.04] hover:text-white' ); ?>"<?php echo $active ? ' aria-current="page"' : ''; ?>>
			<span class="<?php echo esc_attr( $active ? 'brand-gradient absolute inset-y-0 left-0 w-[3px] transition-opacity opacity-100' : 'brand-gradient absolute inset-y-0 left-0 w-[3px] transition-opacity opacity-0' ); ?>"></span>
			<?php bioplus_the_icon( $icon, 18, $active ? 'text-brand-400' : 'text-white/40' ); ?>
			<?php echo esc_html( $label ); ?>
		</a>
	<?php endforeach; ?>
	<a href="<?php echo esc_url( wc_logout_url() ); ?>" class="flex w-full items-center gap-3 px-5 py-4 text-left text-[14px] font-semibold text-white/60 transition-all hover:bg-white/[0.04] hover:text-white">
		<?php bioplus_the_icon( 'log-out', 18, 'text-white/40' ); ?>
		<?php esc_html_e( 'Log out', 'bioplus' ); ?>
	</a>
</nav>
