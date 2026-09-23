<?php
/**
 * Affiliate — perks beside the application form (stored in Forms).
 *
 * @package BioPlus
 * @var array $args eyebrow, title, form_title, form_text, perks.
 */

?>
<section class="bg-mist py-20">
	<div class="<?php echo esc_attr( bioplus_container( 'default', 'grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center' ) ); ?>">
		<div>
			<?php
			bioplus_section_heading(
				array(
					'eyebrow' => $args['eyebrow'],
					'title'   => $args['title'],
				)
			);
			?>
			<ul class="mt-7 space-y-4">
				<?php foreach ( (array) $args['perks'] as $p ) : ?>
					<li class="flex items-start gap-4 rounded-xl border border-line bg-white p-5 shadow-card">
						<span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><?php bioplus_the_icon( $p['icon'], 20 ); ?></span>
						<div>
							<h3 class="font-display text-base font-bold"><?php echo esc_html( $p['title'] ); ?></h3>
							<p class="mt-1 text-[13.5px] leading-relaxed text-ink-600"><?php echo esc_html( $p['text'] ); ?></p>
						</div>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>

		<div class="rounded-2xl border border-line bg-white p-7 shadow-card sm:p-8">
			<h2 class="font-display text-2xl font-bold"><?php echo esc_html( $args['form_title'] ); ?></h2>
			<p class="mt-1.5 text-[13.5px] text-ink-600"><?php echo esc_html( $args['form_text'] ); ?></p>
			<?php get_template_part( 'template-parts/components/lead-form-open', null, array( 'type' => 'affiliate' ) ); ?>
				<?php
				get_template_part( 'template-parts/components/form-field', null, array( 'label' => __( 'Full name', 'bioplus' ), 'name' => 'name', 'required' => true, 'full' => true, 'autocomplete' => 'name' ) );
				get_template_part( 'template-parts/components/form-field', null, array( 'label' => __( 'Email', 'bioplus' ), 'name' => 'email', 'type' => 'email', 'required' => true, 'autocomplete' => 'email' ) );
				get_template_part( 'template-parts/components/form-field', null, array( 'label' => __( 'Website / Social', 'bioplus' ), 'name' => 'website' ) );
				get_template_part( 'template-parts/components/form-field', null, array( 'label' => __( 'Audience / network', 'bioplus' ), 'name' => 'message', 'type' => 'textarea', 'full' => true, 'placeholder' => __( 'Describe your audience, platform, or research network.', 'bioplus' ) ) );
				?>
				<div class="sm:col-span-2">
					<button type="submit" class="brand-gradient flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"><span data-submit-label><?php esc_html_e( 'Submit application', 'bioplus' ); ?></span></button>
				</div>
			</form>
		</div>
	</div>
</section>
