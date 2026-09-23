<?php
/**
 * Opening markup shared by every lead form: success panel, error banner,
 * nonce, honeypot and form type. Closed by the calling template.
 *
 * @package BioPlus
 * @var array $args type (contact|affiliate|wholesale), class.
 */

$type = isset( $args['type'] ) ? $args['type'] : 'contact';
?>
<div class="hidden mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center" data-form-success>
	<span class="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-600 text-white"><?php bioplus_the_icon( 'check', 24, '', array( 'stroke' => 3 ) ); ?></span>
	<p class="font-display mt-4 text-lg font-bold text-emerald-900"><?php echo 'contact' === $type ? esc_html__( 'Message sent', 'bioplus' ) : esc_html__( 'Thank you — received', 'bioplus' ); ?></p>
	<p class="mt-1.5 text-[13.5px] leading-relaxed text-emerald-900/75"><?php esc_html_e( "Thanks — we've got it and will reply within one working day.", 'bioplus' ); ?></p>
</div>
<form class="<?php echo esc_attr( isset( $args['class'] ) ? $args['class'] : 'mt-6 grid gap-4 sm:grid-cols-2' ); ?>" data-bioplus-form="<?php echo esc_attr( $type ); ?>" novalidate>
	<p role="alert" class="hidden items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-800 sm:col-span-2" data-form-error>
		<?php bioplus_the_icon( 'alert-circle', 16, 'mt-px shrink-0' ); ?><span data-form-error-text></span>
	</p>
	<input type="hidden" name="form_type" value="<?php echo esc_attr( $type ); ?>">
	<input type="hidden" name="page_url" value="<?php echo esc_url( home_url( bioplus_current_path() ) ); ?>">
	<div class="hidden" aria-hidden="true"><label>Website<input type="text" name="bp_website" tabindex="-1" autocomplete="off"></label></div>
