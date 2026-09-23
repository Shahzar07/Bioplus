<?php
/**
 * Panel header used at the top of each Research Hub page.
 *
 * @package BioPlus
 * @var string $title
 * @var string $subtitle
 */

defined( 'ABSPATH' ) || exit;
?>
<div class="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 pl-7">
	<span class="brand-gradient absolute inset-y-0 left-0 w-[3px]"></span>
	<h1 class="font-display text-2xl font-bold text-white"><?php echo esc_html( $title ); ?></h1>
	<p class="mt-1 text-[13.5px] text-white/55"><?php echo esc_html( $subtitle ); ?></p>
</div>
