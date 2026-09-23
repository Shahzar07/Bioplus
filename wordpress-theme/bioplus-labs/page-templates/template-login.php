<?php
/**
 * Template Name: BioPlus — Sign in
 *
 * @package BioPlus
 */

get_header();
if ( function_exists( 'bioplus_auth_form' ) ) {
	bioplus_auth_form( 'login' );
} else {
	echo '<div class="' . esc_attr( bioplus_container( 'narrow', 'py-20' ) ) . '">';
	wp_login_form();
	echo '</div>';
}
get_footer();
