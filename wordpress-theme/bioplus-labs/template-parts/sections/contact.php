<?php
/**
 * Contact — dark details panel beside the enquiry form.
 *
 * @package BioPlus
 * @var array $args form_title, form_text, email_note, wholesale_note.
 */

$email   = bioplus_email();
$company = bioplus_opt( 'company_number' );
$rows    = array(
	array( 'mail', __( 'Email — the fastest way to reach us', 'bioplus' ), 'email' ),
	array( 'clock', __( 'Office hours', 'bioplus' ), 'hours' ),
	array( 'map-pin', __( 'Location', 'bioplus' ), 'location' ),
	array( 'building-2', __( 'Wholesale & laboratory supply', 'bioplus' ), 'wholesale' ),
);
?>
<div class="<?php echo esc_attr( bioplus_container( 'default', 'py-14' ) ); ?>">
	<div class="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
		<div class="band-dark relative overflow-hidden rounded-2xl text-white lg:sticky lg:top-28 lg:self-start">
			<div class="hairline-grid absolute inset-0 opacity-50"></div>
			<span class="brand-gradient absolute inset-x-0 top-0 h-[3px]"></span>
			<div class="relative divide-y divide-white/10">
				<?php foreach ( $rows as $row ) : ?>
					<div class="flex items-start gap-4 p-6">
						<span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-white"><?php bioplus_the_icon( $row[0], 18 ); ?></span>
						<div class="min-w-0">
							<p class="text-[10.5px] font-bold uppercase tracking-[0.18em] text-white/45"><?php echo esc_html( $row[1] ); ?></p>
							<div class="mt-1.5 text-[14px] leading-relaxed">
								<?php if ( 'email' === $row[2] ) : ?>
									<a href="<?php echo esc_url( 'mailto:' . $email ); ?>" class="font-semibold text-white hover:text-brand-300"><?php echo esc_html( $email ); ?></a>
									<p class="mt-1 text-white/65"><?php echo esc_html( $args['email_note'] ); ?></p>
								<?php elseif ( 'hours' === $row[2] ) : ?>
									<p class="font-semibold text-white"><?php echo esc_html( bioplus_hours_label() ); ?></p>
									<p class="text-white/65"><?php echo esc_html( bioplus_opt( 'hours_note' ) ); ?></p>
								<?php elseif ( 'location' === $row[2] ) : ?>
									<p class="font-semibold text-white"><?php echo esc_html( bioplus_opt( 'legal_name' ) ); ?></p>
									<p class="text-white/65"><?php echo esc_html( bioplus_opt( 'location_country' ) ); ?></p>
									<p class="text-white/65"><?php echo esc_html( bioplus_opt( 'location_county' ) . ', ' . bioplus_opt( 'location_town' ) ); ?></p>
									<?php if ( $company ) : ?>
										<p class="mt-1.5 text-white/65"><?php esc_html_e( 'Registered in Scotland, company no.', 'bioplus' ); ?> <span class="font-mono text-white/85"><?php echo esc_html( $company ); ?></span></p>
									<?php endif; ?>
								<?php else : ?>
									<p class="text-white/65"><?php echo esc_html( $args['wholesale_note'] ); ?></p>
								<?php endif; ?>
							</div>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		</div>

		<div class="rounded-2xl border border-line bg-white p-7 shadow-card sm:p-8">
			<h2 class="font-display text-2xl font-bold text-ink-900"><?php echo esc_html( $args['form_title'] ); ?></h2>
			<p class="mt-1.5 text-[13.5px] text-ink-600"><?php echo esc_html( $args['form_text'] ); ?></p>
			<?php get_template_part( 'template-parts/components/lead-form-open', null, array( 'type' => 'contact' ) ); ?>
				<?php
				get_template_part( 'template-parts/components/form-field', null, array( 'label' => __( 'First name', 'bioplus' ), 'name' => 'first_name', 'required' => true, 'autocomplete' => 'given-name' ) );
				get_template_part( 'template-parts/components/form-field', null, array( 'label' => __( 'Last name', 'bioplus' ), 'name' => 'last_name', 'required' => true, 'autocomplete' => 'family-name' ) );
				get_template_part( 'template-parts/components/form-field', null, array( 'label' => __( 'Email', 'bioplus' ), 'name' => 'email', 'type' => 'email', 'required' => true, 'full' => true, 'autocomplete' => 'email' ) );
				get_template_part( 'template-parts/components/form-field', null, array( 'label' => __( 'Subject', 'bioplus' ), 'name' => 'subject', 'full' => true ) );
				get_template_part( 'template-parts/components/form-field', null, array( 'label' => __( 'Message', 'bioplus' ), 'name' => 'message', 'type' => 'textarea', 'rows' => 5, 'required' => true, 'minlength' => 10, 'maxlength' => 5000, 'full' => true, 'placeholder' => __( 'How can we help with your research?', 'bioplus' ) ) );
				?>
				<div class="sm:col-span-2">
					<button type="submit" class="brand-gradient flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60" data-label="<?php esc_attr_e( 'Send message', 'bioplus' ); ?>">
						<?php bioplus_the_icon( 'send', 16 ); ?><span data-submit-label><?php esc_html_e( 'Send message', 'bioplus' ); ?></span>
					</button>
					<p class="mt-3 text-center text-[11px] text-ink-500"><?php esc_html_e( 'By contacting us you acknowledge our products are Research Use Only.', 'bioplus' ); ?></p>
				</div>
			</form>
		</div>
	</div>
</div>
