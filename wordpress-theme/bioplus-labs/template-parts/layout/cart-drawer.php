<?php
/**
 * Slide-in cart drawer (CartDrawer.tsx). The inner markup is a WooCommerce
 * cart fragment, so every add/update refreshes it without a page load.
 *
 * @package BioPlus
 */

?>
<div aria-hidden="true" class="fixed inset-0 z-[90] bg-ink-950/50 backdrop-blur-sm transition-opacity duration-300 pointer-events-none opacity-0" data-cart-backdrop></div>
<aside class="fixed right-0 top-0 z-[91] flex h-full w-full max-w-md flex-col bg-white shadow-pop transition-transform duration-300 translate-x-full" aria-label="<?php esc_attr_e( 'Shopping cart', 'bioplus' ); ?>" data-cart-drawer>
	<?php get_template_part( 'template-parts/layout/cart-drawer-inner' ); ?>
</aside>
