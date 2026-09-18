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
        ? '<div class="yy-membership-strip"><div><b>18 款工具全部免费公测</b><p>无需登录，表格继续在浏览器本地处理。欢迎使用和反馈；未经许可请勿复制、转载或转售本站代码与工具。</p></div><a href="#tools">立即使用</a></div>'
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
  function decorateToolBrand() {
    if (document.querySelector('.yy-brand-assist')) return;
    if (!document.querySelector('#yy-brand-style')) document.head.insertAdjacentHTML('beforeend', `<style id="yy-brand-style">.yy-brand-assist{display:inline-flex;align-items:center;gap:10px;margin-top:14px;padding:9px 13px;color:#303752;font:500 12px/1.45 Inter,"PingFang SC","Microsoft YaHei",sans-serif;border:1px solid rgba(91,92,226,.16);border-radius:13px;background:linear-gradient(135deg,rgba(240,241,255,.92),rgba(237,249,255,.92));box-shadow:0 8px 22px rgba(65,67,189,.07)}.yy-brand-assist-mark{display:grid;width:30px;height:30px;flex:0 0 30px;place-items:center;color:#fff;font-size:14px;font-weight:900;border-radius:9px;background:linear-gradient(135deg,#5b5ce2,#70c6ff)}.yy-brand-assist div{display:grid;gap:1px}.yy-brand-assist b{color:#4b4db0;font-size:11px}.yy-brand-assist em{font-style:normal}.yy-brand-footer{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:7px;margin-top:9px;color:#7b8295;font:500 11px/1.5 Inter,"PingFang SC","Microsoft YaHei",sans-serif}.yy-brand-footer b{color:#5b5ce2}</style>`);
    const slogans = {
      'freshman-helper.html': '先认识名字，再记住每一个独特的人。',
      'yunyun-memory.html': '读准每个名字，是认真认识一个人的开始。',
      'excel-to-vcf.html': '少一次手工录入，多一点联系效率。',
      'student-roster-cleaner.html': '先发现问题，再放心使用名单。',
      'table-match-helper.html': '字段叫法可以不同，信息仍然能准确找到。',
      'multi-table-merger.html': '表格可以很多，关系要一步一步说清楚。',
      'table-splitter.html': '一张总表，按需要分给正确的人。',
      'template-collection-merger.html': '收表、核对、汇总，一次完成。',
      'table-diff-helper.html': '哪里新增、哪里变化，一眼看清。',
      'table-summary-helper.html': '不学数据透视表，也能把情况统计明白。',
      'grade-analysis-helper.html': '让成绩数字变成可以行动的线索。',
      'material-collection-checker.html': '谁已交、谁未交、缺什么，清清楚楚。',
      'batch-file-renamer.html': '文件名整齐，后续查找就轻松。',
      'notice-text-generator.html': '重复通知交给模板，重要内容由你把关。',
      'table-privacy-masker.html': '先处理敏感信息，再安心分享。',
      'batch-document-generator.html': '一张名单，一次生成每个人的专属文档。',
      'group-seat-planner.html': '随机有依据，分组也可以兼顾均衡。',
      'attendance-summary-helper.html': '每天的出勤情况，整理后更容易看清。'
    };
    const slogan = slogans[file] || '把重复工作交给工具，把时间留给重要的事。';
    const html = `<div class="yy-brand-assist"><span class="yy-brand-assist-mark">云</span><div><b>云云子小助手</b><em>${escapeHtml(slogan)}</em></div></div>`;
    const anchor = document.querySelector('.privacy, .privacy-note');
    if (anchor) anchor.insertAdjacentHTML('afterend', html);
    else {
      const hero = document.querySelector('.hero-card, .hero, main h1')?.closest('.hero-card, .hero, section, main');
      if (hero) hero.insertAdjacentHTML('beforeend', html);
      else document.body.insertAdjacentHTML('afterbegin', html);
    }
    const footer = document.querySelector('footer');
    if (footer && !footer.querySelector('.yy-brand-footer')) footer.insertAdjacentHTML('beforeend', '<div class="yy-brand-footer"><b>云云子工具箱</b><span>把重复工作交给工具，把时间留给重要的人和事。</span></div>');
  }
  if (file === 'index.html') decorateHome();
  else if (config.tools[file]) { decorateToolBrand(); buildGuide(config.tools[file]); }
})();
