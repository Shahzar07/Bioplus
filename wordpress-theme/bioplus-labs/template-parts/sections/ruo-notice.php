<?php
/**
 * Amber research-use-only notice.
 *
 * @package BioPlus
 * @var array $args text.
 */

?>
<section class="py-16">
	<div class="<?php echo esc_attr( bioplus_container() ); ?>">
		<div class="rounded-2xl border border-amber-200 bg-amber-50 p-7 text-center">
			<p class="mx-auto max-w-3xl text-[14px] leading-relaxed text-amber-900"><?php echo wp_kses( $args['text'], bioplus_inline_kses() ); ?></p>
		</div>
	</div>
</section>
