<?php
/**
 * Scrolling announcement marquee (AnnouncementBar.tsx).
 *
 * @package BioPlus
 */

$items = array(
	array( 'truck', bioplus_opt( 'announcement_1' ) ),
	array( 'badge-check', bioplus_opt( 'announcement_2' ) ),
	array( 'flask-conical', bioplus_opt( 'announcement_3' ) ),
	array( 'truck', bioplus_opt( 'announcement_4' ) ),
);
$items = array_filter(
	$items,
	static function ( $i ) {
		return '' !== trim( (string) $i[1] );
	}
);
if ( ! $items ) {
	return;
}
?>
<div class="band-dark relative overflow-hidden text-white">
	<div class="flex animate-marquee whitespace-nowrap py-2 will-change-transform">
		<?php for ( $dup = 0; $dup < 2; $dup++ ) : ?>
			<div class="flex shrink-0 items-center"<?php echo 1 === $dup ? ' aria-hidden="true"' : ''; ?>>
				<?php foreach ( $items as $it ) : ?>
					<span class="mx-6 inline-flex items-center gap-2 text-[12px] font-medium text-white/80">
						<?php bioplus_the_icon( $it[0], 14, 'text-brand-400' ); ?>
						<?php echo esc_html( $it[1] ); ?>
					</span>
				<?php endforeach; ?>
			</div>
		<?php endfor; ?>
	</div>
</div>
