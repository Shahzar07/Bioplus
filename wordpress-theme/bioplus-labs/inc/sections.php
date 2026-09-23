<?php
/**
 * Section registry.
 *
 * Every page section of the storefront is declared once here — its fields and
 * their default content — and rendered by template-parts/sections/{id}.php.
 * The page templates call bioplus_section() with the defaults; the Elementor
 * integration turns each entry into a widget whose controls are these fields,
 * so a page rebuilt in Elementor renders exactly the same markup.
 *
 * Field types: text, textarea, url, icon, image, switch, number, select, repeater.
 * Headings accept [[text]] for the orange gradient highlight.
 *
 * @package BioPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Shorthand field builder.
 *
 * @param string $type    Type.
 * @param string $label   Label.
 * @param mixed  $default Default.
 * @param array  $extra   Extra keys (options, fields).
 * @return array
 */
function bioplus_f( $type, $label, $default = '', $extra = array() ) {
	return array_merge(
		array(
			'type'    => $type,
			'label'   => $label,
			'default' => $default,
		),
		$extra
	);
}

/**
 * FAQ content (src/data/faq.ts).
 *
 * @return array<int,array{q:string,a:string}>
 */
function bioplus_default_faqs() {
	$email = bioplus_email();
	return array(
		array( 'q' => 'What are peptides?', 'a' => 'Peptides are short chains of amino acids that serve as signalling molecules in biological systems. Researchers study peptides for their potential involvement in cellular communication, tissue regeneration, metabolic function, and various physiological processes.' ),
		array( 'q' => 'How are peptides different from proteins?', 'a' => 'Both peptides and proteins are made up of amino acids. The primary difference is size — peptides are shorter amino-acid chains, while proteins are larger, more complex structures composed of many amino acids.' ),
		array( 'q' => 'What are BPC-157 and TB-500 commonly researched for?', 'a' => 'BPC-157 and TB-500 are among the most widely researched peptides in regenerative science. Researchers commonly investigate these compounds for their potential roles in tissue repair, cellular regeneration, recovery processes, and inflammatory pathways.' ),
		array( 'q' => 'What is the difference between BPC-157 and TB-500?', 'a' => 'While both compounds are frequently studied in regenerative research, they are researched for different characteristics. BPC-157 is commonly investigated for tissue repair and gastrointestinal-related research, while TB-500 is often studied in connection with cellular migration, tissue remodelling, and recovery processes.' ),
		array( 'q' => 'How are products stored before they reach me?', 'a' => 'Products are held sealed and protected from light at 2–8 °C before dispatch, and the storage conditions for each product are printed on the vial label. Once a product is delivered, determining appropriate storage and handling is the responsibility of the receiving researcher.' ),
		array( 'q' => 'Do you provide preparation or handling instructions?', 'a' => 'No. Our products are supplied strictly for research use, and we do not provide preparation, reconstitution, dosing, or administration instructions of any kind. Qualified researchers are solely responsible for determining and validating their own protocols.' ),
		array( 'q' => 'What is bacteriostatic water?', 'a' => 'Bacteriostatic water is sterile water containing 0.9% benzyl alcohol as a preservative. We supply it as a standalone laboratory consumable. We do not provide guidance on how it should be used with any other product.' ),
		array( 'q' => 'What is the shelf life of my research product?', 'a' => 'Each vial carries an expiry date on its label, printed alongside the batch number. That date, together with the Certificate of Analysis for the batch, is the reference point for the product you receive.' ),
		array( 'q' => 'What are your products used for, and what dosage information do you provide?', 'a' => 'All products sold by BioPlus Labs are intended strictly for laboratory research, analytical testing, and scientific investigation purposes only. Because our products are sold exclusively for research purposes, BioPlus Labs does not provide dosage recommendations, administration instructions, treatment protocols, or guidance regarding human or animal use.' ),
		array( 'q' => 'Are your products MHRA approved?', 'a' => 'No. The products offered by BioPlus Labs are research compounds and laboratory materials. They hold no marketing authorisation from the Medicines and Healthcare products Regulatory Agency (MHRA) and have not been assessed for human or veterinary use.' ),
		array( 'q' => 'How can I contact customer support?', 'a' => 'If you have questions that are not addressed here, our team is happy to assist you. Please use our Contact page or email ' . $email . '. Our customer support team aims to reply to every enquiry within one working day.' ),
	);
}

/**
 * Section definitions.
 *
 * @return array<string,array>
 */
function bioplus_sections() {
	static $sections = null;
	if ( null !== $sections ) {
		return $sections;
	}

	$card_fields = array(
		'icon'  => bioplus_f( 'icon', __( 'Icon', 'bioplus' ), 'flask-conical' ),
		'title' => bioplus_f( 'text', __( 'Title', 'bioplus' ) ),
		'text'  => bioplus_f( 'textarea', __( 'Text', 'bioplus' ) ),
	);

	$sections = array(

		/* --------------------------------------------------------- shared */
		'page-hero'          => array(
			'title'  => __( 'Page Hero (brushed plate)', 'bioplus' ),
			'icon'   => 'eicon-header',
			'fields' => array(
				'eyebrow'      => bioplus_f( 'text', __( 'Eyebrow', 'bioplus' ), 'About BioPlus Labs' ),
				'title'        => bioplus_f( 'textarea', __( 'Title', 'bioplus' ), 'A UK laboratory supplier built on quality you can verify.' ),
				'intro'        => bioplus_f( 'textarea', __( 'Intro', 'bioplus' ), '' ),
				'crumb'        => bioplus_f( 'text', __( 'Breadcrumb — current page', 'bioplus' ), '' ),
				'crumb_parent' => bioplus_f( 'text', __( 'Breadcrumb — parent label (optional)', 'bioplus' ), '' ),
				'crumb_url'    => bioplus_f( 'url', __( 'Breadcrumb — parent link', 'bioplus' ), '' ),
			),
		),

		/* ------------------------------------------------------------ home */
		'hero'               => array(
			'title'  => __( 'Home Hero (video)', 'bioplus' ),
			'icon'   => 'eicon-slider-video',
			'fields' => array(
				'badge'           => bioplus_f( 'text', __( 'Badge', 'bioplus' ), 'For research use only' ),
				'title'           => bioplus_f( 'text', __( 'Title line 1', 'bioplus' ), 'Research-grade peptides,' ),
				'title_highlight' => bioplus_f( 'text', __( 'Title line 2 (gradient)', 'bioplus' ), 'verified to the batch.' ),
				'text'            => bioplus_f( 'textarea', __( 'Text', 'bioplus' ), 'BioPlus Labs supplies UK researchers with third-party tested peptides and research compounds — every batch independently verified for identity and purity, documented, and traceable via Certificate of Analysis.' ),
				'primary_label'   => bioplus_f( 'text', __( 'Primary button', 'bioplus' ), 'Shop research products' ),
				'primary_url'     => bioplus_f( 'url', __( 'Primary link', 'bioplus' ), 'shop' ),
				'secondary_label' => bioplus_f( 'text', __( 'Secondary button', 'bioplus' ), 'Find a Certificate of Analysis' ),
				'secondary_url'   => bioplus_f( 'url', __( 'Secondary link', 'bioplus' ), 'certificates-of-analysis' ),
				'proof'           => bioplus_f(
					'repeater',
					__( 'Proof points', 'bioplus' ),
					array(
						array( 'icon' => 'shield-check', 'label' => 'Third-party tested' ),
						array( 'icon' => 'file-text', 'label' => 'COA with every batch' ),
						array( 'icon' => 'truck', 'label' => 'UK dispatch in 24–48h' ),
						array( 'icon' => 'lock', 'label' => 'Secure checkout' ),
					),
					array(
						'fields' => array(
							'icon'  => bioplus_f( 'icon', __( 'Icon', 'bioplus' ), 'shield-check' ),
							'label' => bioplus_f( 'text', __( 'Label', 'bioplus' ) ),
						),
					)
				),
				'video'           => bioplus_f( 'url', __( 'Background video (MP4)', 'bioplus' ), '' ),
				'image'           => bioplus_f( 'image', __( 'Display image', 'bioplus' ), '' ),
				'caption_left'    => bioplus_f( 'text', __( 'Image caption (left)', 'bioplus' ), 'The BioPlus range' ),
				'caption_right'   => bioplus_f( 'text', __( 'Image caption (right)', 'bioplus' ), '≥98–99% verified' ),
			),
		),

		'trust-bar'          => array(
			'title'  => __( 'Trust Bar', 'bioplus' ),
			'icon'   => 'eicon-info-box',
			'fields' => array(
				'badges' => bioplus_f(
					'repeater',
					__( 'Badges', 'bioplus' ),
					array(
						array( 'icon' => 'microscope', 'title' => 'Batch-Tested Purity', 'text' => 'Verified by HPLC, UPLC & Mass Spectrometry' ),
						array( 'icon' => 'shield-check', 'title' => 'Identity Verified', 'text' => 'Documentation maintained for traceability' ),
						array( 'icon' => 'flask-conical', 'title' => 'Research Use Only', 'text' => 'Lyophilised compounds for the lab' ),
						array( 'icon' => 'truck', 'title' => 'Same-Day UK Dispatch', 'text' => 'On orders approved before our 2pm cut-off' ),
					),
					array( 'fields' => $card_fields )
				),
			),
		),

		'range-feature'      => array(
			'title'  => __( 'Range Feature (image + checklist)', 'bioplus' ),
			'icon'   => 'eicon-image-box',
			'fields' => array(
				'image'          => bioplus_f( 'image', __( 'Image', 'bioplus' ), '' ),
				'eyebrow'        => bioplus_f( 'text', __( 'Eyebrow', 'bioplus' ), 'The BioPlus Range' ),
				'title'          => bioplus_f( 'textarea', __( 'Title', 'bioplus' ), 'Lab-grade vials, [[precision-filled]] and batch-tested.' ),
				'intro'          => bioplus_f( 'textarea', __( 'Intro', 'bioplus' ), 'Every BioPlus Labs vial is lyophilised, sealed, and verified for identity and purity before it leaves us — with storage and research-use guidance printed on the label.' ),
				'features'       => bioplus_f( 'textarea', __( 'Checklist (one per line)', 'bioplus' ), "≥98–99% verified purity\nHPLC / UPLC / MS tested\nTamper-evident crimp seals\nRefrigerated 12-month shelf life\nBatch-matched COA with every kit\nDispatched from the UK in 24–48h" ),
				'button_label'   => bioplus_f( 'text', __( 'Button', 'bioplus' ), 'Shop the catalogue' ),
				'button_url'     => bioplus_f( 'url', __( 'Button link', 'bioplus' ), 'shop' ),
				'button2_label'  => bioplus_f( 'text', __( 'Second button', 'bioplus' ), 'Dosage calculator' ),
				'button2_url'    => bioplus_f( 'url', __( 'Second button link', 'bioplus' ), 'dosage-calculator' ),
			),
		),

		'process-band'       => array(
			'title'  => __( 'Process Band (dark, numbered)', 'bioplus' ),
			'icon'   => 'eicon-number-field',
			'fields' => array(
				'eyebrow' => bioplus_f( 'text', __( 'Eyebrow', 'bioplus' ), 'Our quality commitment' ),
				'title'   => bioplus_f( 'textarea', __( 'Title', 'bioplus' ), 'From synthesis to your door, [[every step is verified]].' ),
				'steps'   => bioplus_f(
					'repeater',
					__( 'Steps', 'bioplus' ),
					array(
						array( 'icon' => 'flask-conical', 'title' => 'Sourced & synthesised', 'text' => 'Every compound is sourced from vetted manufacturing partners working under controlled laboratory conditions.' ),
						array( 'icon' => 'microscope', 'title' => 'Independently tested', 'text' => 'Each batch is verified by third-party HPLC/MS analysis for identity, purity, and contaminants.' ),
						array( 'icon' => 'file-check', 'title' => 'Certified & documented', 'text' => 'A matching Certificate of Analysis is issued per batch and searchable on our COA page.' ),
						array( 'icon' => 'truck', 'title' => 'Dispatched from the UK', 'text' => 'Packed discreetly and shipped from the UK within 24–48 hours, tracked door to door.' ),
					),
					array( 'fields' => $card_fields )
				),
			),
		),

		'product-grid'       => array(
			'title'  => __( 'Product Grid', 'bioplus' ),
			'icon'   => 'eicon-products',
			'fields' => array(
				'eyebrow'      => bioplus_f( 'text', __( 'Eyebrow', 'bioplus' ), 'Most Researched' ),
				'title'        => bioplus_f( 'textarea', __( 'Title', 'bioplus' ), 'Best-selling & new peptides' ),
				'intro'        => bioplus_f( 'textarea', __( 'Intro', 'bioplus' ), 'The single-compound research peptides laboratories order most — in stock and ready to ship.' ),
				'source'       => bioplus_f(
					'select',
					__( 'Products', 'bioplus' ),
					'bestsellers',
					array(
						'options' => array(
							'bestsellers' => __( 'Best sellers & new (excluding stacks)', 'bioplus' ),
							'stacks'      => __( 'Research stacks', 'bioplus' ),
							'new'         => __( 'New arrivals', 'bioplus' ),
							'all'         => __( 'All products', 'bioplus' ),
							'skus'        => __( 'Chosen products (slugs below)', 'bioplus' ),
						),
					)
				),
				'slugs'        => bioplus_f( 'text', __( 'Product slugs (comma separated)', 'bioplus' ), '' ),
				'limit'        => bioplus_f( 'number', __( 'Maximum products (0 = all)', 'bioplus' ), 0 ),
				'background'   => bioplus_f( 'select', __( 'Background', 'bioplus' ), 'white', array( 'options' => array( 'white' => 'White', 'mist' => 'Mist grey' ) ) ),
				'button_label' => bioplus_f( 'text', __( 'Button', 'bioplus' ), 'Explore the full catalogue' ),
				'button_url'   => bioplus_f( 'url', __( 'Button link', 'bioplus' ), 'shop' ),
			),
		),

		'quality-grid'       => array(
			'title'  => __( 'Quality Commitment (split)', 'bioplus' ),
			'icon'   => 'eicon-gallery-grid',
			'fields' => array(
				'eyebrow'       => bioplus_f( 'text', __( 'Eyebrow', 'bioplus' ), 'Our Commitment to Quality' ),
				'title'         => bioplus_f( 'textarea', __( 'Title', 'bioplus' ), 'Reliable research begins with [[reliable products]].' ),
				'intro'         => bioplus_f( 'textarea', __( 'Intro', 'bioplus' ), 'We believe the integrity of scientific research depends on the quality of the materials used. Quality assurance, consistency, and transparency are at the core of everything we do.' ),
				'button_label'  => bioplus_f( 'text', __( 'Button', 'bioplus' ), 'About BioPlus Labs' ),
				'button_url'    => bioplus_f( 'url', __( 'Button link', 'bioplus' ), 'about' ),
				'button2_label' => bioplus_f( 'text', __( 'Second button', 'bioplus' ), 'Testing methodology' ),
				'button2_url'   => bioplus_f( 'url', __( 'Second button link', 'bioplus' ), 'certificates-of-analysis' ),
				'cards'         => bioplus_f(
					'repeater',
					__( 'Cards', 'bioplus' ),
					array(
						array( 'icon' => 'microscope', 'title' => 'Rigorous Analytical Testing', 'text' => 'Every production batch is evaluated by HPLC, UPLC, and Mass Spectrometry to verify identity, purity, and quality.' ),
						array( 'icon' => 'file-check', 'title' => 'Transparency & Accountability', 'text' => 'Supporting documentation and testing records are maintained to promote traceability throughout the supply chain.' ),
						array( 'icon' => 'boxes', 'title' => 'Quality-Focused Manufacturing', 'text' => 'We partner with facilities operating under stringent quality standards and established production protocols.' ),
						array( 'icon' => 'headset', 'title' => 'Responsive Support', 'text' => 'Knowledgeable assistance throughout the ordering process and beyond, from order placement through delivery.' ),
					),
					array( 'fields' => $card_fields )
				),
			),
		),

		'affiliate-band'     => array(
			'title'  => __( 'Affiliate Band (dark CTA)', 'bioplus' ),
			'icon'   => 'eicon-call-to-action',
			'fields' => array(
				'badge'         => bioplus_f( 'text', __( 'Badge', 'bioplus' ), 'Affiliate Programme' ),
				'title'         => bioplus_f( 'textarea', __( 'Title', 'bioplus' ), 'Partner with BioPlus Labs and earn on every referral.' ),
				'text'          => bioplus_f( 'textarea', __( 'Text', 'bioplus' ), 'Researchers, content creators, and labs can join our affiliate programme to share BioPlus Labs with their network and earn commissions on qualified orders.' ),
				'button_label'  => bioplus_f( 'text', __( 'Button', 'bioplus' ), 'Join the programme' ),
				'button_url'    => bioplus_f( 'url', __( 'Button link', 'bioplus' ), 'affiliate' ),
				'button2_label' => bioplus_f( 'text', __( 'Second button', 'bioplus' ), 'Wholesale & bulk pricing' ),
				'button2_url'   => bioplus_f( 'url', __( 'Second button link', 'bioplus' ), 'wholesale' ),
			),
		),

		'testimonials'       => array(
			'title'  => __( 'Testimonials', 'bioplus' ),
			'icon'   => 'eicon-testimonial',
			'fields' => array(
				'eyebrow' => bioplus_f( 'text', __( 'Eyebrow', 'bioplus' ), 'Testimonials' ),
				'title'   => bioplus_f( 'textarea', __( 'Title', 'bioplus' ), 'Trusted by researchers' ),
				'intro'   => bioplus_f( 'textarea', __( 'Intro', 'bioplus' ), 'What laboratories and research professionals say about working with BioPlus Labs.' ),
				'note'    => bioplus_f( 'textarea', __( 'Small print', 'bioplus' ), 'Verified researcher feedback. Reviews for individual products appear on each product page.' ),
				'items'   => bioplus_f(
					'repeater',
					__( 'Testimonials', 'bioplus' ),
					array(
						array( 'quote' => "Purity and consistency batch after batch. The COA documentation makes our lab's record-keeping straightforward and audit-ready.", 'name' => 'Dr. M. Ellison', 'role' => 'Research Scientist', 'initials' => 'ME' ),
						array( 'quote' => 'Fast, discreet shipping and genuinely responsive support. BioPlus Labs has become our go-to supplier for research compounds.', 'name' => 'J. Park', 'role' => 'Laboratory Manager', 'initials' => 'JP' ),
						array( 'quote' => 'Clear specifications and the dosage calculator save us real time during reconstitution. Quality we can rely on every order.', 'name' => 'Dr. A. Whitfield', 'role' => 'Postdoctoral Researcher', 'initials' => 'AW' ),
					),
					array(
						'fields' => array(
							'quote'    => bioplus_f( 'textarea', __( 'Quote', 'bioplus' ) ),
							'name'     => bioplus_f( 'text', __( 'Name', 'bioplus' ) ),
							'role'     => bioplus_f( 'text', __( 'Role', 'bioplus' ) ),
							'initials' => bioplus_f( 'text', __( 'Initials', 'bioplus' ) ),
						),
					)
				),
			),
		),

		'faq'                => array(
			'title'  => __( 'FAQ Accordion', 'bioplus' ),
			'icon'   => 'eicon-accordion',
			'fields' => array(
				'eyebrow'      => bioplus_f( 'text', __( 'Eyebrow', 'bioplus' ), 'Questions & Answers' ),
				'title'        => bioplus_f( 'textarea', __( 'Title', 'bioplus' ), 'Peptides & research FAQ' ),
				'intro'        => bioplus_f( 'textarea', __( 'Intro', 'bioplus' ), 'Common questions about research peptides, storage, and how BioPlus Labs operates.' ),
				'limit'        => bioplus_f( 'number', __( 'Questions shown (0 = all)', 'bioplus' ), 6 ),
				'button_label' => bioplus_f( 'text', __( 'Button', 'bioplus' ), 'See all FAQs' ),
				'button_url'   => bioplus_f( 'url', __( 'Button link', 'bioplus' ), 'faq' ),
				'items'        => bioplus_f(
					'repeater',
					__( 'Questions', 'bioplus' ),
					bioplus_default_faqs(),
					array(
						'fields' => array(
							'q' => bioplus_f( 'text', __( 'Question', 'bioplus' ) ),
							'a' => bioplus_f( 'textarea', __( 'Answer', 'bioplus' ) ),
						),
					)
				),
			),
		),

		/* ----------------------------------------------------------- about */
		'about-intro'        => array(
			'title'  => __( 'About — Commitment, Mission & Vision', 'bioplus' ),
			'icon'   => 'eicon-info-circle-o',
			'fields' => array(
				'eyebrow'      => bioplus_f( 'text', __( 'Eyebrow', 'bioplus' ), 'Our Commitment to Quality' ),
				'title'        => bioplus_f( 'textarea', __( 'Title', 'bioplus' ), 'Reliable research begins with reliable products.' ),
				'intro'        => bioplus_f( 'textarea', __( 'Intro', 'bioplus' ), 'We believe the integrity of scientific research depends on the quality of the materials being used. For that reason, we work with carefully selected manufacturing partners and suppliers that adhere to strict production standards and quality control protocols.' ),
				'text'         => bioplus_f( 'textarea', __( 'Body', 'bioplus' ), 'Each production batch is subject to comprehensive analytical testing to verify identity, purity, and quality specifications. Testing methodologies may include High-Performance Liquid Chromatography (HPLC), Ultra-Performance Liquid Chromatography (UPLC), Mass Spectrometry (MS), and other validated analytical procedures. Supporting documentation and testing records are maintained to promote accountability and traceability throughout the supply chain.' ),
				'button_label' => bioplus_f( 'text', __( 'Button', 'bioplus' ), 'Explore our testing methodology' ),
				'button_url'   => bioplus_f( 'url', __( 'Button link', 'bioplus' ), 'certificates-of-analysis' ),
				'mission'      => bioplus_f( 'textarea', __( 'Mission', 'bioplus' ), 'To support scientific advancement by delivering dependable research materials, exceptional service, and a transparent customer experience that researchers can trust.' ),
				'vision'       => bioplus_f( 'textarea', __( 'Vision', 'bioplus' ), 'To become a recognised leader in the research compound industry by setting the standard for product quality, integrity, and customer confidence — while helping advance innovation within the scientific community.' ),
			),
		),

		'stats'              => array(
			'title'  => __( 'Stat Tiles', 'bioplus' ),
			'icon'   => 'eicon-counter',
			'fields' => array(
				'items' => bioplus_f(
					'repeater',
					__( 'Stats', 'bioplus' ),
					array(
						array( 'value' => '500+', 'label' => 'Batches tested' ),
						array( 'value' => '99%+', 'label' => 'Average verified purity' ),
						array( 'value' => '24–48h', 'label' => 'UK dispatch' ),
						array( 'value' => '100%', 'label' => 'Batch-matched COAs' ),
					),
					array(
						'fields' => array(
							'value' => bioplus_f( 'text', __( 'Value', 'bioplus' ) ),
							'label' => bioplus_f( 'text', __( 'Label', 'bioplus' ) ),
						),
					)
				),
			),
		),

		'icon-cards'         => array(
			'title'  => __( 'Icon Cards', 'bioplus' ),
			'icon'   => 'eicon-icon-box',
			'fields' => array(
				'eyebrow'    => bioplus_f( 'text', __( 'Eyebrow', 'bioplus' ), 'Why Researchers Choose BioPlus' ),
				'title'      => bioplus_f( 'textarea', __( 'Title', 'bioplus' ), 'Built for the research community' ),
				'intro'      => bioplus_f( 'textarea', __( 'Intro', 'bioplus' ), '' ),
				'align'      => bioplus_f( 'select', __( 'Heading alignment', 'bioplus' ), 'center', array( 'options' => array( 'center' => 'Centre', 'left' => 'Left' ) ) ),
				'columns'    => bioplus_f( 'select', __( 'Columns', 'bioplus' ), '3', array( 'options' => array( '2' => '2', '3' => '3', '4' => '4' ) ) ),
				'style'      => bioplus_f( 'select', __( 'Card style', 'bioplus' ), 'card', array( 'options' => array( 'card' => __( 'Icon card', 'bioplus' ), 'large' => __( 'Large icon card', 'bioplus' ), 'method' => __( 'Centred method card', 'bioplus' ) ) ) ),
				'background' => bioplus_f( 'select', __( 'Background', 'bioplus' ), 'mist', array( 'options' => array( 'white' => 'White', 'mist' => 'Mist grey' ) ) ),
				'note'       => bioplus_f( 'textarea', __( 'Note below cards', 'bioplus' ), '' ),
				'cards'      => bioplus_f(
					'repeater',
					__( 'Cards', 'bioplus' ),
					array(
						array( 'icon' => 'boxes', 'title' => 'Quality-Focused Manufacturing', 'text' => 'We partner with manufacturing facilities that operate under stringent quality standards and established production protocols to promote consistency and reliability.', 'subtitle' => '' ),
						array( 'icon' => 'microscope', 'title' => 'Rigorous Analytical Testing', 'text' => 'Products are evaluated using advanced analytical techniques to verify purity, identity, and quality specifications before reaching our customers.', 'subtitle' => '' ),
						array( 'icon' => 'eye', 'title' => 'Transparency & Accountability', 'text' => 'We believe researchers should have confidence in the products they purchase. Our commitment to transparency helps ensure consistency, traceability, and trust.', 'subtitle' => '' ),
						array( 'icon' => 'headset', 'title' => 'Responsive Customer Support', 'text' => 'Our team is dedicated to providing timely assistance and knowledgeable support throughout the ordering process and beyond.', 'subtitle' => '' ),
						array( 'icon' => 'truck', 'title' => 'Efficient Order Fulfilment', 'text' => 'Orders approved before our 2pm cut-off are dispatched the same working day from the UK, packed discreetly and tracked door to door.', 'subtitle' => '' ),
						array( 'icon' => 'shield-check', 'title' => 'Built for Researchers', 'text' => 'Everything we do is designed with the needs of the research community in mind — from product selection and quality assurance to customer service and fulfilment.', 'subtitle' => '' ),
					),
					array(
						'fields' => array_merge(
							$card_fields,
							array( 'subtitle' => bioplus_f( 'text', __( 'Subtitle (method cards)', 'bioplus' ) ) )
						),
					)
				),
			),
		),

		'ruo-notice'         => array(
			'title'  => __( 'Research Use Only Notice', 'bioplus' ),
			'icon'   => 'eicon-alert',
			'fields' => array(
				'text' => bioplus_f( 'textarea', __( 'Text', 'bioplus' ), '<strong>Research Use Only.</strong> Products offered by BioPlus Labs are intended solely for laboratory and scientific research purposes. They are not intended for human consumption, therapeutic use, or the diagnosis, treatment, cure, or prevention of any disease.' ),
			),
		),

		/* -------------------------------------------------------- research */
		'research-featured'  => array(
			'title'  => __( 'Research — Featured Compounds', 'bioplus' ),
			'icon'   => 'eicon-product-images',
			'fields' => array(
				'eyebrow'      => bioplus_f( 'text', __( 'Eyebrow', 'bioplus' ), 'Featured compounds' ),
				'title'        => bioplus_f( 'textarea', __( 'Title', 'bioplus' ), 'The most-researched peptides, in one place' ),
				'intro'        => bioplus_f( 'textarea', __( 'Intro', 'bioplus' ), 'From regenerative research to metabolic studies, explore the compounds laboratories investigate most — each batch-tested and supplied as a lyophilised research vial.' ),
				'stat2_value'  => bioplus_f( 'text', __( 'Stat 2 value', 'bioplus' ), 'UK' ),
				'stat2_label'  => bioplus_f( 'text', __( 'Stat 2 label', 'bioplus' ), 'Dispatch' ),
				'stat3_value'  => bioplus_f( 'text', __( 'Stat 3 value', 'bioplus' ), '≥98%' ),
				'stat3_label'  => bioplus_f( 'text', __( 'Stat 3 label', 'bioplus' ), 'Verified purity' ),
				'button_label' => bioplus_f( 'text', __( 'Button', 'bioplus' ), 'Browse all compounds' ),
				'button_url'   => bioplus_f( 'url', __( 'Button link', 'bioplus' ), 'shop' ),
				'image'        => bioplus_f( 'image', __( 'Image', 'bioplus' ), '' ),
				'slugs'        => bioplus_f( 'text', __( 'Compound strip (product slugs)', 'bioplus' ), 'bpc-157, tb-500, tirzepatide, retatrutide, ghk-cu, mots-c' ),
			),
		),

		/* ------------------------------------------------------------- coa */
		'coa-finder'         => array(
			'title'  => __( 'COA Batch Register (search)', 'bioplus' ),
			'icon'   => 'eicon-search',
			'fields' => array(
				'eyebrow' => bioplus_f( 'text', __( 'Eyebrow', 'bioplus' ), 'Batch Register' ),
				'title'   => bioplus_f( 'textarea', __( 'Title', 'bioplus' ), 'Search Certificates of Analysis' ),
				'intro'   => bioplus_f( 'textarea', __( 'Intro', 'bioplus' ), 'Every batch we supply is independently analysed before release. Search by product name or batch number to find the matching certificate. Not every batch has completed analysis yet — certificates also appear on each product page.' ),
			),
		),

		'steps-dark'         => array(
			'title'  => __( 'Numbered Steps (dark)', 'bioplus' ),
			'icon'   => 'eicon-time-line',
			'fields' => array(
				'eyebrow' => bioplus_f( 'text', __( 'Eyebrow', 'bioplus' ), 'Our process' ),
				'title'   => bioplus_f( 'textarea', __( 'Title', 'bioplus' ), 'From sourcing to certificate' ),
				'intro'   => bioplus_f( 'textarea', __( 'Intro', 'bioplus' ), 'A transparent chain of custody from manufacturing through delivery.' ),
				'steps'   => bioplus_f(
					'repeater',
					__( 'Steps', 'bioplus' ),
					array(
						array( 'title' => 'Sourcing', 'text' => 'We partner with facilities operating under stringent quality standards and established production protocols.' ),
						array( 'title' => 'Batch testing', 'text' => 'Each production batch undergoes comprehensive analytical testing to verify identity, purity, and quality specifications.' ),
						array( 'title' => 'Documentation', 'text' => 'Supporting documentation and testing records are maintained to promote accountability and traceability.' ),
						array( 'title' => 'COA access', 'text' => 'Batch-specific Certificates of Analysis are made available in your account once your order ships.' ),
					),
					array(
						'fields' => array(
							'title' => bioplus_f( 'text', __( 'Title', 'bioplus' ) ),
							'text'  => bioplus_f( 'textarea', __( 'Text', 'bioplus' ) ),
						),
					)
				),
			),
		),

		'coa-pillars'        => array(
			'title'  => __( 'Documentation Pillars (split)', 'bioplus' ),
			'icon'   => 'eicon-gallery-grid',
			'fields' => array(
				'eyebrow'       => bioplus_f( 'text', __( 'Eyebrow', 'bioplus' ), 'Certificates of Analysis' ),
				'title'         => bioplus_f( 'textarea', __( 'Title', 'bioplus' ), 'Documentation maintained for every batch' ),
				'intro'         => bioplus_f( 'textarea', __( 'Intro', 'bioplus' ), 'We believe researchers should have confidence in the products they purchase. COA and testing records are maintained to promote consistency, traceability, and trust — and are made available to you once your order ships.' ),
				'button_label'  => bioplus_f( 'text', __( 'Button', 'bioplus' ), 'View your COA' ),
				'button_url'    => bioplus_f( 'url', __( 'Button link', 'bioplus' ), 'account/files' ),
				'button2_label' => bioplus_f( 'text', __( 'Second button', 'bioplus' ), 'Shop tested compounds' ),
				'button2_url'   => bioplus_f( 'url', __( 'Second button link', 'bioplus' ), 'shop' ),
				'cards'         => bioplus_f(
					'repeater',
					__( 'Pillars', 'bioplus' ),
					array(
						array( 'icon' => 'file-check', 'title' => 'Identity verified', 'text' => 'Confirmed molecular identity for each compound.' ),
						array( 'icon' => 'flask-conical', 'title' => 'Purity profiled', 'text' => 'Quantified purity against quality specifications.' ),
						array( 'icon' => 'shield-check', 'title' => 'Traceable', 'text' => 'Records maintained across the supply chain.' ),
						array( 'icon' => 'microscope', 'title' => 'Validated methods', 'text' => 'HPLC, UPLC, MS, and other validated procedures.' ),
					),
					array( 'fields' => $card_fields )
				),
			),
		),

		/* ------------------------------------------------------ calculator */
		'dosage-calculator'  => array(
			'title'  => __( 'Peptide Dosage Calculator', 'bioplus' ),
			'icon'   => 'eicon-number-field',
			'fields' => array(
				'dose_presets'     => bioplus_f( 'text', __( 'Dose presets (mg)', 'bioplus' ), '0.1, 0.25, 0.5, 1, 2.5, 5, 7.5, 10, 12.5, 15' ),
				'strength_presets' => bioplus_f( 'text', __( 'Strength presets (mcg/ml)', 'bioplus' ), '100, 250, 500, 750, 1000, 1500, 2000' ),
				'volume_presets'   => bioplus_f( 'text', __( 'Volume presets (ml)', 'bioplus' ), '0.5, 1.0, 1.5, 2.0, 2.5, 3.0' ),
				'disclaimer'       => bioplus_f( 'textarea', __( 'Disclaimer', 'bioplus' ), 'For laboratory research reference only. Not medical or dosing advice. Products are Research Use Only.' ),
			),
		),

		/* ------------------------------------------------------------- faq */
		'faq-page'           => array(
			'title'  => __( 'FAQ Page (help panel + all questions)', 'bioplus' ),
			'icon'   => 'eicon-help-o',
			'fields' => array(
				'panel_title' => bioplus_f( 'text', __( 'Help panel title', 'bioplus' ), 'Still have questions?' ),
				'panel_text'  => bioplus_f( 'textarea', __( 'Help panel text', 'bioplus' ), "If your question isn't answered here, our UK support team is happy to help — we aim to reply within one working day." ),
				'links'       => bioplus_f(
					'repeater',
					__( '"Also useful" links', 'bioplus' ),
					array(
						array( 'label' => 'Shipping & delivery', 'url' => 'shipping' ),
						array( 'label' => 'Returns & refunds', 'url' => 'legal/returns' ),
						array( 'label' => 'Certificates of Analysis', 'url' => 'certificates-of-analysis' ),
						array( 'label' => 'Dosage calculator', 'url' => 'dosage-calculator' ),
					),
					array(
						'fields' => array(
							'label' => bioplus_f( 'text', __( 'Label', 'bioplus' ) ),
							'url'   => bioplus_f( 'url', __( 'Link', 'bioplus' ) ),
						),
					)
				),
				'items'       => bioplus_f(
					'repeater',
					__( 'Questions', 'bioplus' ),
					bioplus_default_faqs(),
					array(
						'fields' => array(
							'q' => bioplus_f( 'text', __( 'Question', 'bioplus' ) ),
							'a' => bioplus_f( 'textarea', __( 'Answer', 'bioplus' ) ),
						),
					)
				),
			),
		),

		/* --------------------------------------------------------- contact */
		'contact'            => array(
			'title'  => __( 'Contact (details + form)', 'bioplus' ),
			'icon'   => 'eicon-form-horizontal',
			'fields' => array(
				'form_title'     => bioplus_f( 'text', __( 'Form title', 'bioplus' ), 'Send us a message' ),
				'form_text'      => bioplus_f( 'text', __( 'Form intro', 'bioplus' ), 'We typically respond within one working day.' ),
				'email_note'     => bioplus_f( 'textarea', __( 'Email note', 'bioplus' ), 'All enquiries are handled by email so everything stays documented against your order.' ),
				'wholesale_note' => bioplus_f( 'textarea', __( 'Wholesale note', 'bioplus' ), "Interested in wholesale purchasing, lab supply agreements, or bulk pricing? Email us and we'll send trade terms." ),
			),
		),

		/* ------------------------------------------------------- affiliate */
		'affiliate-steps'    => array(
			'title'  => __( 'Affiliate — How It Works', 'bioplus' ),
			'icon'   => 'eicon-time-line',
			'fields' => array(
				'eyebrow' => bioplus_f( 'text', __( 'Eyebrow', 'bioplus' ), 'How it works' ),
				'title'   => bioplus_f( 'textarea', __( 'Title', 'bioplus' ), 'Three steps to start earning' ),
				'steps'   => bioplus_f(
					'repeater',
					__( 'Steps', 'bioplus' ),
					array(
						array( 'icon' => 'user-plus', 'title' => 'Apply', 'text' => 'Submit your details and tell us about your audience or research network.' ),
						array( 'icon' => 'share-2', 'title' => 'Share', 'text' => 'Get a unique referral link and share BioPlus Labs with your network.' ),
						array( 'icon' => 'wallet', 'title' => 'Earn', 'text' => 'Earn competitive commissions on every qualified order placed through your link.' ),
					),
					array( 'fields' => $card_fields )
				),
			),
		),

		'affiliate-signup'   => array(
			'title'  => __( 'Affiliate — Perks & Application Form', 'bioplus' ),
			'icon'   => 'eicon-form-horizontal',
			'fields' => array(
				'eyebrow'    => bioplus_f( 'text', __( 'Eyebrow', 'bioplus' ), 'Why join' ),
				'title'      => bioplus_f( 'textarea', __( 'Title', 'bioplus' ), 'Built to reward our partners' ),
				'form_title' => bioplus_f( 'text', __( 'Form title', 'bioplus' ), 'Apply to the programme' ),
				'form_text'  => bioplus_f( 'text', __( 'Form intro', 'bioplus' ), "Tell us a little about you and we'll be in touch." ),
				'perks'      => bioplus_f(
					'repeater',
					__( 'Perks', 'bioplus' ),
					array(
						array( 'icon' => 'bar-chart-3', 'title' => 'Real-time tracking', 'text' => 'Monitor clicks, conversions, and commissions from your affiliate dashboard.' ),
						array( 'icon' => 'badge-check', 'title' => 'Competitive rates', 'text' => 'Earn on qualified orders with transparent, reliable commission tracking.' ),
						array( 'icon' => 'clock', 'title' => 'Reliable payouts', 'text' => 'Get paid on a consistent schedule for the referrals you drive.' ),
					),
					array( 'fields' => $card_fields )
				),
			),
		),

		/* ------------------------------------------------------- wholesale */
		'wholesale-perks'    => array(
			'title'  => __( 'Wholesale — Numbered Perks', 'bioplus' ),
			'icon'   => 'eicon-number-field',
			'fields' => array(
				'perks' => bioplus_f(
					'repeater',
					__( 'Perks', 'bioplus' ),
					array(
						array( 'icon' => 'percent', 'title' => 'Volume discounts', 'text' => 'Quantity discounts may be available on select products and larger-volume orders.' ),
						array( 'icon' => 'boxes', 'title' => 'Lab supply agreements', 'text' => "Recurring supply arrangements tailored to your laboratory's research needs." ),
						array( 'icon' => 'file-text', 'title' => 'Documentation & COA', 'text' => 'Batch-specific Certificates of Analysis and supporting documentation for traceability.' ),
						array( 'icon' => 'handshake', 'title' => 'Dedicated support', 'text' => 'Work directly with our team on pricing, fulfilment, and account management.' ),
					),
					array( 'fields' => $card_fields )
				),
			),
		),

		'wholesale-form'     => array(
			'title'  => __( 'Wholesale — Quote Request Form', 'bioplus' ),
			'icon'   => 'eicon-form-horizontal',
			'fields' => array(
				'eyebrow' => bioplus_f( 'text', __( 'Eyebrow', 'bioplus' ), 'Request a quote' ),
				'title'   => bioplus_f( 'textarea', __( 'Title', 'bioplus' ), 'Tell us about your requirements' ),
			),
		),

		/* -------------------------------------------------------- shipping */
		'shipping-sections'  => array(
			'title'  => __( 'Policy Cards (icon + paragraphs)', 'bioplus' ),
			'icon'   => 'eicon-post-list',
			'fields' => array(
				'items' => bioplus_f(
					'repeater',
					__( 'Sections', 'bioplus' ),
					bioplus_default_shipping_sections(),
					array(
						'fields' => array(
							'icon'  => bioplus_f( 'icon', __( 'Icon', 'bioplus' ), 'truck' ),
							'title' => bioplus_f( 'text', __( 'Title', 'bioplus' ) ),
							'body'  => bioplus_f( 'textarea', __( 'Paragraphs (blank line between)', 'bioplus' ) ),
						),
					)
				),
			),
		),
	);

	/**
	 * Filter the section registry (add or change sections from a child theme).
	 *
	 * @param array $sections Sections.
	 */
	$sections = apply_filters( 'bioplus_sections', $sections );
	return $sections;
}

/**
 * Shipping & Delivery page content.
 *
 * @return array
 */
function bioplus_default_shipping_sections() {
	return array(
		array(
			'icon'  => 'truck',
			'title' => 'UK Delivery',
			'body'  => "BioPlus Labs dispatches from the United Kingdom on Royal Mail Tracked 24 and Tracked 48 services, with a next-working-day courier option available at checkout. Our office is open Monday to Friday, 9:00 – 18:00. Orders that are submitted, paid, and approved before our 2pm cut-off are dispatched the same working day. Orders received after the cut-off, at weekends, or on bank holidays are processed on the next working day — and any order placed after 18:00 on a Friday is processed the following Monday.\n\nTypical delivery is 1–2 working days for mainland UK. The Scottish Highlands and Islands, Northern Ireland, the Isle of Man, and the Channel Islands may take an additional working day. Delivery estimates are not guarantees and can be affected by carrier service levels, weather, and other factors outside our control.\n\nEvery order is packed in plain, unbranded outer packaging with temperature-appropriate protection, and ships with the batch-matched Certificate of Analysis. Once dispatched, customers receive confirmation and tracking details by email.",
		),
		array(
			'icon'  => 'globe',
			'title' => 'International Delivery',
			'body'  => "We ship to Ireland and selected European destinations. International orders are sent on a tracked service and delivery typically takes 3–7 working days.\n\nCustomers outside the UK are responsible for confirming that the products ordered may lawfully be imported into their country, and for any customs duties, import VAT, or handling charges levied on arrival. Parcels held or refused by customs are not eligible for refund of the original delivery charge.",
		),
		array(
			'icon'  => 'shield-check',
			'title' => 'Privacy & Security',
			'body'  => "Protecting our customers' personal information is a top priority at BioPlus Labs. Our website uses industry-standard SSL (Secure Socket Layer) encryption technology to safeguard sensitive information during transmission.\n\nWe maintain strict privacy practices and take reasonable measures to protect customer data from unauthorised access, disclosure, or misuse. Customer information is used solely for order processing, customer support, account management, and communications related to your purchases.\n\nBioPlus Labs does not sell, rent, or share customer information with third parties except as necessary to process payments, fulfil orders, comply with legal obligations, or provide services directly related to your purchase.",
		),
		array(
			'icon'  => 'rotate-ccw',
			'title' => 'Returns & Refunds',
			'body'  => "Due to the nature of research compounds and laboratory materials, BioPlus Labs generally cannot accept returns once products have been dispatched, as their condition and cold-chain integrity cannot be verified after they leave us. This does not affect your statutory rights under the Consumer Contracts Regulations 2013 or the Consumer Rights Act 2015 where those rights apply.\n\nIf an order arrives damaged, incomplete, or contains an incorrect item, customers should contact our support team within 48 hours of delivery. We will review the issue and, when appropriate, provide a replacement or corrective resolution.\n\nOur goal is to ensure that every customer receives exactly what was ordered and that any legitimate concerns are handled promptly and professionally.",
		),
		array(
			'icon'  => 'clipboard-list',
			'title' => 'Ordering Information',
			'body'  => "Orders may be placed securely through our website twenty-four (24) hours a day, seven (7) days a week. They are reviewed and processed during office hours, Monday to Friday, 9:00 – 18:00; anything placed after 18:00 on a Friday is processed the following Monday.\n\nAfter an order is submitted, payment is successfully processed, and all required verification procedures are completed, the order will be prepared, packaged, and dispatched through one of our approved UK carriers.\n\nCustomers will receive email notifications regarding order status, shipment confirmation, and tracking information when available.",
		),
		array(
			'icon'  => 'credit-card',
			'title' => 'Payment, Pricing & Wholesale',
			'body'  => "BioPlus Labs accepts all major UK credit and debit cards through our secure payment platform. All prices are shown in pounds sterling (GBP) and include UK VAT where applicable. Additional payment methods may be available and will be displayed during checkout.\n\nWe offer both retail and wholesale purchasing options. Quantity discounts may be available on select products and larger-volume orders. Customers interested in wholesale purchasing, laboratory supply agreements, or bulk pricing opportunities are encouraged to contact our team directly.",
		),
		array(
			'icon'  => 'user-circle',
			'title' => 'Account Access & Order History',
			'body'  => "Customers may create an account during checkout or place orders as a guest where available. Creating an account allows customers to view order history, track order status, manage account information, access previous purchases, and speed up future checkouts.\n\nCustomers who choose guest checkout may contact customer support regarding order status or account-related questions.",
		),
	);
}

/**
 * Default arguments for a section.
 *
 * @param string $id Section id.
 * @return array
 */
function bioplus_section_defaults( $id ) {
	$sections = bioplus_sections();
	$out      = array();
	if ( empty( $sections[ $id ] ) ) {
		return $out;
	}
	foreach ( $sections[ $id ]['fields'] as $key => $field ) {
		$out[ $key ] = $field['default'];
	}
	return $out;
}

/**
 * Render a section with its defaults, overridden by $args.
 *
 * @param string $id   Section id.
 * @param array  $args Overrides.
 */
function bioplus_section( $id, $args = array() ) {
	$args = array_merge( bioplus_section_defaults( $id ), (array) $args );
	get_template_part( 'template-parts/sections/' . $id, null, $args );
}

/**
 * Resolve an image field (URL, attachment ID or Elementor media array) to a URL.
 *
 * @param mixed  $value    Value.
 * @param string $fallback Fallback asset path.
 * @return string
 */
function bioplus_image_url( $value, $fallback = '' ) {
	if ( is_array( $value ) ) {
		if ( ! empty( $value['id'] ) ) {
			$url = wp_get_attachment_image_url( (int) $value['id'], 'full' );
			if ( $url ) {
				return $url;
			}
		}
		$value = isset( $value['url'] ) ? $value['url'] : '';
	}
	if ( is_numeric( $value ) && $value ) {
		$url = wp_get_attachment_image_url( (int) $value, 'full' );
		if ( $url ) {
			return $url;
		}
	}
	if ( is_string( $value ) && '' !== $value ) {
		return $value;
	}
	return $fallback ? bioplus_asset( $fallback ) : '';
}

/**
 * Split a comma list.
 *
 * @param string $value Value.
 * @return string[]
 */
function bioplus_csv( $value ) {
	return array_values( array_filter( array_map( 'trim', explode( ',', (string) $value ) ) ) );
}

/**
 * Render a page from a list of sections, unless it has been built in Elementor,
 * in which case the Elementor layout (made of the same sections) is shown.
 *
 * @param array $sections List of [ section_id, args ].
 */
function bioplus_render_page( $sections ) {
	get_header();
	while ( have_posts() ) {
		the_post();
		if ( bioplus_is_elementor_page() ) {
			the_content();
			continue;
		}
		foreach ( $sections as $section ) {
			bioplus_section( $section[0], isset( $section[1] ) ? $section[1] : array() );
		}
		// Anything typed into the page editor is shown after the designed sections.
		if ( '' !== trim( (string) get_post_field( 'post_content', get_the_ID() ) ) && ! has_shortcode( get_post_field( 'post_content', get_the_ID() ), 'woocommerce_my_account' ) ) {
			echo '<div class="' . esc_attr( bioplus_container( 'default', 'bioplus-prose py-12' ) ) . '">';
			the_content();
			echo '</div>';
		}
	}
	get_footer();
}

/**
 * The page-by-page section layout of the original storefront. Used by the page
 * templates and by the setup wizard to build the same pages in Elementor.
 *
 * @return array<string,array>
 */
function bioplus_page_layouts() {
	return array(
		'home'                     => array(
			array( 'hero' ),
			array( 'trust-bar' ),
			array( 'range-feature' ),
			array( 'process-band' ),
			array(
				'product-grid',
				array(
					'eyebrow'      => 'Combination Research',
					'title'        => 'Research peptide stacks',
					'intro'        => 'Pre-blended combination vials that pair complementary research compounds in a single lyophilised kit.',
					'source'       => 'stacks',
					'background'   => 'mist',
					'button_label' => '',
				),
			),
			array( 'product-grid' ),
			array( 'quality-grid' ),
			array( 'affiliate-band' ),
			array( 'testimonials' ),
			array( 'faq' ),
		),
		'about'                    => array(
			array(
				'page-hero',
				array(
					'eyebrow' => 'About BioPlus Labs',
					'title'   => 'A UK laboratory supplier built on quality you can verify.',
					'intro'   => 'BioPlus Labs was founded to close the trust gap in research chemical supply. We work with vetted manufacturing partners, batch-test everything independently, and publish the paperwork — so UK researchers spend less time verifying suppliers and more time on their work.',
					'crumb'   => 'About',
				),
			),
			array( 'about-intro' ),
			array( 'stats' ),
			array( 'icon-cards' ),
			array( 'ruo-notice' ),
		),
		'research'                 => array(
			array(
				'page-hero',
				array(
					'eyebrow' => 'Research Library',
					'title'   => 'Reference material for the research community',
					'intro'   => 'Background reference on the compound classes we supply and the documentation that ships with them. Provided for reference only — we do not publish preparation, dosing, or administration guidance.',
					'crumb'   => 'Research',
				),
			),
			array( 'research-featured' ),
			array(
				'icon-cards',
				array(
					'eyebrow'    => 'How products are supplied',
					'title'      => 'What arrives, and how it is documented',
					'style'      => 'large',
					'background' => 'white',
					'note'       => 'No statements on this website should be interpreted as medical advice or as a claim that any product can diagnose, treat, cure, mitigate, or prevent any disease, condition, or illness. Researchers are solely responsible for understanding the properties, handling requirements, and lawful use of all products.',
					'cards'      => array(
						array( 'icon' => 'snowflake', 'title' => 'Storage on arrival', 'text' => 'Every vial ships with its storage conditions printed on the label — sealed, protected from light, at 2–8 °C.', 'subtitle' => '' ),
						array( 'icon' => 'beaker', 'title' => 'What we supply', 'text' => 'Lyophilised compounds in sealed, tamper-evident vials, plus bacteriostatic water as a separate laboratory consumable.', 'subtitle' => '' ),
						array( 'icon' => 'clock', 'title' => 'Documentation', 'text' => 'Each batch carries a Certificate of Analysis recording identity and purity, searchable by batch number.', 'subtitle' => '' ),
					),
				),
			),
		),
		'certificates-of-analysis' => array(
			array(
				'page-hero',
				array(
					'eyebrow' => 'Certificates of Analysis',
					'title'   => 'Every batch is documented — search it by product or batch number.',
					'intro'   => 'The integrity of scientific research depends on the quality of the materials used. Every production batch is evaluated using advanced analytical techniques before reaching researchers.',
					'crumb'   => 'Certificates of Analysis',
				),
			),
			array( 'coa-finder' ),
			array(
				'icon-cards',
				array(
					'eyebrow'    => 'Testing methodology',
					'title'      => 'Verified by validated analytical procedures',
					'style'      => 'method',
					'background' => 'white',
					'cards'      => array(
						array( 'icon' => 'scan-line', 'title' => 'HPLC', 'subtitle' => 'High-Performance Liquid Chromatography', 'text' => 'Separates and quantifies compounds to assess purity and detect impurities.' ),
						array( 'icon' => 'beaker', 'title' => 'UPLC', 'subtitle' => 'Ultra-Performance Liquid Chromatography', 'text' => 'Higher-resolution chromatography for precise purity and identity profiling.' ),
						array( 'icon' => 'microscope', 'title' => 'MS', 'subtitle' => 'Mass Spectrometry', 'text' => 'Confirms molecular identity and mass to verify the correct compound.' ),
					),
				),
			),
			array( 'steps-dark' ),
			array( 'coa-pillars' ),
		),
		'dosage-calculator'        => array(
			array(
				'page-hero',
				array(
					'eyebrow' => 'Research Tools',
					'title'   => 'Peptide Dosage Calculator',
					'intro'   => 'Enter the details to calculate your peptide dosage. A reconstitution reference tool for laboratory research workflows.',
					'crumb'   => 'Dosage Calculator',
				),
			),
			array( 'dosage-calculator' ),
		),
		'faq'                      => array(
			array(
				'page-hero',
				array(
					'eyebrow' => 'Questions & Answers',
					'title'   => 'Peptides & research FAQ',
					'intro'   => 'Common questions about research peptides, storage, reconstitution, and how BioPlus Labs operates. All products are Research Use Only.',
					'crumb'   => 'FAQ',
				),
			),
			array( 'faq-page' ),
		),
		'contact'                  => array(
			array(
				'page-hero',
				array(
					'eyebrow' => 'Contact',
					'title'   => "We're here to help",
					'intro'   => 'Questions about products, ordering, delivery, wholesale, or your account? Our support team aims to respond to every enquiry within one working day.',
					'crumb'   => 'Contact',
				),
			),
			array( 'contact' ),
		),
		'affiliate'                => array(
			array(
				'page-hero',
				array(
					'eyebrow' => 'Affiliate Programme',
					'title'   => 'Partner with BioPlus Labs and earn on every referral.',
					'intro'   => 'Researchers, content creators, and labs can join our affiliate programme to share BioPlus Labs with their network and earn commissions on qualified orders.',
					'crumb'   => 'Affiliate',
				),
			),
			array( 'affiliate-steps' ),
			array( 'affiliate-signup' ),
		),
		'wholesale'                => array(
			array(
				'page-hero',
				array(
					'eyebrow' => 'Wholesale Programme',
					'title'   => 'Wholesale, bulk pricing & laboratory supply agreements',
					'intro'   => 'BioPlus Labs offers both retail and wholesale purchasing options. Customers interested in wholesale purchasing, laboratory supply agreements, or bulk-pricing opportunities are encouraged to contact our team directly.',
					'crumb'   => 'Wholesale',
				),
			),
			array( 'wholesale-perks' ),
			array( 'wholesale-form' ),
		),
		'shipping'                 => array(
			array(
				'page-hero',
				array(
					'eyebrow' => 'Shipping & Delivery',
					'title'   => 'Shipping, delivery & ordering information',
					'intro'   => 'Everything you need to know about how BioPlus Labs processes, protects, and fulfils your orders.',
					'crumb'   => 'Shipping & Delivery',
				),
			),
			array( 'shipping-sections' ),
		),
	);
}

/**
 * Render one of the stock layouts.
 *
 * @param string $key Layout key.
 */
function bioplus_render_layout( $key ) {
	$layouts = bioplus_page_layouts();
	bioplus_render_page( isset( $layouts[ $key ] ) ? $layouts[ $key ] : array() );
}
