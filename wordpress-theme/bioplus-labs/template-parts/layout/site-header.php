<?php
/**
 * Sticky header with centred nav, search, account, cart and mobile drawer (Header.tsx).
 *
 * @package BioPlus
 */

$nav   = bioplus_menu_items( 'primary' );
$count = ( function_exists( 'WC' ) && WC()->cart ) ? WC()->cart->get_cart_contents_count() : 0;
?>
<header class="sticky top-0 z-50" data-site-header>
	<div class="metal-plate h-[3px] w-full"></div>
	<div class="relative border-b transition-all duration-300 border-line/60 bg-white" data-scroll-class="relative border-b transition-all duration-300 border-line bg-white/92 backdrop-blur-md" data-top-class="relative border-b transition-all duration-300 border-line/60 bg-white" data-header-bar>
		<div class="mx-auto flex h-[88px] max-w-7xl items-center gap-4 px-5 sm:px-8">
			<button type="button" class="-ml-1 rounded-full p-2 text-ink-800 hover:bg-haze lg:hidden" aria-label="<?php esc_attr_e( 'Open menu', 'bioplus' ); ?>" aria-controls="bioplus-mobile-nav" aria-expanded="false" data-mobile-open>
				<?php bioplus_the_icon( 'menu', 22 ); ?>
			</button>

			<?php
			bioplus_logo(
				array(
					'variant'  => 'black',
					'height'   => 46,
					'class'    => 'shrink-0',
					'priority' => true,
				)
			);
			?>

			<nav class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 lg:flex" aria-label="<?php esc_attr_e( 'Primary', 'bioplus' ); ?>">
				<?php foreach ( $nav as $item ) : ?>
					<a href="<?php echo esc_url( $item['url'] ); ?>" class="<?php echo esc_attr( $item['active'] ? 'relative py-1 text-[14px] font-semibold transition-colors text-ink-900' : 'relative py-1 text-[14px] font-semibold transition-colors text-ink-600 hover:text-ink-900' ); ?>"<?php echo $item['active'] ? ' aria-current="page"' : ''; ?><?php echo $item['target'] ? ' target="' . esc_attr( $item['target'] ) . '"' : ''; ?>>
						<?php echo esc_html( $item['label'] ); ?>
						<span class="<?php echo esc_attr( $item['active'] ? 'brand-gradient absolute -bottom-1.5 left-0 h-[2.5px] rounded-full transition-all duration-300 w-full opacity-100' : 'brand-gradient absolute -bottom-1.5 left-0 h-[2.5px] rounded-full transition-all duration-300 w-0 opacity-0' ); ?>"></span>
					</a>
				<?php endforeach; ?>
			</nav>

			<div class="ml-auto flex items-center gap-1">
				<button type="button" class="rounded-full p-2.5 text-ink-800 transition hover:bg-haze" aria-label="<?php esc_attr_e( 'Search', 'bioplus' ); ?>" data-search-open>
					<?php bioplus_the_icon( 'search', 20 ); ?>
				</button>
				<a href="<?php bioplus_the_url( 'account' ); ?>" class="rounded-full p-2.5 text-ink-800 transition hover:bg-haze" aria-label="<?php esc_attr_e( 'Account', 'bioplus' ); ?>">
					<?php bioplus_the_icon( 'user', 20 ); ?>
				</a>
				<button type="button" class="relative rounded-full p-2.5 text-ink-800 transition hover:bg-haze" aria-label="<?php esc_attr_e( 'Cart', 'bioplus' ); ?>" data-cart-open>
					<?php bioplus_the_icon( 'shopping-bag', 20 ); ?>
					<span class="<?php echo esc_attr( $count > 0 ? 'brand-gradient absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[10px] font-bold text-white' : 'hidden' ); ?>" data-cart-count><?php echo esc_html( $count ); ?></span>
				</button>
				<a href="<?php bioplus_the_url( 'shop' ); ?>" class="brand-gradient ml-2 hidden items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-bold text-white shadow-[0_8px_20px_-8px_rgba(248,80,0,0.75)] transition hover:brightness-110 sm:inline-flex">
					<?php bioplus_the_icon( 'flask-conical', 15 ); ?> <?php echo esc_html( bioplus_opt( 'header_cta_label' ) ); ?>
				</a>
			</div>
		</div>
	</div>

	<?php get_template_part( 'template-parts/layout/search-overlay' ); ?>

	<div class="fixed inset-0 z-[80] lg:hidden pointer-events-none" id="bioplus-mobile-nav" data-mobile-nav>
		<div class="absolute inset-0 bg-ink-950/50 backdrop-blur-sm transition-opacity opacity-0" data-mobile-backdrop></div>
		<div class="absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-pop transition-transform duration-300 -translate-x-full" data-mobile-panel role="dialog" aria-modal="true" aria-label="<?php esc_attr_e( 'Menu', 'bioplus' ); ?>">
			<div class="flex items-center justify-between border-b border-line px-5 py-4">
				<?php
				bioplus_logo(
					array(
						'variant' => 'black',
						'height'  => 34,
						'href'    => null,
					)
				);
				?>
				<button type="button" class="rounded-full p-2 hover:bg-haze" aria-label="<?php esc_attr_e( 'Close menu', 'bioplus' ); ?>" data-mobile-close><?php bioplus_the_icon( 'x', 22 ); ?></button>
			</div>
			<nav class="scroll-slim flex-1 overflow-y-auto px-3 py-4" aria-label="<?php esc_attr_e( 'Mobile', 'bioplus' ); ?>">
				<?php foreach ( $nav as $item ) : ?>
					<a href="<?php echo esc_url( $item['url'] ); ?>" class="flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-semibold text-ink-800 hover:bg-mist">
						<?php echo esc_html( $item['label'] ); ?>
						<?php bioplus_the_icon( 'chevron-right', 16, 'text-ink-500' ); ?>
					</a>
				<?php endforeach; ?>
			</nav>
			<div class="border-t border-line px-5 py-4 text-sm text-ink-600">
				<a href="<?php echo esc_url( 'mailto:' . bioplus_email() ); ?>" class="font-semibold text-ink-900"><?php echo esc_html( bioplus_email() ); ?></a>
				<div class="mt-1 text-xs"><?php echo esc_html( bioplus_hours_label() ); ?></div>
			</div>
		</div>
	</div>
</header>
