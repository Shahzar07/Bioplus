<?php
/**
 * Light form field (label + input/textarea), shared by the lead forms.
 *
 * @package BioPlus
 * @var array $args label, name, type, required, full, placeholder, rows, minlength, maxlength, value, autocomplete, hint.
 */

$a  = wp_parse_args(
	$args,
	array(
		'label'        => '',
		'name'         => '',
		'type'         => 'text',
		'required'     => false,
		'full'         => false,
		'placeholder'  => '',
		'rows'         => 4,
		'minlength'    => 0,
		'maxlength'    => 0,
		'value'        => '',
		'autocomplete' => '',
		'hint'         => '',
		'id'           => '',
	)
);
$id = $a['id'] ? $a['id'] : 'f-' . $a['name'];
?>
<div class="<?php echo esc_attr( $a['full'] ? 'sm:col-span-2' : '' ); ?>">
	<label for="<?php echo esc_attr( $id ); ?>" class="mb-1.5 block text-[13px] font-semibold text-ink-800"><?php echo esc_html( $a['label'] ); ?></label>
	<?php if ( 'textarea' === $a['type'] ) : ?>
		<textarea id="<?php echo esc_attr( $id ); ?>" name="<?php echo esc_attr( $a['name'] ); ?>" rows="<?php echo esc_attr( $a['rows'] ); ?>"<?php echo $a['required'] ? ' required' : ''; ?><?php echo $a['minlength'] ? ' minlength="' . esc_attr( $a['minlength'] ) . '"' : ''; ?><?php echo $a['maxlength'] ? ' maxlength="' . esc_attr( $a['maxlength'] ) . '"' : ''; ?> placeholder="<?php echo esc_attr( $a['placeholder'] ); ?>" class="w-full rounded-xl border border-line bg-white px-3.5 py-3 text-sm outline-none transition focus:border-brand-500"><?php echo esc_textarea( $a['value'] ); ?></textarea>
	<?php else : ?>
		<input id="<?php echo esc_attr( $id ); ?>" type="<?php echo esc_attr( $a['type'] ); ?>" name="<?php echo esc_attr( $a['name'] ); ?>" value="<?php echo esc_attr( $a['value'] ); ?>"<?php echo $a['required'] ? ' required' : ''; ?><?php echo $a['autocomplete'] ? ' autocomplete="' . esc_attr( $a['autocomplete'] ) . '"' : ''; ?> placeholder="<?php echo esc_attr( $a['placeholder'] ); ?>" class="h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm outline-none transition focus:border-brand-500">
	<?php endif; ?>
	<?php if ( $a['hint'] ) : ?>
		<p class="mt-1.5 text-[11.5px] text-ink-500"><?php echo esc_html( $a['hint'] ); ?></p>
	<?php endif; ?>
</div>
