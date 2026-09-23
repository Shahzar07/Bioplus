<?php
/**
 * One Elementor widget class per storefront section.
 *
 * @package BioPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Widget: page-hero. */
class BioPlus_Widget_PageHero extends BioPlus_Section_Widget {
	const SECTION = 'page-hero';
}

/** Widget: hero. */
class BioPlus_Widget_Hero extends BioPlus_Section_Widget {
	const SECTION = 'hero';
}

/** Widget: trust-bar. */
class BioPlus_Widget_TrustBar extends BioPlus_Section_Widget {
	const SECTION = 'trust-bar';
}

/** Widget: range-feature. */
class BioPlus_Widget_RangeFeature extends BioPlus_Section_Widget {
	const SECTION = 'range-feature';
}

/** Widget: process-band. */
class BioPlus_Widget_ProcessBand extends BioPlus_Section_Widget {
	const SECTION = 'process-band';
}

/** Widget: product-grid. */
class BioPlus_Widget_ProductGrid extends BioPlus_Section_Widget {
	const SECTION = 'product-grid';
}

/** Widget: quality-grid. */
class BioPlus_Widget_QualityGrid extends BioPlus_Section_Widget {
	const SECTION = 'quality-grid';
}

/** Widget: affiliate-band. */
class BioPlus_Widget_AffiliateBand extends BioPlus_Section_Widget {
	const SECTION = 'affiliate-band';
}

/** Widget: testimonials. */
class BioPlus_Widget_Testimonials extends BioPlus_Section_Widget {
	const SECTION = 'testimonials';
}

/** Widget: faq. */
class BioPlus_Widget_Faq extends BioPlus_Section_Widget {
	const SECTION = 'faq';
}

/** Widget: about-intro. */
class BioPlus_Widget_AboutIntro extends BioPlus_Section_Widget {
	const SECTION = 'about-intro';
}

/** Widget: stats. */
class BioPlus_Widget_Stats extends BioPlus_Section_Widget {
	const SECTION = 'stats';
}

/** Widget: icon-cards. */
class BioPlus_Widget_IconCards extends BioPlus_Section_Widget {
	const SECTION = 'icon-cards';
}

/** Widget: ruo-notice. */
class BioPlus_Widget_RuoNotice extends BioPlus_Section_Widget {
	const SECTION = 'ruo-notice';
}

/** Widget: research-featured. */
class BioPlus_Widget_ResearchFeatured extends BioPlus_Section_Widget {
	const SECTION = 'research-featured';
}

/** Widget: coa-finder. */
class BioPlus_Widget_CoaFinder extends BioPlus_Section_Widget {
	const SECTION = 'coa-finder';
}

/** Widget: steps-dark. */
class BioPlus_Widget_StepsDark extends BioPlus_Section_Widget {
	const SECTION = 'steps-dark';
}

/** Widget: coa-pillars. */
class BioPlus_Widget_CoaPillars extends BioPlus_Section_Widget {
	const SECTION = 'coa-pillars';
}

/** Widget: dosage-calculator. */
class BioPlus_Widget_DosageCalculator extends BioPlus_Section_Widget {
	const SECTION = 'dosage-calculator';
}

/** Widget: faq-page. */
class BioPlus_Widget_FaqPage extends BioPlus_Section_Widget {
	const SECTION = 'faq-page';
}

/** Widget: contact. */
class BioPlus_Widget_Contact extends BioPlus_Section_Widget {
	const SECTION = 'contact';
}

/** Widget: affiliate-steps. */
class BioPlus_Widget_AffiliateSteps extends BioPlus_Section_Widget {
	const SECTION = 'affiliate-steps';
}

/** Widget: affiliate-signup. */
class BioPlus_Widget_AffiliateSignup extends BioPlus_Section_Widget {
	const SECTION = 'affiliate-signup';
}

/** Widget: wholesale-perks. */
class BioPlus_Widget_WholesalePerks extends BioPlus_Section_Widget {
	const SECTION = 'wholesale-perks';
}

/** Widget: wholesale-form. */
class BioPlus_Widget_WholesaleForm extends BioPlus_Section_Widget {
	const SECTION = 'wholesale-form';
}

/** Widget: shipping-sections. */
class BioPlus_Widget_ShippingSections extends BioPlus_Section_Widget {
	const SECTION = 'shipping-sections';
}

/**
 * All widget classes.
 *
 * @return string[]
 */
function bioplus_elementor_widget_classes() {
	return array(
		'BioPlus_Widget_PageHero',
		'BioPlus_Widget_Hero',
		'BioPlus_Widget_TrustBar',
		'BioPlus_Widget_RangeFeature',
		'BioPlus_Widget_ProcessBand',
		'BioPlus_Widget_ProductGrid',
		'BioPlus_Widget_QualityGrid',
		'BioPlus_Widget_AffiliateBand',
		'BioPlus_Widget_Testimonials',
		'BioPlus_Widget_Faq',
		'BioPlus_Widget_AboutIntro',
		'BioPlus_Widget_Stats',
		'BioPlus_Widget_IconCards',
		'BioPlus_Widget_RuoNotice',
		'BioPlus_Widget_ResearchFeatured',
		'BioPlus_Widget_CoaFinder',
		'BioPlus_Widget_StepsDark',
		'BioPlus_Widget_CoaPillars',
		'BioPlus_Widget_DosageCalculator',
		'BioPlus_Widget_FaqPage',
		'BioPlus_Widget_Contact',
		'BioPlus_Widget_AffiliateSteps',
		'BioPlus_Widget_AffiliateSignup',
		'BioPlus_Widget_WholesalePerks',
		'BioPlus_Widget_WholesaleForm',
		'BioPlus_Widget_ShippingSections',
	);
}
