<?php
/**
 * Template Name: BioPlus — Create account
 *
 * @package BioPlus
 */

get_header();
if ( function_exists( 'bioplus_auth_form' ) ) {
	bioplus_auth_form( 'register' );
}
get_footer();
