<?php
/**
 * Base widget: builds Elementor controls from a section definition and renders
 * the section's template part.
 *
 * @package BioPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Elementor\Widget_Base;

/**
 * One storefront section as an Elementor widget. Subclasses set SECTION.
 */
abstract class BioPlus_Section_Widget extends Widget_Base {

	/** Section id from bioplus_sections(). */
	const SECTION = '';

	/**
	 * Section definition.
	 *
	 * @return array
	 */
	protected function definition() {
		$all = bioplus_sections();
		return isset( $all[ static::SECTION ] ) ? $all[ static::SECTION ] : array(
			'title'  => static::SECTION,
			'icon'   => 'eicon-code',
			'fields' => array(),
		);
	}

	/** @return string */
	public function get_name() {
		return 'bioplus-' . static::SECTION;
	}

	/** @return string */
	public function get_title() {
		$def = $this->definition();
		return $def['title'];
	}

	/** @return string */
	public function get_icon() {
		$def = $this->definition();
		return $def['icon'];
	}

	/** @return string[] */
	public function get_categories() {
		return array( 'bioplus' );
	}

	/** @return string[] */
	public function get_keywords() {
		return array( 'bioplus', 'research', str_replace( '-', ' ', static::SECTION ) );
	}

	/**
	 * Elementor control args for one field.
	 *
	 * @param array $field Field definition.
	 * @return array
	 */
	protected function control_args( $field ) {
		$args = array( 'label' => $field['label'] );
		switch ( $field['type'] ) {
			case 'textarea':
				$args['type']    = Controls_Manager::TEXTAREA;
				$args['rows']    = 4;
				$args['default'] = $field['default'];
				break;
			case 'url':
				$args['type']        = Controls_Manager::URL;
				$args['placeholder'] = __( 'A page path such as "shop", or a full URL', 'bioplus' );
				$args['default']     = array( 'url' => (string) $field['default'] );
				$args['dynamic']     = array( 'active' => true );
				break;
			case 'image':
				$args['type']    = Controls_Manager::MEDIA;
				$args['default'] = array( 'url' => (string) $field['default'] );
				$args['dynamic'] = array( 'active' => true );
				break;
			case 'icon':
				$args['type']    = Controls_Manager::SELECT2;
				$args['options'] = bioplus_icon_choices();
				$args['default'] = $field['default'];
				break;
			case 'number':
				$args['type']    = Controls_Manager::NUMBER;
				$args['min']     = 0;
				$args['default'] = $field['default'];
				break;
			case 'select':
				$args['type']    = Controls_Manager::SELECT;
				$args['options'] = $field['options'];
				$args['default'] = $field['default'];
				break;
			case 'switch':
				$args['type']         = Controls_Manager::SWITCHER;
				$args['return_value'] = 'yes';
				$args['default']      = $field['default'] ? 'yes' : '';
				break;
			default:
				$args['type']        = Controls_Manager::TEXT;
				$args['default']     = $field['default'];
				$args['label_block'] = true;
				$args['dynamic']     = array( 'active' => true );
		}
		return $args;
	}

	/**
	 * Controls: one Content section; repeaters get their own section.
	 */
	protected function register_controls() {
		$def    = $this->definition();
		$simple = array();
		$lists  = array();
		foreach ( $def['fields'] as $key => $field ) {
			if ( 'repeater' === $field['type'] ) {
				$lists[ $key ] = $field;
			} else {
				$simple[ $key ] = $field;
			}
		}

		if ( $simple ) {
			$this->start_controls_section(
				'content',
				array(
					'label' => __( 'Content', 'bioplus' ),
					'tab'   => Controls_Manager::TAB_CONTENT,
				)
			);
			foreach ( $simple as $key => $field ) {
				$this->add_control( $key, $this->control_args( $field ) );
			}
			$this->add_control(
				'bioplus_hint',
				array(
					'type'            => Controls_Manager::RAW_HTML,
					'raw'             => esc_html__( 'Tip: wrap words in [[double brackets]] in a title to give them the orange gradient.', 'bioplus' ),
					'content_classes' => 'elementor-descriptor',
				)
			);
			$this->end_controls_section();
		}

		foreach ( $lists as $key => $field ) {
			$this->start_controls_section(
				'list_' . $key,
				array(
					'label' => $field['label'],
					'tab'   => Controls_Manager::TAB_CONTENT,
				)
			);
			$repeater    = new Repeater();
			$title_field = null;
			foreach ( $field['fields'] as $sub_key => $sub ) {
				$repeater->add_control( $sub_key, $this->control_args( $sub ) );
				if ( null === $title_field && in_array( $sub['type'], array( 'text' ), true ) ) {
					$title_field = $sub_key;
				}
			}
			$this->add_control(
				$key,
				array(
					'label'       => $field['label'],
					'type'        => Controls_Manager::REPEATER,
					'fields'      => $repeater->get_controls(),
					'default'     => array_values( (array) $field['default'] ),
					'title_field' => $title_field ? '{{{ ' . $title_field . ' }}}' : '',
				)
			);
			$this->end_controls_section();
		}
	}

	/**
	 * Normalise Elementor values into the plain args the template expects.
	 *
	 * @param array $fields   Field definitions.
	 * @param array $settings Settings.
	 * @return array
	 */
	protected function normalise( $fields, $settings ) {
		$args = array();
		foreach ( $fields as $key => $field ) {
			$value = isset( $settings[ $key ] ) ? $settings[ $key ] : $field['default'];
			switch ( $field['type'] ) {
				case 'url':
					$value = is_array( $value ) ? ( isset( $value['url'] ) ? $value['url'] : '' ) : (string) $value;
					break;
				case 'image':
					$value = bioplus_image_url( $value );
					break;
				case 'switch':
					$value = 'yes' === $value;
					break;
				case 'repeater':
					$rows = array();
					foreach ( (array) $value as $row ) {
						$rows[] = $this->normalise( $field['fields'], (array) $row );
					}
					$value = $rows;
					break;
			}
			$args[ $key ] = $value;
		}
		return $args;
	}

	/**
	 * Output.
	 */
	protected function render() {
		$def  = $this->definition();
		$args = $this->normalise( $def['fields'], $this->get_settings_for_display() );
		echo '<div class="bioplus-el">';
		bioplus_section( static::SECTION, $args );
		echo '</div>';
	}
}
