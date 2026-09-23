<?php
/**
 * Comments.
 *
 * @package BioPlus
 */

if ( post_password_required() ) {
	return;
}
?>
<div id="comments" class="mt-12 border-t border-line pt-10">
	<?php if ( have_comments() ) : ?>
		<h2 class="font-display text-xl font-bold text-ink-900"><?php echo esc_html( sprintf( /* translators: %d: comment count. */ _n( '%d comment', '%d comments', get_comments_number(), 'bioplus' ), get_comments_number() ) ); ?></h2>
		<ol class="mt-6 space-y-4"><?php wp_list_comments( array( 'style' => 'ol', 'short_ping' => true, 'avatar_size' => 40 ) ); ?></ol>
		<?php the_comments_pagination(); ?>
	<?php endif; ?>
	<?php comment_form( array( 'class_submit' => 'brand-gradient mt-2 h-11 rounded-full px-7 text-sm font-bold text-white' ) ); ?>
</div>
