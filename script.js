function getBaseDomain(hostname) {
	if (!hostname) return '';
	return hostname.replace(/^www\./i, '').toLowerCase();
}

function highlightDiffs(expected, actual) {
	expected = expected || '';
	actual = actual || '';
	// align from the end so that domain endings (e.g. .com) line up
	const offset = actual.length - expected.length;
	let out = '';
	for (let i = 0; i < actual.length; i++) {
		const j = i - offset; // corresponding index in expected, may be out of range
		const expectedChar = (j >= 0 && j < expected.length) ? expected[j] : null;
		const a = actual[i];
		if (expectedChar !== null && expectedChar === a) out += escapeHtml(a);
		else out += `<span class="diff">${escapeHtml(a)}</span>`;
	}
	return out;
}

function escapeHtml(s) {
	return (s + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function parsePlaceAndCode(raw) {
	try {
		const url = new URL(raw);
		const params = url.searchParams;
		const keys = ['privateServerId', 'privateServerLinkCode', 'vipServerId', 'serverId', 'id', 'linkCode'];
		let linkCode = '';
		for (const k of keys) if (params.get(k)) { linkCode = params.get(k); break; }

		// try placeId from param or path
		let placeId = params.get('placeId') || params.get('PlaceId') || '';
		if (!placeId) {
			const parts = url.pathname.split('/').filter(Boolean);
			for (const p of parts) {
				if (/^\d+$/.test(p)) { placeId = p; break; }
			}
		}

		return { placeId, linkCode, host: url.hostname };
	} catch (e) {
		return { placeId: '', linkCode: '', host: '' };
	}
}

function buildRunLink(template, placeId, linkCode) {
	if (!template) return '';
	return template.replace(/\{placeId\}/g, placeId || '').replace(/\{linkCode\}/g, linkCode || '');
}

function buildAppProtocol(placeId, linkCode) {
	if (!placeId) return '';
	let out = `roblox://placeId=${encodeURIComponent(placeId)}`;
	if (linkCode) out += `&linkCode=${encodeURIComponent(linkCode)}`;
	return out;
}

document.addEventListener('DOMContentLoaded', () => {
	const vipLink = document.getElementById('vipLink');
		const nameGame = document.getElementById('nameGame');
	const saveBtn = document.getElementById('saveBtn');
	const openBtn = document.getElementById('openBtn');
	const warning = document.getElementById('warning');
	const domainCompare = document.getElementById('domainCompare');
	const analysis = document.getElementById('analysis');
	const runLink = document.getElementById('runLink');
		const savedTableBody = document.querySelector('#savedTable tbody');

		// load saved list
		let savedList = [];
		function loadSavedList() {
			try {
				savedList = JSON.parse(localStorage.getItem('savedVipLinks') || '[]');
			} catch (e) { savedList = []; }
		}

		function persistSavedList() {
			localStorage.setItem('savedVipLinks', JSON.stringify(savedList));
		}

		function renderSavedTable() {
			if (!savedTableBody) return; // table removed or not present
			savedTableBody.innerHTML = '';
			for (let i = 0; i < savedList.length; i++) {
				const item = savedList[i];
				const tr = document.createElement('tr');
				tr.innerHTML = `
					<td>${escapeHtml(item.name || '')}</td>
					<td class="mono">${escapeHtml(item.url)}</td>
					<td>${escapeHtml(item.placeId || '')}</td>
					<td>${escapeHtml(item.linkCode || '')}</td>
					<td>${item.isReal ? '✓' : '✗'}</td>
					<td>
						<button class="openSaved" data-i="${i}">Mở</button>
						<button class="delSaved" data-i="${i}">Xóa</button>
					</td>`;
				savedTableBody.appendChild(tr);
			}
		}

		// Event delegation for table buttons (Better performance)
		if (savedTableBody) {
			savedTableBody.addEventListener('click', (e) => {
				const btn = e.target.closest('button');
				if (!btn) return;
				const idx = Number(btn.dataset.i);
				if (btn.classList.contains('openSaved')) {
					openSaved(idx);
				} else if (btn.classList.contains('delSaved')) {
					if (confirm('Bạn có chắc chắn muốn xóa link này không?')) {
						savedList.splice(idx, 1);
						persistSavedList();
						renderSavedTable();
					}
				}
			});
		}

		loadSavedList();
		renderSavedTable();

	function doCheck() {
		const raw = vipLink.value.trim();
		const expectedDomain = 'roblox.com';
		const parsed = parsePlaceAndCode(raw);

		const actualDomain = getBaseDomain(parsed.host || '');
		if (domainCompare) domainCompare.innerHTML = highlightDiffs(expectedDomain, actualDomain);

		const isReal = actualDomain && actualDomain === expectedDomain;

		if (warning) {
			if (!isReal) {
				warning.classList.remove('hidden');
				warning.textContent = 'Liên kết đường dẫn này không thuộc về roblox';
			} else {
				warning.classList.add('hidden');
				warning.textContent = '';
			}
		}

		if (analysis) analysis.textContent = `placeId: ${parsed.placeId || '(không tìm thấy)'}\nlinkCode: ${parsed.linkCode || '(không tìm thấy)'}\nhost: ${parsed.host || '(không tìm thấy)'}\n`;

		const appLink = buildAppProtocol(parsed.placeId, parsed.linkCode);
		if (runLink) {
			runLink.href = appLink || '#';
			runLink.textContent = appLink || '(không tạo được link app)';
		}

		return { isReal, parsed };
	}

	if (saveBtn) saveBtn.addEventListener('click', () => {
		const raw = vipLink.value.trim();
		if (!raw) return alert('Không có link để lưu');
		const { isReal, parsed } = doCheck();
		const entry = {
			name: nameGame && nameGame.value ? nameGame.value.trim() : '',
			url: raw,
			placeId: parsed.placeId || '',
			linkCode: parsed.linkCode || '',
			host: parsed.host || '',
			isReal: !!isReal,
			createdAt: Date.now()
		};
		// dedupe by exact url
		if (!savedList.find(x => x.url === entry.url)) savedList.unshift(entry);
		if (savedList.length > 200) savedList.length = 200;
		persistSavedList();
		renderSavedTable();

		if (!isReal) {
			alert('Cảnh báo: liên kết này không thuộc về Roblox. Đã lưu nhưng KHÔNG nên mở.');
		} else {
			alert('Link hợp lệ đã được lưu. Bạn có thể mở bằng nút Mở.');
		}
	});

	function openSaved(idx) {
		const item = savedList[idx];
		if (!item) return;

		if (!item.isReal) {
			alert('Cảnh báo: Link này không hợp lệ (không thuộc domain roblox.com). Hệ thống chặn mở để bảo vệ bạn.');
			return;
		}

		if (item.isReal && item.placeId) {
			if (warning) warning.classList.add('hidden');
			const appLink = buildAppProtocol(item.placeId, item.linkCode);
			if (appLink) { window.location.href = appLink; return; }
		}
		window.open(item.url, '_blank', 'noopener');
	}

	// popup removed: no-op

		if (openBtn) openBtn.addEventListener('click', () => {
			const resultSection = document.getElementById('result');
			const raw = vipLink && vipLink.value ? vipLink.value.trim() : '';
			if (!raw) {
				if (resultSection) resultSection.classList.remove('hidden');
				if (warning) {
					warning.textContent = 'Vui lòng nhập link VIP server trước khi mở';
					warning.classList.remove('hidden');
				}
				return;
			}
			const { isReal, parsed } = doCheck();

		// If domain matches and we have a placeId, open the Roblox app via protocol
		if (isReal && parsed.placeId) {
			resultSection.classList.add('hidden');
			if (warning) warning.classList.add('hidden');
			const appLink = buildAppProtocol(parsed.placeId, parsed.linkCode);
			if (appLink) {
				// attempt to open the Roblox application via custom protocol
				window.location.href = appLink;
				return;
			}
		}

		// Otherwise show analysis and allow user to inspect
		resultSection.classList.remove('hidden');
	});
});

// Xử lý Dark Mode
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Kiểm tra xem người dùng đã lưu chế độ nào chưa
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    
    // Lưu trạng thái vào localStorage
    if (body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});
