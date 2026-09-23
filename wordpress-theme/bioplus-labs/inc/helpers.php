<?php
/**
 * Template helpers: icons, options, buttons, headings, money, URLs.
 *
 * These are the PHP equivalents of the storefront's small React building
 * blocks (Button, SectionHeading, Eyebrow, PageHero, Logo, formatGBP) and keep
 * the exact class lists so the compiled stylesheet renders them identically.
 *
 * @package BioPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ------------------------------------------------------------------ assets */

/**
 * URL of a file inside the theme's assets directory.
 *
 * @param string $path Path relative to /assets.
 * @return string
 */
function bioplus_asset( $path ) {
	return BIOPLUS_URI . '/assets/' . ltrim( $path, '/' );
}

/**
 * Inline a Lucide icon from assets/icons.
 *
 * Mirrors lucide-react: `<svg class="lucide lucide-{name} {class}">` sized by
 * width/height, stroke-width 2 unless overridden.
 *
 * @param string $name  Kebab-case icon name (e.g. "flask-conical").
 * @param int    $size  Pixel size.
 * @param string $class Extra classes.
 * @param array  $opts  stroke (float), fill (string), label (string for role=img).
 * @return string SVG markup.
 */
function bioplus_icon( $name, $size = 24, $class = '', $opts = array() ) {
	static $cache = array();

	$name = sanitize_file_name( $name );
	if ( ! isset( $cache[ $name ] ) ) {
		$file           = BIOPLUS_DIR . '/assets/icons/' . $name . '.svg';
		$cache[ $name ] = '';
		if ( is_readable( $file ) ) {
			$svg = (string) file_get_contents( $file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- local theme file.
			if ( preg_match( '#<svg[^>]*>(.*)</svg>#s', $svg, $m ) ) {
				$cache[ $name ] = trim( preg_replace( '/\s+/', ' ', $m[1] ) );
			}
		}
	}
	if ( '' === $cache[ $name ] ) {
		return '';
	}

	$stroke = isset( $opts['stroke'] ) ? (float) $opts['stroke'] : 2;
	$fill   = isset( $opts['fill'] ) ? $opts['fill'] : 'none';
	$aria   = ! empty( $opts['label'] )
		? 'role="img" aria-label="' . esc_attr( $opts['label'] ) . '"'
		: 'aria-hidden="true"';

	return sprintf(
		'<svg xmlns="http://www.w3.org/2000/svg" width="%1$d" height="%1$d" viewBox="0 0 24 24" fill="%2$s" stroke="currentColor" stroke-width="%3$s" stroke-linecap="round" stroke-linejoin="round" class="%4$s" %5$s>%6$s</svg>',
		(int) $size,
		esc_attr( $fill ),
		esc_attr( (string) $stroke ),
		esc_attr( trim( 'lucide lucide-' . $name . ' ' . $class ) ),
		$aria,
		$cache[ $name ]
	);
}

/**
 * Echo an icon. Output is built from trusted theme files.
 *
 * @param string $name  Icon name.
 * @param int    $size  Size.
 * @param string $class Classes.
 * @param array  $opts  Options.
 */
function bioplus_the_icon( $name, $size = 24, $class = '', $opts = array() ) {
	echo bioplus_icon( $name, $size, $class, $opts ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in bioplus_icon().
}

/**
 * Icon names offered in Elementor / Customizer pickers.
 *
 * @return array<string,string>
 */
function bioplus_icon_choices() {
	$choices = array();
	foreach ( glob( BIOPLUS_DIR . '/assets/icons/*.svg' ) as $file ) {
		$slug             = basename( $file, '.svg' );
		$choices[ $slug ] = ucwords( str_replace( '-', ' ', $slug ) );
	}
	return $choices;
}

/* ----------------------------------------------------------------- options */

/**
 * Default values for every theme option. Customizer settings fall back here.
 *
 * @return array<string,mixed>
 */
function bioplus_option_defaults() {
	return array(
		'contact_email'      => BIOPLUS_DEFAULT_EMAIL,
		'hours_days'         => 'Monday – Friday',
		'hours_time'         => '9:00 – 18:00',
		'hours_note'         => 'Orders placed after 18:00 on a Friday are processed the following Monday.',
		'legal_name'         => 'BioPlus Labs',
		'location_town'      => 'Prestonpans',
		'location_county'    => 'East Lothian',
		'location_country'   => 'Scotland',
		'company_number'     => '',
		'facebook_url'       => '',
		'logo_dark'          => '',
		'logo_light'         => '',
		'announcement_1'     => 'Same-working-day UK dispatch on orders approved before 2pm',
		'announcement_2'     => 'HPLC / UPLC / MS batch-tested for purity & identity',
		'announcement_3'     => 'Research Use Only · Not for human or animal consumption',
		'announcement_4'     => 'Discreet, secure packaging · SSL-encrypted checkout',
		'header_cta_label'   => 'Shop Now',
		'footer_about'       => 'UK-supplied research peptides and laboratory compounds, batch-tested for identity and purity. Every order ships from the UK with traceable documentation and a batch-matched Certificate of Analysis.',
		'footer_ruo'         => 'All products sold by BioPlus Labs are intended strictly for in-vitro research, laboratory testing, and analytical purposes only. They are <strong class="text-white/80">not</strong> intended for human or animal consumption, medical use, therapeutic application, or diagnostic procedures of any kind. These statements have not been assessed by the MHRA or any other medicines regulator.',
		'newsletter_title'   => 'Get new batch alerts & research notes.',
		'newsletter_text'    => 'Restock alerts, new product releases, and research-handling notes. No spam — unsubscribe anytime.',
		'footer_credit'      => 'Eagle Studio',
		'age_gate_enabled'   => true,
		'age_gate_exit_url'  => 'https://www.google.com',
		'free_shipping_min'  => 250,
		'payment_window'     => 20,
		'payment_proof_required' => true,
	);
}

/**
 * Read a theme option (Customizer theme_mod with a sensible default).
 *
 * @param string $key Option key without prefix.
 * @return mixed
 */
function bioplus_opt( $key ) {
	$defaults = bioplus_option_defaults();
	$default  = isset( $defaults[ $key ] ) ? $defaults[ $key ] : '';
	$value    = get_theme_mod( 'bioplus_' . $key, $default );
	// A blank string is not an answer — fall back to the default instead.
	if ( is_string( $value ) && '' === trim( $value ) && is_string( $default ) && 'company_number' !== $key && 'facebook_url' !== $key && 'logo_dark' !== $key && 'logo_light' !== $key ) {
		return $default;
	}
	return $value;
}

/**
 * The store's contact email.
 *
 * @return string
 */
function bioplus_email() {
	$email = sanitize_email( (string) bioplus_opt( 'contact_email' ) );
	return $email ? $email : BIOPLUS_DEFAULT_EMAIL;
}

/**
 * "Monday – Friday, 9:00 – 18:00".
 *
 * @return string
 */
function bioplus_hours_label() {
	return bioplus_opt( 'hours_days' ) . ', ' . bioplus_opt( 'hours_time' );
}

/**
 * Site name used in copy.
 *
 * @return string
 */
function bioplus_site_name() {
	$name = get_bloginfo( 'name' );
	return $name ? $name : 'BioPlus Labs';
}

/* -------------------------------------------------------------------- urls */

/**
 * Resolve a storefront route to its WordPress URL.
 *
 * Routes mirror the original Next.js paths ("/shop", "/account/orders"…). Pages
 * created by the setup wizard are looked up by ID so a renamed slug still works.
 *
 * @param string $route Route key such as 'shop', 'cart', 'account/orders', 'about'.
 * @return string
 */
function bioplus_url( $route = '' ) {
	$route = trim( $route, '/' );

	if ( '' === $route || 'home' === $route ) {
		return home_url( '/' );
	}

	if ( function_exists( 'wc_get_page_permalink' ) ) {
		switch ( $route ) {
			case 'shop':
				return wc_get_page_permalink( 'shop' );
			case 'cart':
				return wc_get_cart_url();
			case 'checkout':
				return wc_get_checkout_url();
			case 'account':
				return wc_get_page_permalink( 'myaccount' );
			case 'account/orders':
				return wc_get_account_endpoint_url( 'orders' );
			case 'account/files':
				return wc_get_account_endpoint_url( 'coa-files' );
			case 'account/research-address':
				return wc_get_account_endpoint_url( 'research-address' );
			case 'account/settings':
				return wc_get_account_endpoint_url( 'edit-account' );
		}
	}

	$pages = get_option( 'bioplus_pages', array() );
	if ( is_array( $pages ) && ! empty( $pages[ $route ] ) && get_post_status( (int) $pages[ $route ] ) === 'publish' ) {
		return get_permalink( (int) $pages[ $route ] );
	}

	$page = get_page_by_path( $route );
	if ( $page ) {
		return get_permalink( $page );
	}

	return home_url( '/' . $route . '/' );
}

/**
 * Echo an escaped route URL.
 *
 * @param string $route Route key.
 */
function bioplus_the_url( $route ) {
	echo esc_url( bioplus_url( $route ) );
}

/**
 * Accept either a route key ("shop", "/about") or a full URL.
 *
 * @param string $href Href or route.
 * @return string
 */
function bioplus_href( $href ) {
	$href = (string) $href;
	if ( '' === $href ) {
		return '#';
	}
	if ( preg_match( '#^(https?:|mailto:|tel:|\#)#i', $href ) ) {
		return $href;
	}
	return bioplus_url( $href );
}

/**
 * Current request path, for nav active states.
 *
 * @return string
 */
function bioplus_current_path() {
	$uri  = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '/'; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
	$path = (string) wp_parse_url( $uri, PHP_URL_PATH );
	return '/' . trim( $path, '/' );
}

/**
 * Whether a URL is the current page (or an ancestor of it).
 *
 * @param string $url URL to test.
 * @return bool
 */
function bioplus_is_active_url( $url ) {
	$path = '/' . trim( (string) wp_parse_url( $url, PHP_URL_PATH ), '/' );
	$home = '/' . trim( (string) wp_parse_url( home_url( '/' ), PHP_URL_PATH ), '/' );
	$cur  = bioplus_current_path();
	if ( $path === $home ) {
		return $cur === $home;
	}
	return $cur === $path || 0 === strpos( $cur . '/', rtrim( $path, '/' ) . '/' );
}

/* -------------------------------------------------------------------- money */

/**
 * Whole amounts read as £25; anything else gets both decimal places.
 *
 * @param float $amount Amount in GBP.
 * @return string
 */
function bioplus_money( $amount ) {
	$amount = (float) $amount;
	$symbol = function_exists( 'get_woocommerce_currency_symbol' ) ? html_entity_decode( get_woocommerce_currency_symbol() ) : '£';
	$neg    = $amount < 0 ? '-' : '';
	$amount = abs( $amount );
	if ( abs( $amount - round( $amount ) ) < 0.005 ) {
		return $neg . $symbol . number_format( round( $amount ), 0, '.', ',' );
	}
	return $neg . $symbol . number_format( $amount, 2, '.', ',' );
}

/* ------------------------------------------------------------------- markup */

/**
 * Join class names, skipping empties (clsx).
 *
 * @param mixed ...$parts Strings or [class => bool] arrays.
 * @return string
 */
function bioplus_cn( ...$parts ) {
	$out = array();
	foreach ( $parts as $part ) {
		if ( is_array( $part ) ) {
			foreach ( $part as $k => $v ) {
				if ( is_int( $k ) ) {
					if ( $v ) {
						$out[] = $v;
					}
				} elseif ( $v ) {
					$out[] = $k;
				}
			}
		} elseif ( $part ) {
			$out[] = $part;
		}
	}
	return trim( implode( ' ', $out ) );
}

/**
 * Container classes (Container.tsx).
 *
 * @param string $size default|narrow|wide.
 * @param string $extra Extra classes.
 * @return string
 */
function bioplus_container( $size = 'default', $extra = '' ) {
	$map = array(
		'narrow'  => 'max-w-3xl',
		'default' => 'max-w-7xl',
		'wide'    => 'max-w-[88rem]',
	);
	$max = isset( $map[ $size ] ) ? $map[ $size ] : $map['default'];
	return bioplus_cn( 'mx-auto w-full px-5 sm:px-8', $max, $extra );
}

/**
 * Button classes (Button.tsx).
 *
 * @param string $variant primary|dark|outline|outlineDark|light|ghost.
 * @param string $size    sm|md|lg.
 * @param string $extra   Extra classes.
 * @return string
 */
function bioplus_button_class( $variant = 'primary', $size = 'md', $extra = '' ) {
	$base     = 'inline-flex items-center justify-center gap-2 font-semibold tracking-tight transition-all duration-200 rounded-full disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap';
	$variants = array(
		'primary'     => 'brand-gradient text-white shadow-[0_8px_24px_-8px_rgba(248,80,0,0.6)] hover:brightness-110 hover:-translate-y-0.5',
		'dark'        => 'bg-ink-900 text-white hover:bg-ink-800',
		'outline'     => 'border border-ink-900/15 text-ink-900 hover:border-brand-500 hover:text-brand-700 bg-white/60',
		'outlineDark' => 'border border-white/20 bg-white/5 text-white hover:border-brand-400 hover:bg-white/10',
		'light'       => 'bg-white text-ink-900 hover:bg-brand-50 border border-white/0',
		'ghost'       => 'text-ink-700 hover:text-brand-700 hover:bg-brand-50',
	);
	$sizes    = array(
		'sm' => 'h-9 px-4 text-sm',
		'md' => 'h-11 px-6 text-sm',
		'lg' => 'h-13 px-8 text-base py-3.5',
	);
	return bioplus_cn(
		$base,
		isset( $variants[ $variant ] ) ? $variants[ $variant ] : $variants['primary'],
		isset( $sizes[ $size ] ) ? $sizes[ $size ] : $sizes['md'],
		$extra
	);
}

/**
 * Render a ButtonLink.
 *
 * @param array $args label, href, variant, size, icon, icon_after, icon_size, class.
 */
function bioplus_button( $args ) {
	$args = wp_parse_args(
		$args,
		array(
			'label'      => '',
			'href'       => '#',
			'variant'    => 'primary',
			'size'       => 'md',
			'icon'       => '',
			'icon_after' => '',
			'icon_size'  => 16,
			'class'      => '',
		)
	);
	if ( '' === $args['label'] ) {
		return;
	}
	printf(
		'<a href="%1$s" class="%2$s">%3$s%4$s%5$s</a>',
		esc_url( bioplus_href( $args['href'] ) ),
		esc_attr( bioplus_button_class( $args['variant'], $args['size'], $args['class'] ) ),
		$args['icon'] ? bioplus_icon( $args['icon'], (int) $args['icon_size'] ) : '', // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		esc_html( $args['label'] ),
		$args['icon_after'] ? ' ' . bioplus_icon( $args['icon_after'], (int) $args['icon_size'] ) : '' // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	);
}

/**
 * Allowed inline markup inside headings/intros (for the gradient highlight).
 *
 * @return array
 */
function bioplus_inline_kses() {
	return array(
		'span'   => array( 'class' => true ),
		'strong' => array( 'class' => true ),
		'em'     => array( 'class' => true ),
		'br'     => array(),
		'a'      => array(
			'href'  => true,
			'class' => true,
		),
	);
}

/**
 * Turn `[[text]]` into the brand gradient highlight and sanitise the rest.
 *
 * Editors can write "Lab-grade vials, [[precision-filled]] and batch-tested."
 * and get the orange gradient span the original used.
 *
 * @param string $text  Raw text.
 * @param string $class Highlight class.
 * @return string Safe HTML.
 */
function bioplus_rich( $text, $class = 'brand-text-gradient' ) {
	$text = (string) $text;
	$text = preg_replace( '/\[\[(.+?)\]\]/s', '<span class="' . esc_attr( $class ) . '">$1</span>', $text );
	return wp_kses( $text, bioplus_inline_kses() );
}

/**
 * Eyebrow pill (SectionHeading.tsx → Eyebrow).
 *
 * @param string $text Text.
 * @param bool   $dark Dark variant.
 */
function bioplus_eyebrow( $text, $dark = false ) {
	if ( '' === (string) $text ) {
		return;
	}
	$wrap = $dark
		? 'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.18em] border-brand-400/30 bg-brand-500/10 text-brand-300'
		: 'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.18em] border-brand-600/25 bg-brand-50 text-brand-700';
	$dot  = $dark ? 'h-1.5 w-1.5 rounded-full bg-brand-400' : 'h-1.5 w-1.5 rounded-full bg-brand-600';
	printf( '<span class="%s"><span class="%s"></span>%s</span>', esc_attr( $wrap ), esc_attr( $dot ), esc_html( $text ) );
}

/**
 * Section heading (SectionHeading.tsx).
 *
 * @param array $args eyebrow, title (supports [[highlight]]), intro, align, dark, rule, class, tag.
 */
function bioplus_section_heading( $args ) {
	$args = wp_parse_args(
		$args,
		array(
			'eyebrow' => '',
			'title'   => '',
			'intro'   => '',
			'align'   => 'left',
			'dark'    => false,
			'rule'    => true,
			'class'   => '',
			'tag'     => 'h2',
		)
	);
	$center = 'center' === $args['align'];
	$tag    = in_array( $args['tag'], array( 'h1', 'h2', 'h3' ), true ) ? $args['tag'] : 'h2';
	?>
	<div class="<?php echo esc_attr( bioplus_cn( $center ? 'mx-auto max-w-2xl text-center' : '', $args['class'] ) ); ?>">
		<?php bioplus_eyebrow( $args['eyebrow'], (bool) $args['dark'] ); ?>
		<<?php echo esc_html( $tag ); ?> class="<?php echo esc_attr( bioplus_cn( 'font-display mt-4 text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl', $args['dark'] ? 'text-white' : 'text-ink-900' ) ); ?>"><?php echo bioplus_rich( $args['title'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></<?php echo esc_html( $tag ); ?>>
		<?php if ( $args['rule'] ) : ?>
			<span class="<?php echo esc_attr( bioplus_cn( 'brand-gradient mt-4 block h-[3px] w-12 rounded-full', $center ? 'mx-auto' : '' ) ); ?>"></span>
		<?php endif; ?>
		<?php if ( '' !== (string) $args['intro'] ) : ?>
			<p class="<?php echo esc_attr( bioplus_cn( 'mt-4 text-[15px] leading-relaxed', $args['dark'] ? 'text-white/60' : 'text-ink-600' ) ); ?>"><?php echo bioplus_rich( $args['intro'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></p>
		<?php endif; ?>
	</div>
	<?php
}

/**
 * Logo image (Logo.tsx).
 *
 * @param array $args variant black|white, height, href (null for none), class, icon_only.
 */
function bioplus_logo( $args = array() ) {
	$args = wp_parse_args(
		$args,
		array(
			'variant'   => 'black',
			'height'    => 34,
			'href'      => home_url( '/' ),
			'class'     => '',
			'icon_only' => false,
			'priority'  => false,
		)
	);

	$custom = '';
	if ( ! $args['icon_only'] ) {
		$custom = 'white' === $args['variant'] ? bioplus_opt( 'logo_light' ) : bioplus_opt( 'logo_dark' );
		if ( ! $custom && 'black' === $args['variant'] && has_custom_logo() ) {
			$custom = wp_get_attachment_image_url( (int) get_theme_mod( 'custom_logo' ), 'full' );
		}
	}

	$src   = $custom ? $custom : bioplus_asset( 'images/brand/bioplus-' . ( $args['icon_only'] ? 'icon' : 'logo' ) . '-' . ( 'white' === $args['variant'] ? 'white' : 'black' ) . '.png' );
	$ratio = $args['icon_only'] ? 130 / 120 : 529 / 145;
	$h     = (int) $args['height'];
	$w     = (int) round( $h * $ratio );
	$name  = bioplus_site_name();

	$img = sprintf(
		'<img src="%1$s" alt="%2$s" width="%3$d" height="%4$d" class="%5$s" style="height:%4$dpx"%6$s>',
		esc_url( $src ),
		esc_attr( $name ),
		$w,
		$h,
		esc_attr( bioplus_cn( 'w-auto', $args['class'] ) ),
		$args['priority'] ? ' fetchpriority="high"' : ' loading="lazy"'
	);

	if ( null === $args['href'] ) {
		echo $img; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above.
		return;
	}
	printf(
		'<a href="%1$s" aria-label="%2$s" class="inline-flex items-center">%3$s</a>',
		esc_url( $args['href'] ),
		/* translators: %s: site name. */
		esc_attr( sprintf( __( '%s — home', 'bioplus' ), $name ) ),
		$img // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	);
}

/**
 * Inner-page hero (PageHero.tsx).
 *
 * @param array $args eyebrow, title, intro, breadcrumb [ [label, href] ].
 */
function bioplus_page_hero( $args ) {
	get_template_part( 'template-parts/sections/page-hero', null, $args );
}

/**
 * Render a template part and return its HTML.
 *
 * @param string $slug Template part slug.
 * @param array  $args Arguments.
 * @return string
 */
function bioplus_capture_part( $slug, $args = array() ) {
	ob_start();
	get_template_part( $slug, null, $args );
	return (string) ob_get_clean();
}

/**
 * Split a textarea into non-empty lines.
 *
 * @param mixed $value String or array.
 * @return string[]
 */
function bioplus_lines( $value ) {
	if ( is_array( $value ) ) {
		return array_values( array_filter( array_map( 'trim', $value ) ) );
	}
	return array_values( array_filter( array_map( 'trim', preg_split( '/\r\n|\r|\n/', (string) $value ) ) ) );
}

/**
 * Is WooCommerce available?
 *
 * @return bool
 */
function bioplus_wc() {
	return class_exists( 'WooCommerce' );
}
