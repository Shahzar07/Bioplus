<?php
/**
 * Product page — gallery, buy box, tabs and related products (ProductDetail.tsx).
 *
 * @package BioPlus
 * @version 9.9.0
 */

defined( 'ABSPATH' ) || exit;

get_header();

while ( have_posts() ) :
	the_post();
	$wc_product = wc_get_product( get_the_ID() );
	$p          = $wc_product ? bioplus_product_view( $wc_product ) : null;
	if ( ! $p || ! $p['variants'] ) {
		echo '<div class="' . esc_attr( bioplus_container( 'default', 'py-20' ) ) . '"><p>' . esc_html__( 'This product has no options available yet.', 'bioplus' ) . '</p></div>';
		continue;
	}
	$sci      = $p['science'];
	$is_water = 'bacteriostatic-water' === $p['slug'];
	$first    = $p['variants'][0];
	$labels   = bioplus_availability_labels();
	$purity   = $sci['purity'] ? $sci['purity'] : __( 'Research Grade', 'bioplus' );
	$site     = bioplus_site_name();
	$range    = bioplus_asset( 'images/products/bioplus-range.webp' );
	$gallery  = $wc_product->get_gallery_image_ids();
	if ( $gallery ) {
		$range_img = wp_get_attachment_image_url( $gallery[0], 'large' );
		$range     = $range_img ? $range_img : $range;
	}
	$variants_json = array();
	foreach ( $p['variants'] as $v ) {
		$variants_json[] = array(
			'id'           => $v['id'],
			'sku'          => $v['sku'],
			'label'        => $v['label'],
			'strength'     => $v['strength'],
			'price'        => $v['price'],
			'priceLabel'   => bioplus_money( $v['price'] ),
			'availability' => $v['availability'],
			'max'          => $v['max'],
		);
	}
	$mailto_base = 'mailto:' . bioplus_email() . '?subject=';
	?>
	<div class="py-10" data-product-detail data-variants="<?php echo esc_attr( wp_json_encode( $variants_json ) ); ?>" data-mailto="<?php echo esc_attr( $mailto_base ); ?>" data-product-name="<?php echo esc_attr( $p['name'] ); ?>">
		<div class="mx-auto max-w-7xl px-5 sm:px-8">
			<nav class="flex flex-wrap items-center gap-1.5 text-[12px] text-ink-500" aria-label="<?php esc_attr_e( 'Breadcrumb', 'bioplus' ); ?>">
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="hover:text-brand-700"><?php esc_html_e( 'Home', 'bioplus' ); ?></a>
				<?php bioplus_the_icon( 'chevron-right', 13 ); ?>
				<a href="<?php bioplus_the_url( 'shop' ); ?>" class="hover:text-brand-700"><?php esc_html_e( 'Shop', 'bioplus' ); ?></a>
				<?php bioplus_the_icon( 'chevron-right', 13 ); ?>
				<span class="text-ink-800"><?php echo esc_html( $p['name'] ); ?></span>
			</nav>

			<?php bioplus_print_notices(); ?>

			<div class="mt-6 grid gap-10 lg:grid-cols-2">
				<div class="lg:sticky lg:top-28 lg:self-start">
					<div class="flex gap-3">
						<div class="flex shrink-0 flex-col gap-3">
							<?php
							$thumb_on  = 'flex h-[72px] w-[72px] items-center justify-center rounded-lg border bg-mist transition border-brand-500 ring-1 ring-brand-500';
							$thumb_off = 'flex h-[72px] w-[72px] items-center justify-center rounded-lg border bg-mist transition border-line hover:border-brand-300';
							?>
							<button type="button" aria-label="<?php esc_attr_e( 'View vial', 'bioplus' ); ?>" class="<?php echo esc_attr( $thumb_on ); ?>" data-on="<?php echo esc_attr( $thumb_on ); ?>" data-off="<?php echo esc_attr( $thumb_off ); ?>" data-view="vial">
								<img src="<?php echo esc_url( $p['image'] ); ?>" alt="" width="880" height="1200" class="object-contain h-14 w-auto">
							</button>
							<button type="button" aria-label="<?php esc_attr_e( 'View range', 'bioplus' ); ?>" class="<?php echo esc_attr( $thumb_off ); ?>" data-on="<?php echo esc_attr( $thumb_on ); ?>" data-off="<?php echo esc_attr( $thumb_off ); ?>" data-view="range">
								<img src="<?php echo esc_url( $range ); ?>" alt="<?php esc_attr_e( 'BioPlus range', 'bioplus' ); ?>" width="160" height="89" class="object-contain">
							</button>
						</div>

						<div class="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-line bg-mist">
							<span class="brand-gradient absolute inset-x-0 top-0 h-[3px]"></span>
							<div class="absolute left-4 top-5 flex gap-2">
								<?php if ( $p['best_seller'] ) : ?>
									<span class="rounded-md bg-ink-900 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white"><?php esc_html_e( 'Best Seller', 'bioplus' ); ?></span>
								<?php endif; ?>
								<?php if ( $p['is_new'] ) : ?>
									<span class="brand-gradient rounded-md px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white"><?php esc_html_e( 'New', 'bioplus' ); ?></span>
								<?php endif; ?>
							</div>
							<span class="absolute right-4 top-5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700"><?php echo esc_html( $purity . ' ' . __( 'Purity', 'bioplus' ) ); ?></span>
							<img src="<?php echo esc_url( $p['image'] ); ?>" alt="<?php echo esc_attr( $p['name'] . ' — ' . __( 'BioPlus Labs research vial', 'bioplus' ) ); ?>" width="880" height="1200" fetchpriority="high" class="object-contain h-[420px] w-auto py-8" data-stage="vial">
							<img src="<?php echo esc_url( $range ); ?>" alt="<?php esc_attr_e( 'BioPlus Labs research vial range', 'bioplus' ); ?>" width="1600" height="893" loading="lazy" class="hidden w-[92%] object-contain py-8" data-stage="range">
						</div>
					</div>

					<div class="mt-3 grid grid-cols-3 divide-x divide-line rounded-xl border border-line bg-white text-center text-[11px] font-medium text-ink-600">
						<?php
						$assure = array(
							array( 'flask-conical', $is_water ? __( 'Sterile', 'bioplus' ) : __( 'Lyophilised', 'bioplus' ) ),
							array( 'shield-check', __( 'Batch-Tested', 'bioplus' ) ),
							array( 'truck', __( 'UK Dispatch', 'bioplus' ) ),
						);
						foreach ( $assure as $a ) :
							?>
							<div class="flex flex-col items-center gap-1.5 py-3.5"><?php bioplus_the_icon( $a[0], 18, 'text-brand-600' ); ?><?php echo esc_html( $a[1] ); ?></div>
						<?php endforeach; ?>
					</div>
				</div>

				<div>
					<h1 class="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl"><?php echo esc_html( $p['name'] ); ?></h1>
					<?php if ( $p['tagline'] ) : ?>
						<p class="mt-2 text-[15px] text-ink-600"><?php echo esc_html( $p['tagline'] ); ?></p>
					<?php endif; ?>

					<div class="mt-5 flex items-baseline gap-3">
						<span class="font-display text-4xl font-bold text-ink-900" data-price><?php echo esc_html( bioplus_money( $first['price'] ) ); ?></span>
						<span class="text-sm text-ink-500"><?php esc_html_e( 'per vial', 'bioplus' ); ?> · <span data-variant-label><?php echo esc_html( $first['label'] ); ?></span></span>
					</div>

					<?php if ( $p['blurb'] ) : ?>
						<p class="mt-5 text-[14.5px] leading-relaxed text-ink-700"><?php echo esc_html( $p['blurb'] ); ?></p>
					<?php endif; ?>

					<div class="mt-7">
						<div class="flex items-center justify-between">
							<span class="text-[13px] font-bold uppercase tracking-wide text-ink-800"><?php esc_html_e( 'Select option', 'bioplus' ); ?></span>
							<span class="text-[12px] text-ink-500">SKU <span data-sku><?php echo esc_html( $first['sku'] ); ?></span></span>
						</div>
						<div class="mt-3 grid gap-2.5 sm:grid-cols-2" role="radiogroup" aria-label="<?php esc_attr_e( 'Select option', 'bioplus' ); ?>">
							<?php
							$opt_on  = 'flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all border-brand-500 bg-brand-50 ring-1 ring-brand-500';
							$opt_off = 'flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all border-line bg-white hover:border-brand-300';
							foreach ( $p['variants'] as $i => $v ) :
								$tone = 'in-stock' === $v['availability'] ? 'block text-[11px] font-medium text-emerald-600' : ( 'arriving-soon' === $v['availability'] ? 'block text-[11px] font-medium text-brand-600' : 'block text-[11px] font-medium text-ink-500' );
								?>
								<button type="button" role="radio" aria-checked="<?php echo 0 === $i ? 'true' : 'false'; ?>" class="<?php echo esc_attr( 0 === $i ? $opt_on : $opt_off ); ?>" data-on="<?php echo esc_attr( $opt_on ); ?>" data-off="<?php echo esc_attr( $opt_off ); ?>" data-variant-index="<?php echo esc_attr( $i ); ?>">
									<span>
										<span class="block text-[13px] font-semibold text-ink-900"><?php echo esc_html( $v['label'] ); ?></span>
										<span class="<?php echo esc_attr( $tone ); ?>"><?php echo esc_html( $labels[ $v['availability'] ] ); ?></span>
									</span>
									<span class="font-display text-base font-bold text-ink-900"><?php echo esc_html( bioplus_money( $v['price'] ) ); ?></span>
								</button>
							<?php endforeach; ?>
						</div>
					</div>

					<div class="<?php echo esc_attr( 'in-stock' === $first['availability'] ? 'mt-6 flex flex-col gap-3 sm:flex-row sm:items-center' : 'mt-6 hidden flex-col gap-3 sm:flex-row sm:items-center' ); ?>" data-buy-row>
						<div class="inline-flex h-13 items-center rounded-full border border-line px-1">
							<button type="button" class="grid h-10 w-10 place-items-center rounded-full text-ink-700 hover:bg-haze" aria-label="<?php esc_attr_e( 'Decrease', 'bioplus' ); ?>" data-qty-step="-1"><?php bioplus_the_icon( 'minus', 16 ); ?></button>
							<span class="w-10 text-center font-display text-lg font-bold" data-qty>1</span>
							<button type="button" class="grid h-10 w-10 place-items-center rounded-full text-ink-700 hover:bg-haze" aria-label="<?php esc_attr_e( 'Increase', 'bioplus' ); ?>" data-qty-step="1"><?php bioplus_the_icon( 'plus', 16 ); ?></button>
						</div>
						<button type="button" class="brand-gradient inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-bold text-white transition hover:brightness-110" data-add-selected>
							<span class="inline-flex items-center gap-2" data-add-idle><?php bioplus_the_icon( 'shopping-bag', 19 ); ?> <?php esc_html_e( 'Add to cart', 'bioplus' ); ?> — <span data-add-total><?php echo esc_html( bioplus_money( $first['price'] ) ); ?></span></span>
							<span class="hidden items-center gap-2" data-add-done><?php bioplus_the_icon( 'check', 20 ); ?> <?php esc_html_e( 'Added to cart', 'bioplus' ); ?></span>
						</button>
					</div>
					<p class="mt-2 hidden text-[12.5px] font-medium text-red-700" role="alert" data-add-error></p>

					<div class="<?php echo esc_attr( 'in-stock' === $first['availability'] ? 'mt-6 hidden rounded-xl border border-line bg-mist p-5' : 'mt-6 rounded-xl border border-line bg-mist p-5' ); ?>" data-stock-box>
						<p class="font-display text-[15px] font-bold text-ink-900" data-stock-title><?php echo 'arriving-soon' === $first['availability'] ? esc_html__( 'Arriving soon', 'bioplus' ) : esc_html__( 'Currently out of stock', 'bioplus' ); ?></p>
						<p class="mt-1.5 text-[13.5px] leading-relaxed text-ink-600" data-stock-text data-soon="<?php esc_attr_e( "This option is on its way into stock. Email us and we'll let you know the moment it lands.", 'bioplus' ); ?>" data-out="<?php esc_attr_e( "This option has sold out. Email us and we'll let you know as soon as it is restocked.", 'bioplus' ); ?>" data-soon-title="<?php esc_attr_e( 'Arriving soon', 'bioplus' ); ?>" data-out-title="<?php esc_attr_e( 'Currently out of stock', 'bioplus' ); ?>">
							<?php echo 'arriving-soon' === $first['availability'] ? esc_html__( "This option is on its way into stock. Email us and we'll let you know the moment it lands.", 'bioplus' ) : esc_html__( "This option has sold out. Email us and we'll let you know as soon as it is restocked.", 'bioplus' ); ?>
						</p>
						<a href="<?php echo esc_url( $mailto_base . rawurlencode( 'Stock enquiry — ' . $p['name'] . ' ' . $first['label'] ) ); ?>" class="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-full border border-ink-900/15 px-6 text-sm font-bold text-ink-800 transition hover:border-brand-500 hover:text-brand-700" data-notify>
							<?php bioplus_the_icon( 'mail', 16 ); ?> <?php esc_html_e( 'Notify me by email', 'bioplus' ); ?>
						</a>
					</div>

					<div class="mt-5 flex flex-wrap gap-2">
						<a href="<?php bioplus_the_url( 'dosage-calculator' ); ?>" class="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-[13px] font-semibold text-ink-700 hover:border-brand-400 hover:text-brand-700"><?php bioplus_the_icon( 'calculator', 15 ); ?> <?php esc_html_e( 'Dosage calculator', 'bioplus' ); ?></a>
						<a href="<?php bioplus_the_url( 'certificates-of-analysis' ); ?>" class="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-[13px] font-semibold text-ink-700 hover:border-brand-400 hover:text-brand-700"><?php bioplus_the_icon( 'shield-check', 15 ); ?> <?php esc_html_e( 'View COA', 'bioplus' ); ?></a>
					</div>

					<div class="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
						<?php bioplus_the_icon( 'flask-conical', 18, 'mt-0.5 shrink-0 text-amber-600' ); ?>
						<p class="text-[12.5px] leading-relaxed text-amber-900"><strong><?php esc_html_e( 'Research Use Only.', 'bioplus' ); ?></strong> <?php esc_html_e( 'Intended solely for laboratory and scientific research. Not for human or animal consumption and not intended to diagnose, treat, cure, or prevent any disease. No dosage or administration guidance is provided.', 'bioplus' ); ?></p>
					</div>
				</div>
			</div>

			<?php
			$tabs    = array(
				'description' => __( 'Full Description', 'bioplus' ),
				'research'    => __( 'Research', 'bioplus' ),
				'usage'       => __( 'Usage', 'bioplus' ),
				'reviews'     => __( 'Reviews', 'bioplus' ),
			);
			$tab_on  = 'relative flex items-center gap-1.5 whitespace-nowrap px-4 py-3 text-[14px] font-semibold transition-colors text-brand-700';
			$tab_off = 'relative flex items-center gap-1.5 whitespace-nowrap px-4 py-3 text-[14px] font-semibold transition-colors text-ink-600 hover:text-ink-900';
			$details = array(
				array( __( 'Name', 'bioplus' ), $sci['full_name'] ? $p['name'] . ' (' . $sci['full_name'] . ')' : $p['name'], '' ),
				array( __( 'Quantity', 'bioplus' ), $first['strength'], 'strength' ),
				array( __( 'Catalogue Number', 'bioplus' ), $first['sku'], 'sku' ),
			);
			if ( $sci['formula'] ) {
				$details[] = array( __( 'Molecular Formula', 'bioplus' ), $sci['formula'], '' );
			}
			if ( $sci['mw'] ) {
				$details[] = array( __( 'Molecular Weight', 'bioplus' ), $sci['mw'], '' );
			}
			if ( $sci['cas'] ) {
				$details[] = array( __( 'CAS Number', 'bioplus' ), $sci['cas'], '' );
			}
			$details[] = array( __( 'Form', 'bioplus' ), $p['form'], '' );
			?>
			<div class="mt-14" data-tabs>
				<div class="scroll-slim flex gap-1 overflow-x-auto border-b border-line sm:justify-center" role="tablist">
					<?php foreach ( array_keys( $tabs ) as $i => $key ) : ?>
						<button type="button" role="tab" id="tab-<?php echo esc_attr( $key ); ?>" aria-controls="panel-<?php echo esc_attr( $key ); ?>" aria-selected="<?php echo 0 === $i ? 'true' : 'false'; ?>" class="<?php echo esc_attr( 0 === $i ? $tab_on : $tab_off ); ?>" data-on="<?php echo esc_attr( $tab_on ); ?>" data-off="<?php echo esc_attr( $tab_off ); ?>" data-tab="<?php echo esc_attr( $key ); ?>">
							<?php bioplus_the_icon( 'chevron-right', 14, 0 === $i ? 'rotate-90' : 'text-ink-400', array() ); ?>
							<?php echo esc_html( $tabs[ $key ] ); ?>
							<span class="<?php echo esc_attr( 0 === $i ? 'brand-gradient absolute inset-x-2 bottom-0 h-0.5 rounded-full' : 'hidden' ); ?>" data-tab-bar></span>
						</button>
					<?php endforeach; ?>
				</div>

				<div class="py-8">
					<div id="panel-description" role="tabpanel" aria-labelledby="tab-description" class="mx-auto max-w-4xl" data-panel="description">
						<h2 class="font-display text-2xl font-bold uppercase leading-tight tracking-tight text-ink-900 sm:text-[28px]"><?php echo esc_html( sprintf( /* translators: %s: product name. */ __( 'High-Purity %s', 'bioplus' ), $p['name'] ) ); ?> – <span data-strength><?php echo esc_html( $first['strength'] ); ?></span></h2>
						<?php if ( $p['blurb'] ) : ?>
							<p class="mt-5 text-[15px] leading-relaxed text-ink-700"><?php echo esc_html( $p['blurb'] ); ?></p>
						<?php endif; ?>
						<p class="mt-4 text-[15px] leading-relaxed text-ink-700"><?php esc_html_e( 'With a verified peptide purity of', 'bioplus' ); ?> <strong><?php echo esc_html( $sci['purity'] ? $sci['purity'] : __( 'research grade', 'bioplus' ) ); ?></strong>, <?php echo esc_html( sprintf( /* translators: %s: product form. */ __( 'this %s provides consistent quality for reliable laboratory experimentation.', 'bioplus' ), strtolower( $p['form'] ) ) ); ?></p>

						<ul class="mt-6 space-y-2.5">
							<?php
							$badges = array(
								$purity . ' ' . __( 'Purity – Research Grade', 'bioplus' ),
								$p['tagline'],
								$is_water ? __( 'USP-Grade Sterile Reconstitution Solution', 'bioplus' ) : __( 'Precision-Tested Lyophilised Peptide', 'bioplus' ),
							);
							foreach ( array_filter( $badges ) as $badge ) :
								?>
								<li class="flex items-start gap-2.5 text-[14px] text-ink-700">
									<span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-emerald-100 text-emerald-700"><?php bioplus_the_icon( 'check', 13, '', array( 'stroke' => 3 ) ); ?></span>
									<?php echo esc_html( $badge ); ?>
								</li>
							<?php endforeach; ?>
						</ul>

						<h3 class="font-display mt-8 flex items-center gap-2 text-lg font-bold text-brand-700"><?php bioplus_the_icon( 'beaker', 18 ); ?> <?php esc_html_e( 'Product Details', 'bioplus' ); ?></h3>
						<div class="mt-3 max-w-2xl overflow-hidden rounded-xl border border-line">
							<?php foreach ( $details as $i => $d ) : ?>
								<div class="<?php echo esc_attr( bioplus_cn( 'flex justify-between gap-4 px-4 py-2.5 text-[14px]', count( $details ) - 1 !== $i ? 'border-b border-line' : '' ) ); ?>">
									<span class="text-ink-500"><?php echo esc_html( $d[0] ); ?></span>
									<span class="text-right font-semibold text-ink-900"<?php echo $d[2] ? ' data-detail-' . esc_attr( $d[2] ) : ''; ?>><?php echo esc_html( $d[1] ); ?></span>
								</div>
							<?php endforeach; ?>
						</div>
						<?php if ( $sci['blend_note'] ) : ?>
							<p class="mt-3 text-[13px] text-ink-500"><?php echo esc_html( $sci['blend_note'] ); ?></p>
						<?php endif; ?>

						<h3 class="font-display mt-8 flex items-center gap-2 text-lg font-bold text-brand-700"><?php bioplus_the_icon( 'snowflake', 18 ); ?> <?php esc_html_e( 'Storage', 'bioplus' ); ?></h3>
						<p class="mt-3 max-w-3xl text-[14.5px] leading-relaxed text-ink-700"><?php echo esc_html( sprintf( /* translators: %s: product name. */ __( 'As supplied, %s is stored in a sealed vial protected from light at', 'bioplus' ), $p['name'] ) ); ?> <strong>2 °C to 8 °C</strong>. <?php esc_html_e( 'Storage conditions are printed on the vial label.', 'bioplus' ); ?></p>

						<?php if ( '' !== trim( (string) get_the_content() ) ) : ?>
							<div class="bioplus-prose mt-6 max-w-3xl"><?php the_content(); ?></div>
						<?php endif; ?>

						<p class="mt-6 max-w-3xl text-[13.5px] leading-relaxed text-ink-600"><strong class="text-ink-900"><?php esc_html_e( 'Note:', 'bioplus' ); ?></strong> <?php esc_html_e( 'This product is supplied strictly for', 'bioplus' ); ?> <strong class="text-ink-900"><?php esc_html_e( 'laboratory research use only', 'bioplus' ); ?></strong>. <?php echo esc_html( sprintf( /* translators: %s: site name. */ __( 'Not for human consumption or clinical application. %s provides no handling, preparation, or administration instructions — qualified researchers are responsible for determining their own protocols.', 'bioplus' ), $site ) ); ?></p>
					</div>

					<div id="panel-research" role="tabpanel" aria-labelledby="tab-research" class="mx-auto hidden max-w-3xl" data-panel="research">
						<h2 class="font-display text-xl font-bold text-ink-900"><?php esc_html_e( 'Research highlights', 'bioplus' ); ?></h2>
						<p class="mt-2 text-[14px] text-ink-600"><?php echo esc_html( sprintf( /* translators: %s: product name. */ __( 'Areas in which %s is investigated within the research community.', 'bioplus' ), $p['name'] ) ); ?></p>
						<ul class="mt-6 space-y-3">
							<?php foreach ( $p['highlights'] as $h ) : ?>
								<li class="flex items-start gap-3">
									<span class="brand-gradient mt-1.5 grid h-4 w-4 shrink-0 place-items-center rounded-full"><?php bioplus_the_icon( 'check', 11, 'text-white', array( 'stroke' => 3 ) ); ?></span>
									<span class="text-[14.5px] leading-relaxed text-ink-700"><?php echo esc_html( $h ); ?></span>
								</li>
							<?php endforeach; ?>
						</ul>
						<p class="mt-6 rounded-xl bg-mist p-4 text-[13px] leading-relaxed text-ink-600"><?php esc_html_e( 'Information is provided for educational and research-reference purposes only and should not be interpreted as medical advice or a claim of efficacy.', 'bioplus' ); ?></p>
					</div>

					<div id="panel-usage" role="tabpanel" aria-labelledby="tab-usage" class="mx-auto hidden max-w-3xl" data-panel="usage">
						<h2 class="font-display text-xl font-bold text-ink-900"><?php esc_html_e( 'Handling & usage', 'bioplus' ); ?></h2>
						<ul class="mt-6 space-y-3">
							<?php foreach ( bioplus_usage_notes() as $u ) : ?>
								<li class="flex items-start gap-3 rounded-xl border border-line bg-white p-4">
									<?php bioplus_the_icon( 'flask-conical', 17, 'mt-0.5 shrink-0 text-brand-600' ); ?>
									<span class="text-[14px] leading-relaxed text-ink-700"><?php echo esc_html( $u ); ?></span>
								</li>
							<?php endforeach; ?>
						</ul>
					</div>

					<div id="panel-reviews" role="tabpanel" aria-labelledby="tab-reviews" class="hidden" data-panel="reviews">
						<?php
						$reviews = get_comments(
							array(
								'post_id' => $p['id'],
								'status'  => 'approve',
								'type'    => 'review',
							)
						);
						if ( $reviews ) :
							?>
							<div class="mx-auto max-w-3xl space-y-4">
								<?php foreach ( $reviews as $review ) : ?>
									<?php $rating = (int) get_comment_meta( $review->comment_ID, 'rating', true ); ?>
									<figure class="relative overflow-hidden rounded-xl border border-line bg-mist p-6 pl-7">
										<span class="brand-gradient absolute inset-y-0 left-0 w-[3px]"></span>
										<div class="flex gap-0.5 text-brand-500">
											<?php for ( $s = 1; $s <= 5; $s++ ) : ?>
												<?php bioplus_the_icon( 'star', 15, $s <= $rating ? 'fill-current' : 'text-ink-200' ); ?>
											<?php endfor; ?>
										</div>
										<blockquote class="mt-3 text-[14.5px] leading-relaxed text-ink-700"><?php echo esc_html( $review->comment_content ); ?></blockquote>
										<figcaption class="mt-3 text-[13px] font-bold text-ink-900"><?php echo esc_html( $review->comment_author ); ?> <span class="font-normal text-ink-500">· <?php echo esc_html( get_comment_date( '', $review ) ); ?></span></figcaption>
									</figure>
								<?php endforeach; ?>
							</div>
						<?php else : ?>
							<div class="mx-auto max-w-2xl rounded-2xl border border-dashed border-line bg-mist p-8 text-center">
								<div class="flex justify-center gap-1 text-ink-300">
									<?php for ( $s = 0; $s < 5; $s++ ) : ?>
										<?php bioplus_the_icon( 'star', 20, 'fill-ink-200 text-ink-200' ); ?>
									<?php endfor; ?>
								</div>
								<h3 class="font-display mt-4 text-lg font-bold text-ink-900"><?php esc_html_e( 'No reviews yet', 'bioplus' ); ?></h3>
								<p class="mx-auto mt-2 max-w-md text-[13.5px] text-ink-600"><?php echo esc_html( sprintf( /* translators: %s: product name. */ __( 'Verified customer reviews for %s will appear here. Be the first to share your research experience after a verified purchase.', 'bioplus' ), $p['name'] ) ); ?></p>
								<a href="<?php bioplus_the_url( 'contact' ); ?>" class="mt-4 inline-flex items-center gap-1.5 rounded-full border border-ink-900/15 px-5 py-2.5 text-sm font-semibold text-ink-800 hover:border-brand-500 hover:text-brand-700"><?php esc_html_e( 'Share feedback', 'bioplus' ); ?> <?php bioplus_the_icon( 'chevron-right', 15 ); ?></a>
							</div>
						<?php endif; ?>
					</div>
				</div>
			</div>
		</div>
	</div>

	<?php $related = bioplus_related_products( $p['id'] ); ?>
	<?php if ( $related ) : ?>
		<section class="bg-mist py-16">
			<div class="<?php echo esc_attr( bioplus_container() ); ?>">
				<div class="flex items-end justify-between gap-4">
					<?php
					bioplus_section_heading(
						array(
							'eyebrow' => __( 'More from the catalogue', 'bioplus' ),
							'title'   => __( 'You may also be researching', 'bioplus' ),
						)
					);
					?>
					<a href="<?php bioplus_the_url( 'shop' ); ?>" class="hidden items-center gap-1.5 text-sm font-semibold text-brand-700 hover:gap-2.5 sm:inline-flex"><?php esc_html_e( 'View all products', 'bioplus' ); ?> <?php bioplus_the_icon( 'arrow-right', 15 ); ?></a>
				</div>
				<div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
					<?php
					foreach ( $related as $rel ) {
						get_template_part( 'template-parts/components/product-card', null, array( 'product' => $rel ) );
					}
					?>
				</div>
			</div>
		</section>
	<?php endif; ?>
	<?php
endwhile;

get_footer();
