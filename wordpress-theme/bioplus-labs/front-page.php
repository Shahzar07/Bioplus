<?php
/**
 * Front page — the storefront home (app/page.tsx).
 *
 * Shows the latest posts instead when "Your homepage displays" is set to posts.
 *
 * @package BioPlus
 */

if ( 'posts' === get_option( 'show_on_front' ) ) {
	get_template_part( 'index' );
	return;
}

bioplus_render_layout( 'home' );
