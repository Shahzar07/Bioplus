<?php
/**
 * Empty cart.
 *
 * @package BioPlus
 * @version 7.0.1
 */

defined( 'ABSPATH' ) || exit;
?>
<div class="<?php echo esc_attr( bioplus_container( 'default', 'py-12' ) ); ?>">
	<h1 class="font-display text-4xl font-extrabold tracking-tight"><?php esc_html_e( 'Your Cart', 'bioplus' ); ?></h1>
	<p class="mt-2 text-ink-600"><?php esc_html_e( '0 items · Research Use Only', 'bioplus' ); ?></p>
	<div class="mt-6"><?php bioplus_print_notices(); ?></div>
	<div class="mt-4 flex flex-col items-center justify-center gap-5 rounded-2xl border border-line bg-mist py-20 text-center">
		<div class="grid h-16 w-16 place-items-center rounded-full bg-white shadow-card"><?php bioplus_the_icon( 'shopping-bag', 26, 'text-ink-500' ); ?></div>
		<div>
			<p class="font-display text-lg font-bold"><?php esc_html_e( 'Your cart is empty', 'bioplus' ); ?></p>
			<p class="mt-1 text-sm text-ink-600"><?php esc_html_e( 'Browse the catalogue to add research compounds.', 'bioplus' ); ?></p>
		</div>
		<a href="<?php bioplus_the_url( 'shop' ); ?>" class="brand-gradient rounded-full px-6 py-3 text-sm font-bold text-white"><?php esc_html_e( 'Shop the catalogue', 'bioplus' ); ?></a>
	</div>
</div>
