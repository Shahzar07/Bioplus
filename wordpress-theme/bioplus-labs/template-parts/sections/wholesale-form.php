<?php
/**
 * Wholesale — quote request (stored in Forms).
 *
 * @package BioPlus
 * @var array $args eyebrow, title.
 */

$email = bioplus_email();
?>
<section class="pb-20">
	<div class="<?php echo esc_attr( bioplus_container( 'narrow' ) ); ?>">
		<div class="rounded-2xl border border-line bg-white p-7 shadow-card sm:p-9">
			<?php
			bioplus_section_heading(
				array(
					'eyebrow' => $args['eyebrow'],
					'title'   => $args['title'],
				)
			);
			?>
			<?php get_template_part( 'template-parts/components/lead-form-open', null, array( 'type' => 'wholesale', 'class' => 'mt-7 grid gap-4 sm:grid-cols-2' ) ); ?>
				<?php
				get_template_part( 'template-parts/components/form-field', null, array( 'label' => __( 'Contact name', 'bioplus' ), 'name' => 'name', 'required' => true, 'autocomplete' => 'name' ) );
				get_template_part( 'template-parts/components/form-field', null, array( 'label' => __( 'Company / Institution', 'bioplus' ), 'name' => 'organisation', 'required' => true, 'autocomplete' => 'organization' ) );
				get_template_part( 'template-parts/components/form-field', null, array( 'label' => __( 'Email', 'bioplus' ), 'name' => 'email', 'type' => 'email', 'required' => true, 'autocomplete' => 'email' ) );
				get_template_part( 'template-parts/components/form-field', null, array( 'label' => __( 'Phone', 'bioplus' ), 'name' => 'phone', 'type' => 'tel', 'autocomplete' => 'tel' ) );
				get_template_part( 'template-parts/components/form-field', null, array( 'label' => __( 'Products & estimated volume', 'bioplus' ), 'name' => 'message', 'type' => 'textarea', 'full' => true, 'placeholder' => __( "List the products (and SKUs) and approximate quantities you're interested in.", 'bioplus' ) ) );
				?>
				<div class="sm:col-span-2">
					<button type="submit" class="brand-gradient h-12 w-full rounded-full text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"><span data-submit-label><?php esc_html_e( 'Request wholesale pricing', 'bioplus' ); ?></span></button>
					<p class="mt-3 text-center text-[12px] text-ink-500">
						<?php esc_html_e( 'Prefer email? Reach us at', 'bioplus' ); ?>
						<a href="<?php echo esc_url( 'mailto:' . $email ); ?>" class="font-semibold text-brand-700 hover:underline"><?php echo esc_html( $email ); ?></a>
					</p>
				</div>
			</form>
		</div>
	</div>
</section>
