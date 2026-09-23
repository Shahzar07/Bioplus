<?php
/**
 * Countdown ring + payment screenshot upload (PaymentWindow.tsx). Driven by theme.js.
 *
 * @package BioPlus
 * @var array $args order, minutes, proof, confirmed, required.
 */

$order     = $args['order'];
$minutes   = (int) $args['minutes'];
$proof     = (bool) $args['proof'];
$confirmed = (bool) $args['confirmed'];
$required  = (bool) $args['required'];
$circ      = 2 * M_PI * ( ( 132 - 9 ) / 2 );
?>
<div class="<?php echo esc_attr( $confirmed ? 'mt-5 flex flex-col items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-6 sm:flex-row sm:gap-6' : 'mt-5 hidden flex-col items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-6 sm:flex-row sm:gap-6' ); ?>" data-pw-done>
	<span class="grid h-[132px] w-[132px] shrink-0 place-items-center rounded-full border-[9px] border-emerald-500 text-emerald-700"><?php bioplus_the_icon( 'check', 52, '', array( 'stroke' => 3 ) ); ?></span>
	<div class="text-center sm:text-left">
		<p class="font-display text-lg font-bold text-emerald-900"><?php esc_html_e( 'Payment confirmed — thank you', 'bioplus' ); ?></p>
		<p class="mt-1.5 text-[13px] leading-relaxed text-emerald-900/75"><?php esc_html_e( "The timer has stopped. We're checking the transfer against your screenshot and will email you as soon as it clears and your order is on its way.", 'bioplus' ); ?></p>
	</div>
</div>

<div class="<?php echo esc_attr( $confirmed ? 'mt-5 hidden flex-col items-center gap-4 rounded-2xl border px-5 py-6 sm:flex-row sm:gap-6 border-brand-200 bg-brand-50/40' : 'mt-5 flex flex-col items-center gap-4 rounded-2xl border px-5 py-6 sm:flex-row sm:gap-6 border-brand-200 bg-brand-50/40' ); ?>" data-pw-clock data-normal="mt-5 flex flex-col items-center gap-4 rounded-2xl border px-5 py-6 sm:flex-row sm:gap-6 border-brand-200 bg-brand-50/40" data-urgent="mt-5 flex flex-col items-center gap-4 rounded-2xl border px-5 py-6 sm:flex-row sm:gap-6 border-red-200 bg-red-50/60" data-expired="mt-5 flex flex-col items-center gap-4 rounded-2xl border px-5 py-6 sm:flex-row sm:gap-6 border-line bg-mist">
	<div class="relative shrink-0" style="width:132px;height:132px">
		<svg width="132" height="132" class="-rotate-90" role="img" aria-label="<?php esc_attr_e( 'Payment window countdown', 'bioplus' ); ?>" data-pw-svg>
			<circle cx="66" cy="66" r="61.5" fill="none" stroke="currentColor" stroke-width="9" class="text-ink-900/10"></circle>
			<circle cx="66" cy="66" r="61.5" fill="none" stroke="#f85000" stroke-width="9" stroke-linecap="round" stroke-dasharray="<?php echo esc_attr( $circ ); ?>" stroke-dashoffset="0" style="transition:stroke-dashoffset 250ms linear, stroke 400ms ease" data-pw-ring></circle>
		</svg>
		<span class="absolute inset-0 flex flex-col items-center justify-center">
			<span class="font-display text-[30px] font-extrabold leading-none tabular-nums" style="color:#f85000" data-pw-time><?php echo esc_html( str_pad( (string) $minutes, 2, '0', STR_PAD_LEFT ) ); ?>:00</span>
			<span class="mt-1 text-[10.5px] font-bold uppercase tracking-widest text-ink-500" data-pw-caption data-remaining="<?php esc_attr_e( 'remaining', 'bioplus' ); ?>" data-elapsed="<?php esc_attr_e( 'elapsed', 'bioplus' ); ?>"><?php esc_html_e( 'remaining', 'bioplus' ); ?></span>
		</span>
	</div>
	<div class="text-center sm:text-left">
		<p class="font-display text-lg font-bold text-ink-900" data-pw-title data-live="<?php echo esc_attr( sprintf( /* translators: %d: minutes. */ __( 'Please transfer within %d minutes', 'bioplus' ), $minutes ) ); ?>" data-over="<?php esc_attr_e( 'Payment window elapsed', 'bioplus' ); ?>"><?php echo esc_html( sprintf( /* translators: %d: minutes. */ __( 'Please transfer within %d minutes', 'bioplus' ), $minutes ) ); ?></p>
		<p class="mt-1.5 text-[13px] leading-relaxed text-ink-600" data-pw-text data-live="<?php esc_attr_e( 'Paying inside this window means we can dispatch today. The order is not cancelled if the timer runs out — it just may not go out until the next working day.', 'bioplus' ); ?>" data-over="<?php esc_attr_e( "Your order is still reserved and the account details below still apply — please go ahead and pay. If you have already paid, ignore this and we'll confirm once it clears.", 'bioplus' ); ?>"><?php esc_html_e( 'Paying inside this window means we can dispatch today. The order is not cancelled if the timer runs out — it just may not go out until the next working day.', 'bioplus' ); ?></p>
	</div>
</div>

<div class="mt-4 rounded-2xl border border-line bg-white p-5">
	<p class="font-display text-[15px] font-bold text-ink-900"><?php esc_html_e( 'Upload your payment screenshot', 'bioplus' ); ?> <?php if ( $required ) : ?><span class="text-[13px] font-bold text-brand-700"><?php esc_html_e( '(required)', 'bioplus' ); ?></span><?php endif; ?></p>
	<p class="mt-1 text-[12.5px] leading-relaxed text-ink-600"><?php esc_html_e( 'A screenshot of the payment itself — the confirmation from your banking app showing the amount and the reference. Attach it, then press', 'bioplus' ); ?> <strong class="text-ink-900"><?php esc_html_e( 'Done', 'bioplus' ); ?></strong> <?php esc_html_e( "below to confirm. Please don't upload anything else.", 'bioplus' ); ?></p>

	<div class="<?php echo esc_attr( $proof ? 'mt-3.5 flex items-center gap-3.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3' : 'mt-3.5 hidden items-center gap-3.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3' ); ?>" data-pw-uploaded>
		<img src="<?php echo $proof ? esc_url( bioplus_proof_url( $order ) ) : ''; ?>" alt="<?php esc_attr_e( 'Your payment screenshot', 'bioplus' ); ?>" class="h-20 w-20 shrink-0 rounded-lg bg-white object-cover" data-pw-thumb>
		<span class="min-w-0 flex-1">
			<span class="flex items-center gap-1.5 text-[13.5px] font-bold text-emerald-800"><?php bioplus_the_icon( 'check', 16 ); ?> <?php esc_html_e( 'Screenshot received', 'bioplus' ); ?></span>
			<span class="mt-0.5 block text-[12px] leading-relaxed text-emerald-900/70"><?php esc_html_e( "We'll confirm your order once the funds clear.", 'bioplus' ); ?></span>
		</span>
		<button type="button" class="shrink-0 rounded-full border border-emerald-300 px-3.5 py-1.5 text-[12.5px] font-semibold text-emerald-800 transition hover:bg-white disabled:opacity-50" data-pw-pick><?php esc_html_e( 'Replace', 'bioplus' ); ?></button>
	</div>

	<button type="button" class="<?php echo esc_attr( $proof ? 'mt-3.5 hidden w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition disabled:opacity-60 border-line hover:border-brand-400 hover:bg-mist' : 'mt-3.5 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition disabled:opacity-60 border-line hover:border-brand-400 hover:bg-mist' ); ?>" data-drag-class="border-brand-500 bg-brand-50" data-pw-drop>
		<span data-pw-idle-icon><?php bioplus_the_icon( 'upload-cloud', 24, 'text-brand-600' ); ?></span>
		<span class="hidden" data-pw-busy-icon><?php bioplus_the_icon( 'loader-2', 24, 'animate-spin text-brand-600' ); ?></span>
		<span class="text-[13.5px] font-bold text-ink-800" data-pw-drop-label data-idle="<?php esc_attr_e( 'Choose a screenshot', 'bioplus' ); ?>" data-busy="<?php esc_attr_e( 'Uploading…', 'bioplus' ); ?>"><?php esc_html_e( 'Choose a screenshot', 'bioplus' ); ?></span>
		<span class="text-[11.5px] text-ink-500"><?php esc_html_e( 'or drag one here · JPEG, PNG, WebP or HEIC', 'bioplus' ); ?></span>
	</button>
	<input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif" class="hidden" data-pw-file>

	<p class="<?php echo esc_attr( $confirmed ? 'mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-[13px] font-bold text-emerald-800' : 'mt-4 hidden items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-[13px] font-bold text-emerald-800' ); ?>" data-pw-confirmed><?php bioplus_the_icon( 'check', 16 ); ?> <?php esc_html_e( 'Payment confirmed — nothing more to do', 'bioplus' ); ?></p>
	<div class="<?php echo esc_attr( $confirmed ? 'hidden' : '' ); ?>" data-pw-confirm-wrap>
		<button type="button"<?php echo ( $required && ! $proof ) ? ' disabled' : ''; ?> class="brand-gradient mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40" data-pw-confirm data-idle="<?php esc_attr_e( 'Done — I have paid', 'bioplus' ); ?>" data-busy="<?php esc_attr_e( 'Confirming…', 'bioplus' ); ?>">
			<?php bioplus_the_icon( 'check', 17, '', array( 'stroke' => 3 ) ); ?><span data-pw-confirm-label><?php esc_html_e( 'Done — I have paid', 'bioplus' ); ?></span>
		</button>
		<?php if ( $required ) : ?>
			<p class="<?php echo esc_attr( $proof ? 'mt-2 hidden text-center text-[11.5px] text-ink-500' : 'mt-2 text-center text-[11.5px] text-ink-500' ); ?>" data-pw-hint><?php esc_html_e( 'Attach your screenshot to enable this.', 'bioplus' ); ?></p>
		<?php endif; ?>
	</div>
	<p role="alert" class="mt-2.5 hidden items-start gap-1.5 text-[12.5px] font-medium text-red-700" data-pw-error><?php bioplus_the_icon( 'alert-circle', 14, 'mt-px shrink-0' ); ?><span data-pw-error-text></span></p>
</div>
