(() => {
  const config = window.YY_TOOLBOX;
  if (!config) return;
  const file = location.pathname.split('/').pop() || 'index.html';
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function membershipUrl() { return file === 'index.html' ? 'membership.html' : 'membership.html'; }
  function decorateHome() {
    const nav = document.querySelector('.nav-links');
    if (config.mode !== 'free' && nav && !nav.querySelector('[href="membership.html"]')) nav.insertAdjacentHTML('beforeend', '<a class="yy-member-link" href="membership.html">会员方案</a>');
    const actions = document.querySelector('.hero-copy .actions');
    if (config.mode !== 'free' && actions && !actions.querySelector('[href="membership.html"]')) actions.insertAdjacentHTML('beforeend', '<a class="button secondary" href="membership.html">了解会员方案</a>');
    document.querySelectorAll('.tool-card').forEach((card) => {
      const href = card.querySelector('.tool-link')?.getAttribute('href')?.split('/').pop();
      const tool = config.tools[href];
      const tags = card.querySelector('.tags');
      if (!tool || !tags || tags.querySelector('.yy-tier-inline')) return;
      tags.insertAdjacentHTML('beforeend', `<span class="tag yy-tier-inline">${tool.tier === 'free' ? '免费' : '会员'}</span>`);
    });
    const notice = document.querySelector('.notice');
    if (notice && !document.querySelector('.yy-membership-strip')) {
      const content = config.mode === 'free'
        ? '<div class="yy-membership-strip"><div><b>16 款工具全部免费公测</b><p>无需登录，表格继续在浏览器本地处理。欢迎使用和反馈；未经许可请勿复制、转载或转售本站代码与工具。</p></div><a href="#tools">立即使用</a></div>'
        : '<div class="yy-membership-strip"><div><b>免费体验与会员工具分开提供</b><p>免费工具无需登录；会员工具计划通过邮箱验证码授权。当前为本地测试阶段，所有功能仍可直接打开。</p></div><a href="membership.html">查看开通流程</a></div>';
      notice.insertAdjacentHTML('beforebegin', content);
    }
  }
  function buildGuide(tool) {
    const tierName = tool.tier === 'free' ? '免费工具' : '会员工具';
    const steps = tool.steps.map((step, index) => `<div class="yy-guide-step"><b>${index + 1}</b><span>${escapeHtml(step)}</span></div>`).join('');
    const tips = tool.tips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join('');
    const guideId = file.replace(/\.html$/i, '');
    document.body.insertAdjacentHTML('beforeend', `<button class="yy-guide-launch ${tool.tier}" type="button"><span>使用说明</span><small>${tierName}</small></button><div class="yy-guide-mask" role="dialog" aria-modal="true" aria-label="${escapeHtml(tool.name)}使用说明"><section class="yy-guide-dialog"><div class="yy-guide-head"><div><span class="yy-tier ${tool.tier}">${tierName}</span><h2>${escapeHtml(tool.name)}怎么用</h2><p>按照下面的顺序操作，重要结果下载后再关闭页面。</p></div><button class="yy-guide-close" type="button" aria-label="关闭">×</button></div><div class="yy-guide-steps">${steps}</div><div class="yy-guide-tips"><strong>使用前注意</strong><ul>${tips}</ul></div><div class="yy-guide-actions"><button class="yy-guide-button primary yy-guide-done" type="button">开始使用</button><a class="yy-guide-button" href="help.html#${guideId}">查看详细图文教程</a>${tool.tier === 'member' ? `<a class="yy-guide-button" href="${membershipUrl()}">了解会员开通</a>` : ''}<a class="yy-guide-button" href="index.html">返回工具箱</a></div></section></div>`);
    const mask = document.querySelector('.yy-guide-mask');
    const open = () => mask.classList.add('show');
    const close = () => { mask.classList.remove('show'); try { localStorage.setItem(`yy-guide-seen:${file}`, '1'); } catch {} };
    document.querySelector('.yy-guide-launch').addEventListener('click', open);
    document.querySelector('.yy-guide-close').addEventListener('click', close);
    document.querySelector('.yy-guide-done').addEventListener('click', close);
    mask.addEventListener('click', (event) => { if (event.target === mask) close(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
    const suppressAutoOpen = new URLSearchParams(location.search).get('guide') === '0';
    if (!suppressAutoOpen) {
      try { if (!localStorage.getItem(`yy-guide-seen:${file}`)) open(); } catch { open(); }
    }
  }
  if (file === 'index.html') decorateHome();
  else if (config.tools[file]) buildGuide(config.tools[file]);
})();
