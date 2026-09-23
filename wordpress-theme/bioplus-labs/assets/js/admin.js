/**
 * Order screen: attach COA files from the media library.
 */
(function ($) {
	'use strict';
	$(function () {
		var $rows = $('[data-bioplus-coa-rows]');
		if (!$rows.length) { return; }
		var template = wp.template('bioplus-coa-row');
		var frame;

		$(document).on('click', '[data-bioplus-coa-add]', function (e) {
			e.preventDefault();
			if (!frame) {
				frame = wp.media({ title: 'Attach Certificates of Analysis', button: { text: 'Attach' }, multiple: true });
				frame.on('select', function () {
					frame.state().get('selection').each(function (att) {
						$rows.append(template({ id: att.id, name: att.get('filename') }));
					});
				});
			}
			frame.open();
		});

		$(document).on('click', '[data-bioplus-coa-remove]', function (e) {
			e.preventDefault();
			$(this).closest('.bioplus-coa-row').remove();
		});
	});
}(jQuery));
