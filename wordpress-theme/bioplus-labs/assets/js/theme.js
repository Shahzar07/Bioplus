/**
 * BioPlus Labs — front-end behaviour.
 *
 * Plain JavaScript replacements for the storefront's React state: header,
 * mobile menu, search overlay, cart drawer, product options, accordion, tabs,
 * dosage calculator, COA search, lead forms, age gate, checkout extras and the
 * bank-transfer payment window. Everything initialises per element, so
 * Elementor's live preview can re-run it on a freshly rendered widget.
 */
(function () {
	'use strict';

	var data = window.bioplusData || {};
	var i18n = data.i18n || {};

	/* ----------------------------------------------------------- helpers */

	function $(sel, root) { return (root || document).querySelector(sel); }
	function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

	/** Swap an element between its data-on / data-off class lists. */
	function swap(el, on) {
		if (!el) { return; }
		var cls = el.getAttribute(on ? 'data-on' : 'data-off');
		if (cls !== null) { el.className = cls; }
	}

	function show(el, display) {
		if (!el) { return; }
		el.classList.remove('hidden');
		if (display) { el.classList.add(display); }
	}

	function hide(el, display) {
		if (!el) { return; }
		if (display) { el.classList.remove(display); }
		el.classList.add('hidden');
	}

	function once(el, key) {
		var flag = 'bp' + key;
		if (el.dataset[flag]) { return false; }
		el.dataset[flag] = '1';
		return true;
	}

	function post(action, fields, files) {
		var body = new FormData();
		body.append('action', action);
		Object.keys(fields || {}).forEach(function (k) { body.append(k, fields[k]); });
		Object.keys(files || {}).forEach(function (k) { body.append(k, files[k]); });
		return fetch(data.ajaxUrl, { method: 'POST', body: body, credentials: 'same-origin' })
			.then(function (res) {
				return res.json().catch(function () { return {}; }).then(function (json) {
					json = json || {};
					json.httpOk = res.ok;
					return json;
				});
			});
	}

	function money(n) {
		var sym = data.currency || '£';
		var whole = Math.abs(n - Math.round(n)) < 0.005;
		var str = whole ? Math.round(n).toLocaleString('en-GB') : n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
		return sym + str;
	}

	function lockScroll(lock) {
		document.documentElement.style.overflow = lock ? 'hidden' : '';
	}

	/* ------------------------------------------------------------ header */

	function initHeader() {
		var bar = $('[data-header-bar]');
		if (bar && once(bar, 'hdr')) {
			var onScroll = function () {
				var cls = window.scrollY > 8 ? bar.getAttribute('data-scroll-class') : bar.getAttribute('data-top-class');
				if (bar.className !== cls) { bar.className = cls; }
			};
			onScroll();
			window.addEventListener('scroll', onScroll, { passive: true });
		}

		var nav = $('[data-mobile-nav]');
		if (nav && once(nav, 'nav')) {
			var backdrop = $('[data-mobile-backdrop]', nav);
			var panel = $('[data-mobile-panel]', nav);
			var opener = $('[data-mobile-open]');
			var setOpen = function (open) {
				nav.classList.toggle('pointer-events-none', !open);
				backdrop.classList.toggle('opacity-100', open);
				backdrop.classList.toggle('opacity-0', !open);
				panel.classList.toggle('translate-x-0', open);
				panel.classList.toggle('-translate-x-full', !open);
				if (opener) { opener.setAttribute('aria-expanded', open ? 'true' : 'false'); }
				lockScroll(open);
			};
			if (opener) { opener.addEventListener('click', function () { setOpen(true); }); }
			backdrop.addEventListener('click', function () { setOpen(false); });
			$$('[data-mobile-close]', nav).forEach(function (b) { b.addEventListener('click', function () { setOpen(false); }); });
			$$('a', panel).forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
			document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setOpen(false); } });
		}
	}

	/* ------------------------------------------------------------ search */

	function initSearch() {
		var overlay = $('[data-search-overlay]');
		if (!overlay || !once(overlay, 'search')) { return; }
		var input = $('[data-search-input]', overlay);
		var list = $('[data-search-results]', overlay);
		var label = $('[data-search-label]', overlay);
		var empty = $('[data-search-empty]', overlay);
		var catalogue = data.catalogue || [];

		function esc(s) {
			return String(s).replace(/[&<>"']/g, function (c) {
				return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
			});
		}

		function render() {
			var q = input.value.trim().toLowerCase();
			var results = q ? catalogue.filter(function (p) { return p.search.indexOf(q) !== -1; }) : catalogue.slice(0, 6);
			label.textContent = q ? results.length + ' ' + (results.length === 1 ? (i18n.result || 'result') : (i18n.results || 'results')) : (i18n.popular || 'Popular products');
			if (!results.length) {
				list.innerHTML = '';
				empty.textContent = (i18n.noMatch || 'No products match') + ' “' + input.value + '”.';
				show(empty);
				return;
			}
			hide(empty);
			list.innerHTML = results.map(function (p) {
				return '<li><a href="' + esc(p.url) + '" class="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-mist">' +
					'<span class="flex h-12 w-10 items-center justify-center rounded-lg bg-white"><img src="' + esc(p.image) + '" alt="" class="object-contain h-11 w-auto" loading="lazy"></span>' +
					'<span class="min-w-0 flex-1"><span class="block truncate text-sm font-semibold">' + esc(p.name) + '</span>' +
					'<span class="block truncate text-xs text-ink-500">' + esc(p.tagline) + '</span></span>' +
					'<span class="text-sm font-bold text-brand-700">' + esc(p.price) + '</span></a></li>';
			}).join('');
		}

		function open() {
			show(overlay);
			input.value = '';
			render();
			lockScroll(true);
			setTimeout(function () { input.focus(); }, 30);
		}
		function close() {
			hide(overlay);
			lockScroll(false);
		}

		$$('[data-search-open]').forEach(function (b) { b.addEventListener('click', open); });
		$$('[data-search-close]', overlay).forEach(function (b) { b.addEventListener('click', close); });
		input.addEventListener('input', render);
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && !overlay.classList.contains('hidden')) { close(); }
		});
	}

	/* -------------------------------------------------------------- cart */

	var drawer = null;

	function setDrawer(open) {
		drawer = drawer || $('[data-cart-drawer]');
		var backdrop = $('[data-cart-backdrop]');
		if (!drawer || !backdrop) { return; }
		drawer.classList.toggle('translate-x-0', open);
		drawer.classList.toggle('translate-x-full', !open);
		backdrop.classList.toggle('opacity-100', open);
		backdrop.classList.toggle('opacity-0', !open);
		backdrop.classList.toggle('pointer-events-none', !open);
		lockScroll(open);
	}

	function applyFragments(fragments) {
		Object.keys(fragments || {}).forEach(function (sel) {
			$$(sel).forEach(function (el) {
				var wrap = document.createElement('div');
				wrap.innerHTML = fragments[sel];
				var next = wrap.firstElementChild;
				if (next) { el.replaceWith(next); }
			});
		});
		if (window.jQuery) { window.jQuery(document.body).trigger('wc_fragments_refreshed'); }
	}

	function cartOp(fields) {
		fields.nonce = data.nonce;
		return post('bioplus_cart', fields).then(function (res) {
			if (!res.success) {
				throw new Error((res.data && res.data.message) || i18n.error);
			}
			applyFragments(res.data.fragments);
			if ($('[data-cart-page]') || document.body.classList.contains('woocommerce-checkout')) {
				window.location.reload();
			}
			return res.data;
		});
	}

	function initCart() {
		if (!once(document.body, 'cart')) { return; }

		document.addEventListener('click', function (e) {
			var t = e.target.closest ? e.target.closest('[data-cart-open],[data-cart-close],[data-cart-backdrop],[data-cart-qty],[data-cart-remove],[data-add-to-cart]') : null;
			if (!t) { return; }

			if (t.hasAttribute('data-cart-open')) { e.preventDefault(); setDrawer(true); return; }
			if (t.hasAttribute('data-cart-close') || t.hasAttribute('data-cart-backdrop')) { e.preventDefault(); setDrawer(false); return; }

			if (t.hasAttribute('data-cart-qty')) {
				e.preventDefault();
				t.disabled = true;
				cartOp({ op: 'set', key: t.getAttribute('data-cart-qty'), qty: t.getAttribute('data-value') })
					.catch(function (err) { window.alert(err.message); })
					.then(function () { t.disabled = false; });
				return;
			}
			if (t.hasAttribute('data-cart-remove')) {
				e.preventDefault();
				cartOp({ op: 'remove', key: t.getAttribute('data-cart-remove') }).catch(function (err) { window.alert(err.message); });
				return;
			}
			if (t.hasAttribute('data-add-to-cart')) {
				e.preventDefault();
				t.disabled = true;
				cartOp({ op: 'add', product_id: t.getAttribute('data-add-to-cart'), qty: t.getAttribute('data-qty') || 1 })
					.then(function () { setDrawer(true); })
					.catch(function (err) { window.alert(err.message); })
					.then(function () { t.disabled = false; });
			}
		});

		document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setDrawer(false); } });

		// Returning via the back button can restore a stale page — refresh the cart.
		window.addEventListener('pageshow', function (e) {
			if (e.persisted) {
				post('bioplus_cart_refresh', {}).then(function (res) { if (res.success) { applyFragments(res.data.fragments); } });
			}
		});
	}

	/* ---------------------------------------------------------- accordion */

	function initAccordions(root) {
		$$('[data-accordion]', root).forEach(function (acc) {
			if (!once(acc, 'acc')) { return; }
			var items = $$('[data-accordion-item]', acc);
			items.forEach(function (item) {
				var trigger = $('[data-accordion-trigger]', item);
				trigger.addEventListener('click', function () {
					var opening = trigger.getAttribute('aria-expanded') !== 'true';
					items.forEach(function (other) {
						var on = other === item && opening;
						$('[data-accordion-trigger]', other).setAttribute('aria-expanded', on ? 'true' : 'false');
						swap($('[data-accordion-icon]', other), on);
						swap($('[data-accordion-panel]', other), on);
					});
				});
			});
		});
	}

	/* -------------------------------------------------------------- tabs */

	function initTabs(root) {
		$$('[data-tabs]', root).forEach(function (tabs) {
			if (!once(tabs, 'tabs')) { return; }
			var buttons = $$('[data-tab]', tabs);
			var chevron = function (btn, active) {
				var svg = btn.querySelector('svg');
				if (!svg) { return; }
				svg.classList.toggle('rotate-90', active);
				svg.classList.toggle('text-ink-400', !active);
			};
			buttons.forEach(function (btn) {
				btn.addEventListener('click', function () {
					var id = btn.getAttribute('data-tab');
					buttons.forEach(function (b) {
						var on = b === btn;
						swap(b, on);
						b.setAttribute('aria-selected', on ? 'true' : 'false');
						chevron(b, on);
						var bar = $('[data-tab-bar]', b);
						if (bar) { bar.className = on ? 'brand-gradient absolute inset-x-2 bottom-0 h-0.5 rounded-full' : 'hidden'; }
					});
					$$('[data-panel]', tabs).forEach(function (p) {
						p.classList.toggle('hidden', p.getAttribute('data-panel') !== id);
					});
				});
			});
		});
	}

	/* ------------------------------------------------------------ product */

	function initProduct(root) {
		$$('[data-product-detail]', root).forEach(function (el) {
			if (!once(el, 'pd')) { return; }
			var variants = JSON.parse(el.getAttribute('data-variants') || '[]');
			var index = 0;
			var qty = 1;
			var name = el.getAttribute('data-product-name');
			var mailto = el.getAttribute('data-mailto');

			var buttons = $$('[data-variant-index]', el);
			var buyRow = $('[data-buy-row]', el);
			var stockBox = $('[data-stock-box]', el);
			var qtyEl = $('[data-qty]', el);
			var addBtn = $('[data-add-selected]', el);
			var addErr = $('[data-add-error]', el);

			function current() { return variants[index]; }

			function update() {
				var v = current();
				$$('[data-price]', el).forEach(function (n) { n.textContent = v.priceLabel; });
				$$('[data-variant-label]', el).forEach(function (n) { n.textContent = v.label; });
				$$('[data-sku],[data-detail-sku]', el).forEach(function (n) { n.textContent = v.sku; });
				$$('[data-strength],[data-detail-strength]', el).forEach(function (n) { n.textContent = v.strength; });
				$$('[data-add-total]', el).forEach(function (n) { n.textContent = money(v.price * qty); });
				qtyEl.textContent = qty;

				var inStock = v.availability === 'in-stock';
				if (inStock) {
					show(buyRow, 'flex');
					hide(stockBox);
				} else {
					hide(buyRow, 'flex');
					show(stockBox);
					var text = $('[data-stock-text]', stockBox);
					var soon = v.availability === 'arriving-soon';
					$('[data-stock-title]', stockBox).textContent = text.getAttribute(soon ? 'data-soon-title' : 'data-out-title');
					text.textContent = text.getAttribute(soon ? 'data-soon' : 'data-out');
					$('[data-notify]', stockBox).setAttribute('href', mailto + encodeURIComponent('Stock enquiry — ' + name + ' ' + v.label));
				}
			}

			buttons.forEach(function (btn) {
				btn.addEventListener('click', function () {
					index = parseInt(btn.getAttribute('data-variant-index'), 10) || 0;
					buttons.forEach(function (b) {
						var on = b === btn;
						swap(b, on);
						b.setAttribute('aria-checked', on ? 'true' : 'false');
					});
					update();
				});
			});

			$$('[data-qty-step]', el).forEach(function (btn) {
				btn.addEventListener('click', function () {
					var max = current().max > 0 ? current().max : 99;
					qty = Math.min(max, Math.max(1, qty + parseInt(btn.getAttribute('data-qty-step'), 10)));
					update();
				});
			});

			if (addBtn) {
				addBtn.addEventListener('click', function () {
					hide(addErr);
					addBtn.disabled = true;
					cartOp({ op: 'add', product_id: current().id, qty: qty })
						.then(function () {
							hide($('[data-add-idle]', addBtn), 'inline-flex');
							show($('[data-add-done]', addBtn), 'inline-flex');
							setDrawer(true);
							setTimeout(function () {
								show($('[data-add-idle]', addBtn), 'inline-flex');
								hide($('[data-add-done]', addBtn), 'inline-flex');
							}, 1800);
						})
						.catch(function (err) {
							addErr.textContent = err.message;
							show(addErr);
						})
						.then(function () { addBtn.disabled = false; });
				});
			}

			var views = $$('[data-view]', el);
			views.forEach(function (btn) {
				btn.addEventListener('click', function () {
					var view = btn.getAttribute('data-view');
					views.forEach(function (b) { swap(b, b === btn); });
					$$('[data-stage]', el).forEach(function (img) {
						img.classList.toggle('hidden', img.getAttribute('data-stage') !== view);
					});
				});
			});

			update();
		});
	}

	/* ----------------------------------------------------------- age gate */

	function initAgeGate() {
		var gate = $('[data-age-gate]');
		if (!gate || !once(gate, 'gate') || !data.ageGate) { return; }
		var KEY = 'bioplus-access-verified-v1';
		var verified = false;
		try { verified = window.localStorage.getItem(KEY) === 'yes'; } catch (e) { verified = false; }
		if (verified) { gate.remove(); return; }

		show(gate, 'flex');
		lockScroll(true);

		var check = $('[data-gate-check]', gate);
		var box = $('[data-gate-box]', gate);
		var enter = $('[data-gate-enter]', gate);
		check.addEventListener('change', function () {
			swap(box, check.checked);
			var tick = box.querySelector('svg');
			if (tick) { tick.classList.toggle('hidden', !check.checked); }
			enter.disabled = !check.checked;
		});
		enter.addEventListener('click', function () {
			try { window.localStorage.setItem(KEY, 'yes'); } catch (e) { /* private mode */ }
			gate.remove();
			lockScroll(false);
		});
		$('[data-gate-leave]', gate).addEventListener('click', function () {
			window.location.href = data.ageGateExit || 'https://www.google.com';
		});
	}

	/* --------------------------------------------------------- calculator */

	function initCalculator(root) {
		$$('[data-dosage-calculator]', root).forEach(function (calc) {
			if (!once(calc, 'calc')) { return; }
			var values = {};

			function recompute() {
				var dose = values.dose || 0;
				var strength = values.strength || 0;
				var volume = values.volume || 0;
				var ml = strength > 0 ? (dose * 1000) / strength : 0;
				var over = ml > volume;
				var pct = volume > 0 ? Math.min(100, (ml / volume) * 100) : 0;

				$('[data-calc-ml]', calc).textContent = over ? '—' : ml.toFixed(2);
				$('[data-calc-units]', calc).textContent = (ml * 100).toFixed(0);
				$('[data-calc-total]', calc).textContent = ((strength * volume) / 1000).toFixed(2);
				$('[data-calc-doses]', calc).textContent = (ml > 0 ? volume / ml : 0).toFixed(1);
				var fill = $('[data-calc-fill]', calc);
				var h = (pct / 100) * 250;
				fill.setAttribute('height', h);
				fill.setAttribute('y', 40 + (250 - h));
				$('[data-calc-over]', calc).classList.toggle('hidden', !over);
				$('[data-calc-stats]', calc).classList.toggle('hidden', over);
			}

			$$('[data-calc-group]', calc).forEach(function (group) {
				var key = group.getAttribute('data-calc-group');
				values[key] = parseFloat(group.getAttribute('data-value')) || 0;
				var presets = $$('[data-preset]', group);
				var other = $('[data-other]', group);
				var wrap = $('[data-other-wrap]', group);
				var input = $('[data-other-input]', group);

				function activate(btn) {
					presets.forEach(function (p) { swap(p, p === btn); });
					swap(other, btn === other);
					if (btn === other) { show(wrap, 'flex'); } else { hide(wrap, 'flex'); }
				}

				presets.forEach(function (btn) {
					btn.addEventListener('click', function () {
						values[key] = parseFloat(btn.getAttribute('data-preset')) || 0;
						activate(btn);
						recompute();
					});
				});
				other.addEventListener('click', function () {
					activate(other);
					input.value = values[key];
					input.focus();
				});
				input.addEventListener('input', function () {
					values[key] = parseFloat(input.value) || 0;
					recompute();
				});
			});
			recompute();
		});
	}

	/* ---------------------------------------------------------- COA finder */

	function initCoa(root) {
		$$('[data-coa-finder]', root).forEach(function (finder) {
			if (!once(finder, 'coa')) { return; }
			var input = $('[data-coa-input]', finder);
			var clear = $('[data-coa-clear]', finder);
			var rows = $$('[data-coa-list] > li', finder);
			var empty = $('[data-coa-empty]', finder);

			function filter() {
				var q = input.value.trim().toLowerCase();
				var shown = 0;
				rows.forEach(function (r) {
					var match = !q || r.getAttribute('data-search').indexOf(q) !== -1;
					r.classList.toggle('hidden', !match);
					if (match) { shown++; }
				});
				$('[data-coa-term]', finder).textContent = input.value;
				empty.classList.toggle('hidden', shown > 0);
				clear.classList.toggle('hidden', !input.value);
			}
			input.addEventListener('input', filter);
			clear.addEventListener('click', function () { input.value = ''; filter(); input.focus(); });
		});
	}

	/* --------------------------------------------------------------- forms */

	function initForms(root) {
		$$('[data-bioplus-form]', root).forEach(function (form) {
			if (!once(form, 'form')) { return; }
			var scope = form.parentElement;
			var success = $('[data-form-success]', scope);
			var errorBox = $('[data-form-error]', scope) || $('[data-form-error]', form);
			var submit = form.querySelector('[type="submit"]');
			var label = submit ? $('[data-submit-label]', submit) : null;
			var original = label ? label.textContent : '';

			function fail(msg) {
				if (!errorBox) { window.alert(msg); return; }
				var text = $('[data-form-error-text]', errorBox) || errorBox;
				text.textContent = msg;
				show(errorBox, 'flex');
			}

			form.addEventListener('submit', function (e) {
				e.preventDefault();
				if (errorBox) { hide(errorBox, 'flex'); }
				if (!form.checkValidity()) {
					var bad = form.querySelector(':invalid');
					if (bad) {
						var name = bad.getAttribute('name') === 'email' ? 'Enter a valid email address.' : 'Please complete the required fields.';
						fail(name);
						bad.focus();
					}
					return;
				}
				var fields = { nonce: data.formNonce };
				new FormData(form).forEach(function (v, k) { fields[k] = v; });
				if (submit) { submit.disabled = true; }
				if (label) { label.textContent = i18n.sending || 'Sending…'; }
				post('bioplus_submit_form', fields).then(function (res) {
					if (res.success) {
						form.reset();
						if (form.getAttribute('data-bioplus-form') === 'newsletter') {
							show(success);
						} else {
							hide(form, 'grid');
							show(success);
							success.scrollIntoView({ behavior: 'smooth', block: 'center' });
						}
					} else {
						fail((res.data && res.data.message) || i18n.error);
					}
				}).catch(function () {
					fail(i18n.error || 'Something went wrong.');
				}).then(function () {
					if (submit) { submit.disabled = false; }
					if (label) { label.textContent = original; }
				});
			});
		});
	}

	/* ---------------------------------------------------------------- copy */

	function initCopy() {
		if (!once(document.documentElement, 'copy')) { return; }
		document.addEventListener('click', function (e) {
			var btn = e.target.closest ? e.target.closest('[data-copy]') : null;
			if (!btn || !navigator.clipboard) { return; }
			navigator.clipboard.writeText(btn.getAttribute('data-copy')).then(function () {
				var a = $('[data-copy-icon]', btn);
				var b = $('[data-copied-icon]', btn);
				hide(a); show(b);
				setTimeout(function () { show(a); hide(b); }, 1600);
			}).catch(function () { /* value is on screen anyway */ });
		});
	}

	/* ------------------------------------------------------ payment window */

	function downscale(file) {
		var MAX = 1600;
		if (!window.createImageBitmap) { return Promise.resolve(file); }
		return createImageBitmap(file).then(function (bitmap) {
			var scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height));
			if (scale === 1 && file.size <= 900000) { return file; }
			var canvas = document.createElement('canvas');
			canvas.width = Math.round(bitmap.width * scale);
			canvas.height = Math.round(bitmap.height * scale);
			var ctx = canvas.getContext('2d');
			if (!ctx) { return file; }
			ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
			return new Promise(function (resolve) {
				canvas.toBlob(function (blob) {
					if (!blob || blob.size >= file.size) { resolve(file); return; }
					resolve(new File([blob], 'payment-screenshot.jpg', { type: 'image/jpeg' }));
				}, 'image/jpeg', 0.85);
			});
		}).catch(function () { return file; });
	}

	function initPaymentWindow() {
		var pw = $('[data-payment-window]');
		if (!pw || !once(pw, 'pw')) { return; }

		var total = (parseInt(pw.getAttribute('data-minutes'), 10) || 20) * 60000;
		var deadline = parseInt(pw.getAttribute('data-placed'), 10) * 1000 + total;
		var hasProof = pw.getAttribute('data-has-proof') === '1';
		var confirmed = pw.getAttribute('data-confirmed') === '1';
		var required = pw.getAttribute('data-proof-required') === '1';
		var orderId = pw.getAttribute('data-order-id');
		var key = pw.getAttribute('data-key');

		var clock = $('[data-pw-clock]', pw);
		var done = $('[data-pw-done]', pw);
		var ring = $('[data-pw-ring]', pw);
		var time = $('[data-pw-time]', pw);
		var caption = $('[data-pw-caption]', pw);
		var title = $('[data-pw-title]', pw);
		var text = $('[data-pw-text]', pw);
		var circ = parseFloat(ring.getAttribute('stroke-dasharray'));
		var timer = null;

		function tick() {
			var remaining = Math.max(0, deadline - Date.now());
			var expired = remaining <= 0;
			var secs = Math.ceil(remaining / 1000);
			var mm = String(Math.floor(secs / 60)).padStart(2, '0');
			var ss = String(secs % 60).padStart(2, '0');
			var urgent = !expired && remaining <= 5 * 60000;
			var colour = expired ? '#8b8f98' : (urgent ? '#dc2626' : '#f85000');

			ring.setAttribute('stroke-dashoffset', String(circ * (1 - (expired ? 0 : remaining / total))));
			ring.setAttribute('stroke', colour);
			time.textContent = mm + ':' + ss;
			time.style.color = colour;
			caption.textContent = caption.getAttribute(expired ? 'data-elapsed' : 'data-remaining');
			title.textContent = title.getAttribute(expired ? 'data-over' : 'data-live');
			text.textContent = text.getAttribute(expired ? 'data-over' : 'data-live');
			clock.className = clock.getAttribute(expired ? 'data-expired' : (urgent ? 'data-urgent' : 'data-normal'));
			if (expired && timer) { clearInterval(timer); timer = null; }
		}

		function stopClock() {
			if (timer) { clearInterval(timer); timer = null; }
			hide(clock, 'flex');
			show(done, 'flex');
		}

		if (confirmed) {
			stopClock();
		} else {
			tick();
			timer = setInterval(tick, 250);
		}

		var fileInput = $('[data-pw-file]', pw);
		var drop = $('[data-pw-drop]', pw);
		var uploaded = $('[data-pw-uploaded]', pw);
		var thumb = $('[data-pw-thumb]', pw);
		var confirmBtn = $('[data-pw-confirm]', pw);
		var hint = $('[data-pw-hint]', pw);
		var errBox = $('[data-pw-error]', pw);

		function error(msg) {
			$('[data-pw-error-text]', errBox).textContent = msg;
			show(errBox, 'flex');
		}

		function busy(on) {
			drop.disabled = on;
			$$('[data-pw-pick]', pw).forEach(function (b) { b.disabled = on; });
			var l = $('[data-pw-drop-label]', drop);
			l.textContent = l.getAttribute(on ? 'data-busy' : 'data-idle');
			$('[data-pw-idle-icon]', drop).classList.toggle('hidden', on);
			$('[data-pw-busy-icon]', drop).classList.toggle('hidden', !on);
		}

		var TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic', 'image/heif'];

		function upload(file) {
			hide(errBox, 'flex');
			if (TYPES.indexOf(file.type) === -1) {
				error('That is not a screenshot. Upload an image of your payment — JPEG, PNG, WebP or HEIC.');
				return;
			}
			busy(true);
			downscale(file).then(function (prepared) {
				if (prepared.size > 8 * 1024 * 1024) {
					throw new Error('That image is too large. Try cropping it to just the payment confirmation.');
				}
				return post('bioplus_payment_proof', { nonce: data.nonce, order_id: orderId, key: key }, { file: prepared });
			}).then(function (res) {
				if (!res.success) { throw new Error((res.data && res.data.message) || 'Upload failed. Please try again.'); }
				thumb.src = res.data.url + '&t=' + Date.now();
				hasProof = true;
				show(uploaded, 'flex');
				hide(drop, 'flex');
				confirmBtn.disabled = false;
				if (hint) { hide(hint); }
			}).catch(function (err) {
				error(err.message || 'Upload failed. Please check your connection and try again.');
			}).then(function () {
				busy(false);
				fileInput.value = '';
			});
		}

		drop.addEventListener('click', function () { fileInput.click(); });
		$$('[data-pw-pick]', pw).forEach(function (b) { b.addEventListener('click', function () { fileInput.click(); }); });
		fileInput.addEventListener('change', function () { if (fileInput.files[0]) { upload(fileInput.files[0]); } });
		var dragCls = (drop.getAttribute('data-drag-class') || '').split(' ');
		drop.addEventListener('dragover', function (e) { e.preventDefault(); dragCls.forEach(function (c) { if (c) { drop.classList.add(c); } }); });
		drop.addEventListener('dragleave', function () { dragCls.forEach(function (c) { if (c) { drop.classList.remove(c); } }); });
		drop.addEventListener('drop', function (e) {
			e.preventDefault();
			dragCls.forEach(function (c) { if (c) { drop.classList.remove(c); } });
			if (e.dataTransfer.files && e.dataTransfer.files[0]) { upload(e.dataTransfer.files[0]); }
		});

		confirmBtn.addEventListener('click', function () {
			if (required && !hasProof) { return; }
			hide(errBox, 'flex');
			confirmBtn.disabled = true;
			var l = $('[data-pw-confirm-label]', confirmBtn);
			l.textContent = confirmBtn.getAttribute('data-busy');
			post('bioplus_confirm_payment', { nonce: data.nonce, order_id: orderId, key: key }).then(function (res) {
				if (!res.success) { throw new Error((res.data && res.data.message) || 'Could not confirm. Please try again.'); }
				stopClock();
				hide($('[data-pw-confirm-wrap]', pw));
				show($('[data-pw-confirmed]', pw), 'flex');
			}).catch(function (err) {
				error(err.message);
				confirmBtn.disabled = false;
			}).then(function () {
				l.textContent = confirmBtn.getAttribute('data-idle');
			});
		});
	}

	/* ------------------------------------------------------------ checkout */

	function initCheckout() {
		var form = $('[data-bioplus-checkout]');
		if (!form || !once(form, 'co')) { return; }
		var ruo = $('[data-ruo]', form);
		var place = $('[data-place-order]', form);

		function syncButton() { place.disabled = !ruo.checked; }
		ruo.addEventListener('change', syncButton);
		syncButton();

		function syncTotal() {
			var table = $('.woocommerce-checkout-review-order-table', form);
			var total = table ? table.getAttribute('data-order-total') : '';
			if (total) { $('[data-place-total]', place).textContent = total; }
		}

		function syncGateways() {
			$$('[data-gateway]', form).forEach(function (label) {
				var radio = label.querySelector('input[type="radio"]');
				var on = radio && radio.checked;
				swap(label, on);
				var desc = $('[data-gateway-desc]', label);
				if (desc) { desc.classList.toggle('hidden', !on); }
				var preview = label.nextElementSibling;
				if (preview && preview.hasAttribute('data-bank-preview')) { preview.classList.toggle('hidden', !on); }
			});
		}
		form.addEventListener('change', function (e) {
			if (e.target && e.target.name === 'payment_method') { syncGateways(); }
			if (e.target && e.target.hasAttribute('data-create-account')) {
				var f = $('[data-create-account-fields]', form);
				if (f) { f.classList.toggle('hidden', !e.target.checked); }
			}
		});

		if (window.jQuery) {
			window.jQuery(document.body).on('updated_checkout', function () {
				syncTotal();
				syncGateways();
				syncButton();
			});
			// WooCommerce re-enables the button after a failed submit; keep the declaration rule.
			window.jQuery(document.body).on('checkout_error', function () {
				syncButton();
				window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
			});
		}

		var coupon = $('[data-coupon]', form);
		if (coupon) {
			var input = $('[data-coupon-input]', coupon);
			var apply = $('[data-coupon-apply]', coupon);
			var err = $('[data-coupon-error]', coupon);
			input.addEventListener('input', function () { input.value = input.value.toUpperCase(); });
			input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); apply.click(); } });
			apply.addEventListener('click', function () {
				var params = window.wc_checkout_params;
				var code = input.value.trim();
				hide(err);
				if (!code || !params) { return; }
				apply.disabled = true;
				var body = new FormData();
				body.append('security', params.apply_coupon_nonce);
				body.append('coupon_code', code);
				fetch(params.wc_ajax_url.toString().replace('%%endpoint%%', 'apply_coupon'), { method: 'POST', body: body, credentials: 'same-origin' })
					.then(function (r) { return r.text(); })
					.then(function (html) {
						var tmp = document.createElement('div');
						tmp.innerHTML = html;
						var isError = /woocommerce-error|role="alert"/.test(html);
						if (isError) {
							err.textContent = (tmp.textContent || '').trim();
							show(err);
						} else {
							input.value = '';
						}
						if (window.jQuery) { window.jQuery(document.body).trigger('update_checkout', { update_shipping_method: false }); }
					})
					.catch(function () { err.textContent = i18n.error; show(err); })
					.then(function () { apply.disabled = false; });
			});
		}
	}

	/* ------------------------------------------------------------- misc */

	function initAutoSubmit(root) {
		$$('form[data-auto-submit] select', root).forEach(function (sel) {
			if (!once(sel, 'as')) { return; }
			sel.addEventListener('change', function () { sel.form.submit(); });
		});
	}

	/** Everything that can live inside an Elementor widget. */
	function initScope(root) {
		initAccordions(root);
		initTabs(root);
		initProduct(root);
		initCalculator(root);
		initCoa(root);
		initForms(root);
		initAutoSubmit(root);
	}

	function init() {
		initHeader();
		initSearch();
		initCart();
		initAgeGate();
		initCopy();
		initPaymentWindow();
		initCheckout();
		initScope(document);
	}

	window.BioPlus = { init: initScope, openCart: function () { setDrawer(true); } };

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	// Elementor editor preview: initialise each widget as it renders.
	window.addEventListener('elementor/frontend/init', function () {
		if (window.elementorFrontend && window.elementorFrontend.hooks) {
			window.elementorFrontend.hooks.addAction('frontend/element_ready/global', function ($scope) {
				initScope($scope[0]);
			});
		}
	});
}());
